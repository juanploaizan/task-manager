"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task } from "@prisma/client";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { useState } from "react";
import { CategoryModal } from "./category-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialData: Task;
  taskId: string;
  options: { label: string; value: string }[];
}

export function CategoryForm({
  initialData,
  taskId,
  options,
}: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(initialData.categoryId);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  async function handleSubmit() {
    setIsLoading(true);
    try {
      await axios.patch(`/api/tasks/${taskId}`, { categoryId });
      toast.success("Tarea actualizada");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Error al actualizar la tarea");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Categoría de la tarea
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
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "Sin categoría"}
        </p>
      )}
      {isEditing && (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between mt-4"
                disabled={isLoading}
              >
                {categoryId
                  ? options.find((option) => option.value === categoryId)?.label
                  : "Selecciona una categoría"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar categoría" />
                <CommandEmpty>Ninguna categoría encontrada.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setCategoryId(
                          currentValue === categoryId ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          categoryId === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                  <CommandItem>
                    <CategoryModal taskId={taskId} />
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-x-2 mt-4">
            <Button disabled={isLoading} onClick={handleSubmit}>
              Guardar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
