import type { Request, Response } from 'express';
import { UserService } from '../services/userService.js';

export class UserController {
    private static userService = new UserService();

    static async register(req: Request, res: Response) {
        try {
            const { nome, email, senha, data_nascimento } = req.body;
            const newUser = await UserController.userService.register({ nome, email, senha, data_nascimento });
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            const token = await UserController.userService.authenticate({ email, senha });
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID do usuário é obrigatório' });
            }
            const result = await UserController.userService.deleteUser(id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, email, senha, data_nascimento } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'ID do usuário é obrigatório' });
            }
            const updatedUser = await UserController.userService.updateProfile(id, { nome, email, senha, data_nascimento });
            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}