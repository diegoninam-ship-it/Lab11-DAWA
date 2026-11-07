"use client";

// src/components/projects/ProjectDetailsDialog.tsx
// Requisito: "Complementar el botón para ver detalles."
// Muestra toda la información del proyecto, incluyendo los miembros asignados.

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboardData } from "@/lib/data-context";
import type { Project } from "@/types";

function priorityVariant(priority: Project["priority"]) {
  switch (priority) {
    case "Urgente":
      return "destructive" as const;
    case "Alta":
      return "default" as const;
    case "Media":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { team, tasks } = useDashboardData();

  if (!project) return null;

  const members = team.filter((m) => project.teamMemberIds.includes(m.userId));
  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {project.name}
            <Badge variant={priorityVariant(project.priority)}>
              {project.priority}
            </Badge>
          </DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Categoría</p>
              <p className="font-medium">{project.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estado</p>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha límite</p>
              <p className="font-medium">
                {project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString("es-PE")
                  : "Sin definir"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Creado</p>
              <p className="font-medium">
                {new Date(project.createdAt).toLocaleDateString("es-PE")}
              </p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2">
              Miembros del equipo ({members.length})
            </p>
            <div className="space-y-2">
              {members.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Sin miembros asignados.
                </p>
              )}
              {members.map((m) => (
                <div key={m.userId} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium leading-none">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2">
              Tareas asociadas ({projectTasks.length})
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {projectTasks.map((t) => (
                <li key={t.id}>
                  {t.description}{" "}
                  <span className="text-muted-foreground">({t.status})</span>
                </li>
              ))}
              {projectTasks.length === 0 && (
                <p className="text-sm text-muted-foreground list-none">
                  Sin tareas registradas.
                </p>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
