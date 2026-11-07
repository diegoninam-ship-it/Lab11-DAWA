// src/types/index.ts
// Tipos centrales del Dashboard. Todo el estado vive en memoria (Context API),
// tal como pide la TAREA ("Actualizar las métricas de acuerdo con los datos en memoria").

export type ProjectStatus = "Planificado" | "En progreso" | "Completado" | "Pausado";
export type Priority = "Baja" | "Media" | "Alta" | "Urgente";
export type TaskStatus = "Pendiente" | "En progreso" | "Completado";

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: Priority;
  status: ProjectStatus;
  teamMemberIds: string[]; // Requisito: "Agregar campo para miembros del equipo"
  dueDate?: string; // ISO string, se captura con el componente Calendar
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: string; // ISO string
  phone: string;
  projectId: string | ""; // proyecto al que pertenece (puede no tener uno)
  isActive: boolean;
}

export interface Task {
  id: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  userId: string; // asignado a un miembro del equipo
  dateline: string; // ISO string, fecha límite (se captura con Calendar)
}

export interface AppSettings {
  companyName: string;
  notificationsEnabled: boolean;
  defaultPriority: Priority;
  itemsPerPage: number;
  language: "es" | "en";
}
