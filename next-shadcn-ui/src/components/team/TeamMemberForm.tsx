"use client";

// src/components/team/TeamMemberForm.tsx
// CRUD de miembros del equipo. Campos pedidos:
// [userId, role, name, email, position, birthdate, phone, projectId, isActive]
// Usa Calendar para birthdate, Alert para validaciones y Spinner al guardar.

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useDashboardData } from "@/lib/data-context";
import type { TeamMember } from "@/types";
import { CalendarIcon, PencilIcon, PlusIcon } from "lucide-react";

const emptyForm = {
  userId: "",
  role: "",
  name: "",
  email: "",
  position: "",
  phone: "",
  projectId: "",
  isActive: true,
};

export function TeamMemberForm({
  member,
}: {
  member?: TeamMember; // si viene, el formulario edita en lugar de crear
}) {
  const { projects, addTeamMember, updateTeamMember, team } =
    useDashboardData();
  const isEditing = Boolean(member);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (open && member) {
      setForm({
        userId: member.userId,
        role: member.role,
        name: member.name,
        email: member.email,
        position: member.position,
        phone: member.phone,
        projectId: member.projectId,
        isActive: member.isActive,
      });
      setBirthdate(member.birthdate ? new Date(member.birthdate) : undefined);
    } else if (open && !member) {
      setForm(emptyForm);
      setBirthdate(undefined);
    }
  }, [open, member]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      setError("Nombre, email y rol son obligatorios.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Ingresa un email válido.");
      return;
    }
    if (
      !isEditing &&
      team.some((m) => m.userId === form.userId.trim() && form.userId.trim())
    ) {
      setError("Ya existe un miembro con ese userId.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const payload: TeamMember = {
        userId: isEditing ? member!.userId : form.userId.trim() || `u${Date.now()}`,
        role: form.role.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        position: form.position.trim(),
        birthdate: birthdate ? birthdate.toISOString() : "",
        phone: form.phone.trim(),
        projectId: form.projectId,
        isActive: form.isActive,
      };

      if (isEditing) {
        updateTeamMember(member!.userId, payload);
      } else {
        addTeamMember(payload);
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
            Nuevo Miembro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar miembro" : "Nuevo miembro del equipo"}
            </DialogTitle>
            <DialogDescription>
              Completa la información del colaborador.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Revisa el formulario</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={form.userId}
                  disabled={isEditing}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, userId: e.target.value }))
                  }
                  placeholder={isEditing ? undefined : "Se autogenera si se deja vacío"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value }))
                  }
                  placeholder="Frontend Developer"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+51 9XX XXX XXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Posición</Label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, position: e.target.value }))
                  }
                  placeholder="Junior, Semi Senior, Senior..."
                />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthdate
                        ? birthdate.toLocaleDateString("es-PE")
                        : "Elegir fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={birthdate}
                      onSelect={setBirthdate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="grid gap-2">
                <Label>Proyecto asignado</Label>
                <Select
                  value={form.projectId || "none"}
                  onValueChange={(value) =>
                    setForm((p) => ({
                      ...p,
                      projectId: value === "none" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({ ...p, isActive: checked }))
                  }
                />
                <Label htmlFor="isActive">Activo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner className="mr-2 h-4 w-4" />}
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
