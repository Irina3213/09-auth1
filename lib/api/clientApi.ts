import { instance } from "./api";
import { User, RegisterCredentials, LoginCredentials } from "@/types/user";
import { Note } from "@/types/note";

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface NoteResponse {
  notes: Note[];
  total: number;
  pages: number;
  page: number;
}

// Реєстрація
export const register = async (data: RegisterCredentials): Promise<User> => {
  // const payload = {
  //   ...data,
  //   username: data.username || data.email,
  // };
  // const res = await instance.post("/auth/register", payload);
  // return res.data;

  const res = await instance.post("/auth/register", data);
  return res.data;
};

// Логін
export const login = async (data: LoginCredentials): Promise<User> => {
  const res = await instance.post("/auth/login", data);
  return res.data;
};

// Логаут
export const logout = async (): Promise<void> => {
  await instance.post("/auth/logout");
};

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await instance.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};
// export const checkSession = async (): Promise<User | null> => {
//   try {
//     const res = await instance.get("/auth/session");
//     return res.data || null;
//   } catch {
//     return null;
//   }
// };

// Профіль
export const updateMe = async (data: UpdateUserDto): Promise<User> => {
  const res = await instance.patch("/users/me", data);
  return res.data;
};

// Нотатки
export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const res = await instance.post("/notes", data);
  return res.data;
};

export const fetchNotes = async (
  params: { page?: number; search?: string; tag?: string } = {}
): Promise<NoteResponse> => {
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

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await instance.delete(`/notes/${id}`);
  return res.data;
};
export const getMe = async () => {
  const { data } = await instance.get<User>("/users/me");
  return data;
};
