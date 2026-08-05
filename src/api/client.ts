import type {
  AuthResponse,
  CreateIntakeData,
  CreateMedicationData,
  Intake,
  LoginData,
  Medication,
  RegisterData,
  User,
} from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

type UnauthorizedHandler = () => void

let onUnauthorized: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler
}
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  if (response.status === 401) {
    onUnauthorized?.();
  }

  if (!response.ok) {
    let message = "Ошибка запроса";

    try {
      const data = await response.json();
      message = data.error ?? message;
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  register: (data: RegisterData) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () =>
    request<void>("/auth/logout", {
      method: "POST",
    }),

  getMe: () => request<User>("/auth/me"),

  getMedications: () => request<Medication[]>("/medications"),

  createMedication: (data: CreateMedicationData) =>
    request<Medication>("/medications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteMedication: (id: string) =>
    request<void>(`/medications/${id}`, { method: "DELETE" }),

  markMedicationNotified: (id: string, date: string) =>
    request<Medication>(`/medications/${id}/notified`, {
      method: "PATCH",
      body: JSON.stringify({ date }),
    }),

  getIntakes: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString();
    return request<Intake[]>(`/intakes${query ? `?${query}` : ""}`);
  },

  createIntake: (data: CreateIntakeData) =>
    request<Intake>("/intakes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteIntake: (id: string) =>
    request<void>(`/intakes/${id}`, { method: "DELETE" }),
};
