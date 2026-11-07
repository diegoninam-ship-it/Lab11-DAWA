"use client";

// src/components/projects/ProjectsSection.tsx
// Contenido del tab "Proyectos" del Dashboard.
// Requisitos cubiertos: ver detalles, eliminar proyectos, miembros del equipo
// (a través de ProjectForm) y culminar la creación de proyectos.

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/lib/data-context";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectDetailsDialog } from "@/components/projects/ProjectDetailsDialog";
import type { Project } from "@/types";
import { EyeIcon, Trash2Icon, UsersIcon } from "lucide-react";

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

export function ProjectsSection() {
  const { projects, team, removeProject } = useDashboardData();
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function openDetails(project: Project) {
    setDetailsProject(project);
    setDetailsOpen(true);
  }

  // Confirmación simple antes de eliminar (requisito: "Implementar el botón
  // para Eliminar proyectos"). Se usa un doble click para no requerir un
  // componente adicional no solicitado en la tarea.
  function handleDeleteClick(id: string) {
    if (pendingDeleteId === id) {
      removeProject(id);
      setPendingDeleteId(null);
    } else {
      setPendingDeleteId(id);
      setTimeout(() => setPendingDeleteId((curr) => (curr === id ? null : curr)), 3000);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Proyectos</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} proyecto(s) registrado(s)
          </p>
        </div>
        <ProjectForm />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const memberCount = project.teamMemberIds.length;
          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={priorityVariant(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">{project.status}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <UsersIcon className="h-4 w-4" />
                  {memberCount} miembro(s)
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDetails(project)}
                >
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Ver detalles
                </Button>
                <Button
                  variant={pendingDeleteId === project.id ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleDeleteClick(project.id)}
                  title={
                    pendingDeleteId === project.id
                      ? "Click de nuevo para confirmar"
                      : "Eliminar proyecto"
                  }
                >
                  <Trash2Icon className="h-4 w-4" />
                  {pendingDeleteId === project.id && (
                    <span className="ml-1">¿Confirmar?</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay proyectos todavía. Crea el primero con el botón "Nuevo
            Proyecto".
          </p>
        )}
      </div>

      <ProjectDetailsDialog
        project={detailsProject}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* team se usa indirectamente dentro de ProjectForm; se referencia aquí
          solo para dejar explícito que esta sección depende del equipo */}
      {team.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Sugerencia: registra miembros del equipo para poder asignarlos a
          proyectos.
        </p>
      )}
    </div>
  );
}
