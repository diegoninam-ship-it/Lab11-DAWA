"use client";

// src/lib/data-context.tsx
// Fuente única de verdad del Dashboard: proyectos, equipo y tareas viven aquí,
// en memoria (useState), y se consumen desde cualquier sección con useDashboardData().
// Al estar centralizado, el tab "Resumen" puede recalcular métricas en cada render
// sin necesidad de backend (requisito: "Actualizar las métricas de acuerdo con los
// datos en memoria").

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppSettings,
  Project,
  Task,
  TeamMember,
} from "@/types";

// ---------- Datos semilla (simulan una carga inicial desde API) ----------

const seedTeam: TeamMember[] = [
  {
    userId: "u1",
    role: "Frontend Developer",
    name: "María García",
    email: "maria.garcia@empresa.com",
    position: "Senior",
    birthdate: "1994-03-12",
    phone: "+51 987 654 321",
    projectId: "p1",
    isActive: true,
  },
  {
    userId: "u2",
    role: "Backend Developer",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@empresa.com",
    position: "Semi Senior",
    birthdate: "1996-07-01",
    phone: "+51 987 111 222",
    projectId: "p3",
    isActive: true,
  },
  {
    userId: "u3",
    role: "UI/UX Designer",
    name: "Ana López",
    email: "ana.lopez@empresa.com",
    position: "Junior",
    birthdate: "1999-11-23",
    phone: "+51 987 333 444",
    projectId: "p2",
    isActive: false,
  },
];

const seedProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce Platform",
    description: "Plataforma de ventas online con pasarela de pagos.",
    category: "Web",
    priority: "Alta",
    status: "En progreso",
    teamMemberIds: ["u1"],
    dueDate: "2026-12-20",
    createdAt: "2026-09-01",
  },
  {
    id: "p2",
    name: "Mobile App",
    description: "Aplicación móvil de gestión de pedidos.",
    category: "Mobile",
    priority: "Media",
    status: "Planificado",
    teamMemberIds: ["u3"],
    dueDate: "2027-01-15",
    createdAt: "2026-10-05",
  },
  {
    id: "p3",
    name: "API Gateway",
    description: "Gateway centralizado para los microservicios internos.",
    category: "Backend",
    priority: "Urgente",
    status: "En progreso",
    teamMemberIds: ["u2"],
    dueDate: "2026-11-30",
    createdAt: "2026-08-20",
  },
];

const seedTasks: Task[] = [
  {
    id: "t1",
    description: "Implementar autenticación",
    projectId: "p1",
    status: "En progreso",
    priority: "Alta",
    userId: "u1",
    dateline: "2026-11-15",
  },
  {
    id: "t2",
    description: "Diseñar pantalla de perfil",
    projectId: "p2",
    status: "Pendiente",
    priority: "Media",
    userId: "u3",
    dateline: "2026-11-20",
  },
  {
    id: "t3",
    description: "Configurar CI/CD",
    projectId: "p3",
    status: "Completado",
    priority: "Alta",
    userId: "u2",
    dateline: "2026-11-10",
  },
  {
    id: "t4",
    description: "Optimizar queries SQL",
    projectId: "p1",
    status: "En progreso",
    priority: "Urgente",
    userId: "u1",
    dateline: "2026-11-12",
  },
  {
    id: "t5",
    description: "Documentar API endpoints",
    projectId: "p3",
    status: "Pendiente",
    priority: "Baja",
    userId: "u2",
    dateline: "2026-11-25",
  },
];

const seedSettings: AppSettings = {
  companyName: "Mi Empresa S.A.C.",
  notificationsEnabled: true,
  defaultPriority: "Media",
  itemsPerPage: 5,
  language: "es",
};

// ---------- Tipo del contexto ----------

interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalTeamMembers: number;
  activeTeamMembers: number;
  completionRate: number; // %
}

interface DashboardDataContextValue {
  // Proyectos
  projects: Project[];
  addProject: (data: Omit<Project, "id" | "createdAt">) => void;
  removeProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;

  // Equipo (CRUD completo)
  team: TeamMember[];
  addTeamMember: (data: TeamMember) => void;
  updateTeamMember: (userId: string, data: Partial<TeamMember>) => void;
  removeTeamMember: (userId: string) => void;
  getTeamMemberById: (userId: string) => TeamMember | undefined;

  // Tareas (CRUD completo)
  tasks: Task[];
  addTask: (data: Omit<Task, "id">) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;

  // Configuración
  settings: AppSettings;
  updateSettings: (data: Partial<AppSettings>) => void;

  // Métricas derivadas para el tab Resumen
  metrics: DashboardMetrics;
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(
  null
);

let idCounter = 100; // generador simple de ids incrementales para esta sesión
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [team, setTeam] = useState<TeamMember[]>(seedTeam);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [settings, setSettings] = useState<AppSettings>(seedSettings);

  // ----- Proyectos -----
  const addProject: DashboardDataContextValue["addProject"] = (data) => {
    setProjects((prev) => [
      ...prev,
      { ...data, id: nextId("p"), createdAt: new Date().toISOString() },
    ]);
  };

  const removeProject: DashboardDataContextValue["removeProject"] = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Al eliminar un proyecto, se liberan sus tareas asociadas y los miembros quedan sin proyecto asignado.
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    setTeam((prev) =>
      prev.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m))
    );
  };

  const getProjectById = (id: string) => projects.find((p) => p.id === id);

  // ----- Equipo -----
  const addTeamMember: DashboardDataContextValue["addTeamMember"] = (data) => {
    setTeam((prev) => [...prev, data]);
  };

  const updateTeamMember: DashboardDataContextValue["updateTeamMember"] = (
    userId,
    data
  ) => {
    setTeam((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, ...data } : m))
    );
  };

  const removeTeamMember: DashboardDataContextValue["removeTeamMember"] = (
    userId
  ) => {
    setTeam((prev) => prev.filter((m) => m.userId !== userId));
    setTasks((prev) => prev.filter((t) => t.userId !== userId));
  };

  const getTeamMemberById = (userId: string) =>
    team.find((m) => m.userId === userId);

  // ----- Tareas -----
  const addTask: DashboardDataContextValue["addTask"] = (data) => {
    setTasks((prev) => [...prev, { ...data, id: nextId("t") }]);
  };

  const updateTask: DashboardDataContextValue["updateTask"] = (id, data) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const removeTask: DashboardDataContextValue["removeTask"] = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ----- Configuración -----
  const updateSettings: DashboardDataContextValue["updateSettings"] = (
    data
  ) => {
    setSettings((prev) => ({ ...prev, ...data }));
  };

  // ----- Métricas (tab Resumen) -----
  const metrics: DashboardMetrics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t) => t.status === "Completado"
    ).length;
    const pendingTasks = tasks.filter((t) => t.status !== "Completado").length;

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "En progreso")
        .length,
      totalTasks,
      completedTasks,
      pendingTasks,
      totalTeamMembers: team.length,
      activeTeamMembers: team.filter((m) => m.isActive).length,
      completionRate:
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    };
  }, [projects, tasks, team]);

  const value: DashboardDataContextValue = {
    projects,
    addProject,
    removeProject,
    getProjectById,
    team,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    getTeamMemberById,
    tasks,
    addTask,
    updateTask,
    removeTask,
    settings,
    updateSettings,
    metrics,
  };

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) {
    throw new Error(
      "useDashboardData debe usarse dentro de <DashboardDataProvider>"
    );
  }
  return ctx;
}
