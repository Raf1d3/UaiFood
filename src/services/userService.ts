import { hash, compare } from "bcryptjs";
import { UserRepository } from "../repositories/userRepository.js";
import { UserType, type Prisma, type User } from "@prisma/client";
import type { RegisterUserDto } from "./dto/register-user.dto.js";
import type { authenticateUserDto } from "./dto/auth-user.dto.js";
import type { IUpdateUserDto } from "./dto/update-user.dto.js";

//import { generateToken } from '../utils/jwt.ts';

interface IAuthRequest {
  email: string;
  password: string;
}

export class UserService {
  private userRepository = new UserRepository();

  async register(data: RegisterUserDto): Promise<Omit<User, "password">> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Este email já está em uso.");
    }

    const hashedPassword = await hash(data.password, 10);
    const newUser = await this.userRepository.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: hashedPassword,
      birthDate: new Date(data.birthDate),
      userType: UserType.CLIENT,
    });
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  async updateProfile(
    userId: bigint,
    data: IUpdateUserDto
  ): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    const dataToUpdate: Prisma.UserUpdateInput = {};

    if (data.name) {
      dataToUpdate.name = data.name;
    }
    if (data.email) {
      dataToUpdate.email = data.email;
    }
    if (data.phone) {
      dataToUpdate.phone = data.phone;
    }
    if (data.birthDate) {
      dataToUpdate.birthDate = new Date(data.birthDate); // Seguro, pois só executa se existir
    }

    if (data.password && typeof data.password === "string") {
      data.password = await hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(userId, dataToUpdate);

    const { password, ...safeUser } = updatedUser;

    return safeUser;
  }

  async deleteUser(userId: bigint): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    await this.userRepository.delete(userId);
    return { message: "Usuario deletado com sucesso" };
  }

  async viewProfile(userId: bigint): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async listAllUsers(): Promise<Omit<User, "password">[]> {
    const users = await this.userRepository.findAll();

    if (users.length === 0) {
      throw new Error("Nenhum usuario encontrado");
    }

    return users.map(({ password, ...safeUser }) => safeUser);
  }

  async authenticate(data: authenticateUserDto): Promise<string> {
    const user = (await this.userRepository.findByEmail(
      data.email
    )) as Prisma.UserCreateInput | null;
    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordMatch = await compare(data.password, user.password);

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos");
    }

    // Gerar o token JWT
    //const token = generateToken({ userId: user.id });
    const token = "a123";
    return token;
  }
}
