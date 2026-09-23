import api from "./api";
import { encryptData } from "../utils/encryption";

// Defines the TypeScript interfaces for the expected registration input and the user records returned by the API
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

// Secures the user's password and normalizes their email address before creating a new account via the API
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

// Queries the database to find an existing user by their email address, returning the match or null if not found
export const getUserByEmail = async (email: string) => {
  const response = await api.get<User[]>("/users", {
    params: { email: email.trim().toLowerCase() },
  });

  return response.data.length > 0 ? response.data[0] : null;
};

// Sends a PATCH request to selectively update specific fields (like name or password) on an existing user's profile
export const updateUser = async (
  id: string,
  userData: Partial<RegisterData>,
) => {
  const response = await api.patch<User>(`/users/${id}`, userData);
  return response.data;
};