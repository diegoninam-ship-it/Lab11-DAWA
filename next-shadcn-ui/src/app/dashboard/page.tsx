"use client";

// src/app/dashboard/page.tsx
// Reemplaza por completo la página del Ejercicio 2 con la lógica de negocio
// de la TAREA: Resumen con métricas reales, Proyectos con CRUD de alta/ver/
// eliminar, Equipo y Tareas con CRUD completo + paginación, y Configuración.

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DashboardDataProvider } from "@/lib/data-context";
import { OverviewSection } from "@/components/overview/OverviewSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { TeamSection } from "@/components/team/TeamSection";
import { TasksSection } from "@/components/tasks/TasksSection";
import { SettingsSection } from "@/components/settings/SettingsSection";

export default function DashboardPage() {
  return (
    <DashboardDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Dashboard de Proyectos
            </h1>
            <p className="text-slate-600">
              Gestiona tus proyectos, equipo y tareas con shadcn/ui
            </p>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="projects">Proyectos</TabsTrigger>
              <TabsTrigger value="team">Equipo</TabsTrigger>
              <TabsTrigger value="tasks">Tareas</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <OverviewSection />
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <ProjectsSection />
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <TeamSection />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <TasksSection />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <SettingsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardDataProvider>
  );
}
