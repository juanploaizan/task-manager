"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CategoryModalProps {
  taskId: string;
}

export function CategoryModal({ taskId }: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit() {
    setIsLoading(true);
    try {
      await axios.post(`/api/tasks/${taskId}/categories`, { name: value });
      toast.success("Categoría creada con éxito.");
      router.refresh();
    } catch (error) {
      toast.error("Algo salió mal.");
    } finally {
      setIsLoading(false);
      setValue("");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-5" variant="ghost">
          <PlusCircle className="h-4 w-4 mr-2" />
          Crear categoría
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear categoría</DialogTitle>
          <DialogDescription>
            Las categorías te ayudan a organizar tus tareas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              defaultValue=""
              className="col-span-3"
              placeholder="Ej: Trabajo, Universidad, etc."
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSubmit}>
            Crear categoría
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
