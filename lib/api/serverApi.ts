import api from "./api";
import { cookies } from "next/headers";
import { AxiosResponse } from "axios";
import { User } from "@/types/user";
import { Note } from "@/types/note";

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const checkServerSession = async (): Promise<AxiosResponse<User>> => {
  const cookieHeader = await getCookieHeader();

  return api.get<User>("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const getMe = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      { credentials: "include" } 
    );
    const data = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
};

export const fetchNotes = async (params: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get("/notes", {
    headers: {
      Cookie: cookieHeader,
    },
    params: { ...params, perPage: 12 },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};