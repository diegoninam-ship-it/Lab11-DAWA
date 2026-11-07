"use client";

// src/components/overview/OverviewSection.tsx
// Requisito: "Actualizar las métricas de acuerdo con los datos en memoria."
// Todas las cifras vienen de `metrics`, calculado con useMemo en
// data-context.tsx, por lo que se recalculan automáticamente cuando se
// crea/edita/elimina cualquier proyecto, tarea o miembro.

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/lib/data-context";
import {
  CheckCircle2Icon,
  FolderKanbanIcon,
  ListTodoIcon,
  UsersIcon,
} from "lucide-react";

export function OverviewSection() {
  const { metrics, projects, tasks } = useDashboardData();

  const recentTasks = [...tasks].slice(-5).reverse();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proyectos
            </CardTitle>
            <FolderKanbanIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeProjects} en progreso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tareas
            </CardTitle>
            <ListTodoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pendingTasks} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tareas Completadas
            </CardTitle>
            <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.completedTasks} de {metrics.totalTasks} tareas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miembros del equipo
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalTeamMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeTeamMembers} activos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas tareas registradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTasks.map((t) => {
            const project = projects.find((p) => p.id === t.projectId);
            return (
              <div
                key={t.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {project?.name ?? "Sin proyecto"}
                  </p>
                </div>
                <Badge variant="outline">{t.status}</Badge>
              </div>
            );
          })}
          {recentTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no hay tareas registradas.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
