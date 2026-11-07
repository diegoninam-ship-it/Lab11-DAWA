"use client";

// src/components/settings/SettingsSection.tsx
// Requisito: "Implementar un formulario y simular configuraciones."
// Se guarda en memoria a través de updateSettings(). Muestra Alert de éxito
// y Spinner mientras "guarda".

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useDashboardData } from "@/lib/data-context";
import type { Priority } from "@/types";
import { CheckCircle2Icon } from "lucide-react";

const PRIORITIES: Priority[] = ["Baja", "Media", "Alta", "Urgente"];

export function SettingsSection() {
  const { settings, updateSettings } = useDashboardData();

  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setSaving(true);

    // Simulación de configuración: no hay backend, solo se persiste en memoria.
    setTimeout(() => {
      updateSettings(form);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Configuración</h2>
        <p className="text-sm text-muted-foreground">
          Ajustes generales del Dashboard (simulados, en memoria).
        </p>
      </div>

      <Card className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
            <CardDescription>
              Estos valores afectan el comportamiento de la aplicación, por
              ejemplo, cuántas tareas se muestran por página.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {saved && (
              <Alert>
                <CheckCircle2Icon className="h-4 w-4" />
                <AlertTitle>Configuración guardada</AlertTitle>
                <AlertDescription>
                  Los cambios se aplicaron correctamente.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="companyName">Nombre de la empresa</Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, companyName: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Prioridad por defecto</Label>
                <Select
                  value={form.defaultPriority}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, defaultPriority: v as Priority }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="grid gap-2">
                <Label htmlFor="itemsPerPage">Tareas por página</Label>
                <Input
                  id="itemsPerPage"
                  type="number"
                  min={1}
                  max={20}
                  value={form.itemsPerPage}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      itemsPerPage: Number(e.target.value) || 1,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="grid gap-2">
                <Label>Idioma</Label>
                <Select
                  value={form.language}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, language: v as "es" | "en" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="notifications"
                  checked={form.notificationsEnabled}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({ ...p, notificationsEnabled: checked }))
                  }
                />
                <Label htmlFor="notifications">Notificaciones activas</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner className="mr-2 h-4 w-4" />}
              {saving ? "Guardando..." : "Guardar configuración"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
