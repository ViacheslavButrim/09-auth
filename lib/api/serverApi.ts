import axios from "axios";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { Note } from "./clientApi";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const getServerApi = () => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const getMe = async (): Promise<User> => {
  const api = getServerApi();
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const fetchNotes = async (params: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> => {
  const api = getServerApi();
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>("/notes", {
    params: { ...params, perPage: 12 },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = getServerApi();
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};