import { instance } from "./api";
import {
  User,
  RegisterCredentials,
  LoginCredentials,
  UpdateUserDto,
} from "@/types/user";
import { Note } from "@/types/note";

// --- AUTH ---
export const register = async (data: RegisterCredentials): Promise<User> => {
  const res = await instance.post("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginCredentials): Promise<User> => {
  const res = await instance.post("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await instance.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await instance.get("/auth/session");
  return res.data || null;
};

// --- USER ---
export const updateMe = async (data: UpdateUserDto): Promise<User> => {
  const res = await instance.patch("/users/me", data);
  return res.data;
};

// --- NOTES ---
export interface CreateNoteParams {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const res = await instance.post("/notes", data);
  return res.data;
};

export const fetchNotes = async (
  params: { page?: number; search?: string; tag?: string } = {}
) => {
  const res = await instance.get("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await instance.get(`/notes/${id}`);
  return res.data;
};

export const updateNote = async (
  id: string,
  data: Partial<CreateNoteParams>
): Promise<Note> => {
  const res = await instance.patch(`/notes/${id}`, data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await instance.delete(`/notes/${id}`);
};
