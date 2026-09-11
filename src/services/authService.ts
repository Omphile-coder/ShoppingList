import api from "./api";
import { encryptData } from "../utils/encryption";

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  cellNumber: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  cellNumber?: string;
  cellnumber?: string;
  password?: string;
}

export const registerUser = async (userData: RegisterData) => {
  const encryptedPassword = encryptData(userData.password);
  const formattedEmail = userData.email.trim().toLowerCase();

  const response = await api.post<User>("/users", {
    ...userData,
    email: formattedEmail,
    password: encryptedPassword,
  });

  return response.data;
};

export const getUserByEmail = async (email: string) => {
  const response = await api.get<User[]>("/users", {
    params: { email: email.trim().toLowerCase() },
  });

  return response.data.length > 0 ? response.data[0] : null;
};

export const updateUser = async (
  id: string,
  userData: Partial<RegisterData>,
) => {
  const response = await api.patch<User>(`/users/${id}`, userData);
  return response.data;
};
