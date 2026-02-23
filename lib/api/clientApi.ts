import api from "./api";
import { User } from "@/types/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface Note {
  id: string; 
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}

export const register = async (
  body: RegisterRequest
): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
};

export const login = async (
  body: LoginRequest
): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (
  body: { username: string }
): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", body);
  return data;
};

export const fetchNotes = async (params: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      ...params,
      perPage: 12,
    },
  });

  return data;
};

export const fetchNoteById = async (
  id: string
): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (body: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", body);
  return data;
};

export const deleteNote = async (
  id: string
): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get("/users/me");
    return data;
  } catch {
    return null;
  }
};