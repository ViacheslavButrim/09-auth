import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { Note } from "@/types/note";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;

const getServerApi = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const checkSession = async (): Promise<
  AxiosResponse<User>
> => {
  const api = await getServerApi();
  return api.get<User>("/auth/session");
};

export const getMe = async (): Promise<User> => {
  const api = await getServerApi();
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const fetchNotes = async (params: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> => {
  const api = await getServerApi();
  const { data } = await api.get("/notes", {
    params: { ...params, perPage: 12 },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = await getServerApi();
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};