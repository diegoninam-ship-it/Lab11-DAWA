"use client";

// src/components/tasks/TaskForm.tsx
// CRUD de tareas. Campos pedidos:
// [description, projectId, status, priority, userId, dateline]
// Usa Calendar para dateline y Alert para validaciones.

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useDashboardData } from "@/lib/data-context";
import type { Priority, Task, TaskStatus } from "@/types";
import { CalendarIcon, PencilIcon, PlusIcon } from "lucide-react";

const STATUSES: TaskStatus[] = ["Pendiente", "En progreso", "Completado"];
const PRIORITIES: Priority[] = ["Baja", "Media", "Alta", "Urgente"];

export function TaskForm({ task }: { task?: Task }) {
  const { projects, team, addTask, updateTask } = useDashboardData();
  const isEditing = Boolean(task);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pendiente");
  const [priority, setPriority] = useState<Priority | "">("");
  const [userId, setUserId] = useState("");
  const [dateline, setDateline] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setDescription(task.description);
      setProjectId(task.projectId);
      setStatus(task.status);
      setPriority(task.priority);
      setUserId(task.userId);
      setDateline(task.dateline ? new Date(task.dateline) : undefined);
    } else {
      setDescription("");
      setProjectId("");
      setStatus("Pendiente");
      setPriority("");
      setUserId("");
      setDateline(undefined);
    }
    setError(null);
  }, [open, task]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("La descripción de la tarea es obligatoria.");
      return;
    }
    if (!projectId) {
      setError("Selecciona el proyecto al que pertenece la tarea.");
      return;
    }
    if (!priority) {
      setError("Selecciona una prioridad.");
      return;
    }
    if (!userId) {
      setError("Asigna la tarea a un miembro del equipo.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const payload = {
        description: description.trim(),
        projectId,
        status,
        priority: priority as Priority,
        userId,
        dateline: dateline ? dateline.toISOString() : "",
      };

      if (isEditing) {
        updateTask(task!.id, payload);
      } else {
        addTask(payload);
      }

      setSubmitting(false);
      setOpen(false);
    }, 700);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
            <DialogDescription>
              Define el detalle, el proyecto y el responsable de la tarea.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Revisa el formulario</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="¿Qué hay que hacer?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Proyecto <span className="text-red-500">*</span>
                </Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>
                  Asignado a <span className="text-red-500">*</span>
                </Label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {team.map((m) => (
                      <SelectItem key={m.userId} value={m.userId}>
                        {m.name}
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
                  value={status}
                  onValueChange={(v) => setStatus(v as TaskStatus)}
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
                <Label>
                  Prioridad <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Priority)}
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

            <div className="grid gap-2">
              <Label>Fecha límite (dateline)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateline
                      ? dateline.toLocaleDateString("es-PE")
                      : "Elegir fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateline}
                    onSelect={setDateline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner className="mr-2 h-4 w-4" />}
              {submitting ? "Guardando..." : "Guardar tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
