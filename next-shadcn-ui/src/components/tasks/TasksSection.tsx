"use client";

// src/components/tasks/TasksSection.tsx
// Contenido del tab "Tareas": CRUD completo + Pagination (shadcn/ui).

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDashboardData } from "@/lib/data-context";
import { TaskForm } from "@/components/tasks/TaskForm";
import type { Task } from "@/types";
import { Trash2Icon } from "lucide-react";

function statusVariant(status: Task["status"]) {
  switch (status) {
    case "Completado":
      return "default" as const;
    case "En progreso":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function priorityVariant(priority: Task["priority"]) {
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

export function TasksSection() {
  const { tasks, projects, team, removeTask, settings } = useDashboardData();

  const pageSize = settings.itemsPerPage || 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return tasks.slice(start, start + pageSize);
  }, [tasks, currentPage, pageSize]);

  function projectName(id: string) {
    return projects.find((p) => p.id === id)?.name ?? "—";
  }
  function memberName(id: string) {
    return team.find((m) => m.userId === id)?.name ?? "—";
  }

  function goTo(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tareas</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} tarea(s) registrada(s)
          </p>
        </div>
        <TaskForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  {task.description}
                </TableCell>
                <TableCell>{projectName(task.projectId)}</TableCell>
                <TableCell>{memberName(task.userId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.dateline
                    ? new Date(task.dateline).toLocaleDateString("es-PE")
                    : "—"}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <TaskForm task={task} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(task.id)}
                  >
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay tareas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goTo(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === currentPage}
                  onClick={() => goTo(p)}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => goTo(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
