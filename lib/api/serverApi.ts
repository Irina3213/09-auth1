import { instance } from "./api";
import { cookies } from "next/headers";
import { AxiosResponse } from "axios";
import { User } from "@/types/user";
import { Note } from "@/types/note";
import { NoteResponse } from "./clientApi";
export const checkSession = async (): Promise<AxiosResponse<User>> => {
  const cookieStore = await cookies();
  return await instance.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
};
export const fetchServerNotes = async (params = {}): Promise<NoteResponse> => {
  const cookieStore = await cookies();
  const res = await instance.get("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};
export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const res = await instance.get("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};
export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const res = await instance.get(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};
