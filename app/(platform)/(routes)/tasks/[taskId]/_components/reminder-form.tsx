"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reminder } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { repeat } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";

interface ReminderFormProps {
  initialData: Reminder;
  taskId: string;
}

const formSchema = z.object({
  daysBefore: z.string().regex(/^[1-3]$/, "Debe ser un número entre 1 y 3"),
  repeat: z.enum(["NEVER", "DAILY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"]),
});

export function ReminderForm({ initialData, taskId }: ReminderFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      daysBefore: initialData.daysBefore?.toString() || "1",
      repeat: initialData.repeat,
    },
  });

  const { isSubmitting } = form.formState;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/tasks/${taskId}/reminder`, values);
      toast.success("Recordatorio actualizado");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Algo salió mal");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Recordatorio
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          <Badge
            variant="outline"
            className="mt-2 mr-2 inline-flex items-center"
          >
            Notificar: {initialData.daysBefore}{" "}
            {initialData.daysBefore! > 1 ? "días" : "día"} antes
          </Badge>
          {repeat.map((item) => {
            if (item.value === initialData.repeat) {
              return (
                <Badge
                  key={item.value}
                  variant="outline"
                  className="mt-2 inline-flex items-center"
                >
                  Repetir: {item.label}
                </Badge>
              );
            }
          })}
        </>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="daysBefore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="daysBefore">Notificar</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona los días anteriores a la notificación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 día antes</SelectItem>
                      <SelectItem value="2">2 días antes</SelectItem>
                      <SelectItem value="3">3 días antes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="repeat">Repetir</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Recibe notificaciones de manera repetitiva" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {repeat.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button className="mt-2" disabled={isSubmitting} type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
