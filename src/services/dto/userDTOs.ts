import type { UserType } from "@prisma/client";

export interface authenticateUserDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  name: string;
  phone: string;
  email: string;
  password: string;
  birthDate: string | Date;
}

export interface IUpdateUserDto {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  birthDate?: string | Date;
  userType?: UserType;
}