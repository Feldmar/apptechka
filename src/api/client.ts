import type {
  AuthResponse,
  CreateIntakeData,
  CreateMedicationData,
  Intake,
  LoginData,
  Medication,
  RegisterData,
  User,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler;
}

async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  csrfTokenPromise = fetch(`${API_BASE}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Не удалось получить CSRF token');
      }

      const data = (await response.json()) as {
        csrfToken: string;
      };

      csrfToken = data.csrfToken;

      return csrfToken;
    })
    .finally(() => {
      csrfTokenPromise = null;
    });

  return csrfTokenPromise;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const method = options?.method?.toUpperCase() ?? 'GET';

  const headers = new Headers(options?.headers);

  headers.set('Content-Type', 'application/json');

  if (!SAFE_METHODS.has(method)) {
    const token = await getCsrfToken();

    headers.set('X-CSRF-Token', token);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 401) {
    onUnauthorized?.();
  }

  if (!response.ok) {
    let message = 'Ошибка запроса';

    try {
      const data = (await response.json()) as {
        error?: string;
      };

      message = data.error ?? message;
    } catch {
      console.error('Ошибка обработки ответа');
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  register: (data: RegisterData) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<void>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<User>('/auth/me'),

  getMedications: () => request<Medication[]>('/medications'),

  createMedication: (data: CreateMedicationData) =>
    request<Medication>('/medications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteMedication: (id: string) =>
    request<void>(`/medications/${id}`, {
      method: 'DELETE',
    }),

  markMedicationNotified: (id: string, date: string) =>
    request<Medication>(`/medications/${id}/notified`, {
      method: 'PATCH',
      body: JSON.stringify({ date }),
    }),

  getIntakes: (from?: string, to?: string) => {
    const params = new URLSearchParams();

    if (from) {
      params.set('from', from);
    }

    if (to) {
      params.set('to', to);
    }

    const query = params.toString();

    return request<Intake[]>(`/intakes${query ? `?${query}` : ''}`);
  },

  createIntake: (data: CreateIntakeData) =>
    request<Intake>('/intakes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteIntake: (id: string) =>
    request<void>(`/intakes/${id}`, {
      method: 'DELETE',
    }),
};
