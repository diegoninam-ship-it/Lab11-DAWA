"use client";

// src/components/projects/ProjectForm.tsx
// Completa el formulario de "Nuevo Proyecto" del Ejercicio 2.2:
// - Agrega el campo de miembros del equipo (checkboxes).
// - Usa Calendar para la fecha límite (shadcn/ui).
// - Usa Alert para mostrar errores de validación.
// - Usa Spinner para simular la petición al "backend" (en memoria).
//
// Requiere: npx shadcn@latest add dialog input label select textarea
//           calendar popover alert spinner checkbox

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useDashboardData } from "@/lib/data-context";
import type { Priority, ProjectStatus } from "@/types";
import { CalendarIcon, PlusIcon } from "lucide-react";

const PRIORITIES: Priority[] = ["Baja", "Media", "Alta", "Urgente"];
const STATUSES: ProjectStatus[] = [
  "Planificado",
  "En progreso",
  "Completado",
  "Pausado",
];

export function ProjectForm() {
  const { team, addProject } = useDashboardData();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "" as Priority | "",
    status: "Planificado" as ProjectStatus,
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      category: "",
      priority: "",
      status: "Planificado",
    });
    setSelectedMembers([]);
    setDueDate(undefined);
    setError(null);
  }

  function toggleMember(userId: string, checked: boolean) {
    setSelectedMembers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validaciones básicas (se muestran con el componente Alert)
    if (!formData.name.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }
    if (!formData.priority) {
      setError("Selecciona una prioridad para el proyecto.");
      return;
    }
    if (selectedMembers.length === 0) {
      setError("Selecciona al menos un miembro del equipo.");
      return;
    }

    // Culminar la creación de proyectos: simulamos una petición asíncrona
    // al backend con Spinner, y luego persistimos en el estado en memoria.
    setSubmitting(true);
    setTimeout(() => {
      addProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || "General",
        priority: formData.priority as Priority,
        status: formData.status,
        teamMemberIds: selectedMembers,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });
      setSubmitting(false);
      resetForm();
      setOpen(false);
    }, 900);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando
              termines.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>No se pudo guardar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Ej. Sistema de Inventario"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe brevemente el proyecto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="Web, Mobile, Backend..."
                />
              </div>

              <div className="grid gap-2">
                <Label>
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, priority: value as Priority }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((p) => ({
                      ...p,
                      status: value as ProjectStatus,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Fecha límite</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate
                        ? dueDate.toLocaleDateString("es-PE")
                        : "Elegir fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Campo nuevo: miembros del equipo */}
            <div className="grid gap-2">
              <Label>
                Miembros del equipo <span className="text-red-500">*</span>
              </Label>
              <div className="rounded-md border p-3 space-y-2 max-h-40 overflow-y-auto">
                {team.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay miembros registrados aún. Agrégalos en el tab
                    Equipo.
                  </p>
                )}
                {team.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`member-${member.userId}`}
                      checked={selectedMembers.includes(member.userId)}
                      onCheckedChange={(checked) =>
                        toggleMember(member.userId, Boolean(checked))
                      }
                    />
                    <Label
                      htmlFor={`member-${member.userId}`}
                      className="font-normal cursor-pointer"
                    >
                      {member.name}{" "}
                      <span className="text-muted-foreground">
                        ({member.role})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner className="mr-2 h-4 w-4" />}
              {submitting ? "Guardando..." : "Guardar Proyecto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
