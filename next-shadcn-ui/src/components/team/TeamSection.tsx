"use client";

// src/components/team/TeamSection.tsx
// Contenido del tab "Equipo": tabla con CRUD completo de miembros.

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
import { useDashboardData } from "@/lib/data-context";
import { TeamMemberForm } from "@/components/team/TeamMemberForm";
import { Trash2Icon } from "lucide-react";

export function TeamSection() {
  const { team, projects, removeTeamMember } = useDashboardData();

  function projectName(projectId: string) {
    if (!projectId) return "Sin asignar";
    return projects.find((p) => p.id === projectId)?.name ?? "Sin asignar";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Equipo</h2>
          <p className="text-sm text-muted-foreground">
            {team.length} miembro(s) registrado(s)
          </p>
        </div>
        <TeamMemberForm />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Miembros del equipo de trabajo</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Posición</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member) => (
              <TableRow key={member.userId}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>{projectName(member.projectId)}</TableCell>
                <TableCell>
                  <Badge variant={member.isActive ? "default" : "outline"}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <TeamMemberForm member={member} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTeamMember(member.userId)}
                  >
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {team.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay miembros registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
