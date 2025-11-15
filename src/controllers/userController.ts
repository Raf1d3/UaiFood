import type { Request, Response } from "express";
import { UserService } from "../services/userService.js";
import type {
  RegisterUserDto,
  IUpdateUserDto,
} from "../services/dto/userDTOs.js";

export class UserController {
  private static userService = new UserService();

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, birthDate } = req.body;

      if (!name || !email || !password || !phone || !birthDate) {
        throw new Error(
          "Todos os campos (name, email, password, phone, birthDate) são obrigatórios."
        );
      }

      const userData: RegisterUserDto = {
        name,
        email,
        password,
        phone,
        birthDate,
      };

      const newUser = await UserController.userService.register(userData);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const authPayload = await UserController.userService.authenticate({
        email,
        password,
      });
      res.status(200).json(authPayload);
    } catch (error: any) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        throw new Error("Token não fornecido.");
      }

      const result = await UserController.userService.logout(token);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authenticatedUser = req.user;

      if (!id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      let userIdToDelete: bigint;

      try {
        userIdToDelete = BigInt(id);
      } catch (error) {
        throw new Error("O ID do usuário é inválido ou mal formatado.");
      }

      const result = await UserController.userService.deleteUser(
        userIdToDelete,
        authenticatedUser
      );
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Usuario não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.startsWith("Acesso negado")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dataToUpdate: IUpdateUserDto = req.body;
      const authenticatedUser = req.user;

      if (!id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      let userIdToUpdate: bigint;

      try {
        userIdToUpdate = BigInt(id);
      } catch (error) {
        throw new Error("O ID do usuário é inválido ou mal formatado.");
      }

      if (Object.keys(dataToUpdate).length === 0) {
        throw new Error("Nenhum dado fornecido para atualização.");
      }

      const updatedUser = await UserController.userService.updateProfile(
        userIdToUpdate,
        dataToUpdate,
        authenticatedUser
      );
      res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.message === "Usuario não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.startsWith("Acesso negado")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async viewProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authenticatedUser = req.user;

      let userId: bigint;

      if (!id) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }
      try {
        userId = BigInt(id);
      } catch (error) {
        throw new Error("O ID do usuário é inválido ou mal formatado.");
      }

      const user = await UserController.userService.viewProfile(
        userId,
        authenticatedUser
      );
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "Usuario não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async listAllUsers(req: Request, res: Response) {
    try {
      const users = await UserController.userService.listAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
