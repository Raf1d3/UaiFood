import { hash, compare } from 'bcryptjs';
import { UserRepository } from '../repositories/userRepository.js';
//import { generateToken } from '../utils/jwt.ts';

interface RegisterDTO {
    nome: string;
    email: string;
    senha: string;
    data_nascimento: Date;
}

interface LoginDTO {
    email: string;
    senha: string;
}

export class UserService {
    private userRepository = new UserRepository();

    async register(data: RegisterDTO) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Este email já está em uso.');
        }

        const hashedPassword = await hash(data.senha, 10);
        const newUser = await this.userRepository.create({
            ...data,
            senha: hashedPassword,
        }) as Omit<RegisterDTO, 'senha'> & { senha?: string; [key: string]: any };
        
        delete newUser.senha;
        return newUser;
    }

    async updateProfile(userId: string, data: Partial<RegisterDTO>) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuario não encontrado');
        }

        const updatedUser = await this.userRepository.update(userId, data) as Omit<RegisterDTO, 'senha'> & { senha?: string; [key: string]: any };

        delete updatedUser.senha;
        return updatedUser;
    }

    async deleteUser(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuario não encontrado');
        }

        await this.userRepository.delete(userId);
        return { message: 'Usuario deletado com sucesso' };
    }

    async authenticate(data: LoginDTO) {
        const user = await this.userRepository.findByEmail(data.email) as RegisterDTO | null;
        if (!user) {
            throw new Error('Email ou senha inválidos');
        }
        
        const passwordMatch = await compare(data.senha, user.senha);

        if (!passwordMatch) {
            throw new Error('Email ou senha inválidos');
        }

        // Gerar o token JWT
        //const token = generateToken({ userId: user.id });
        const token = 123;
        return token;
    }
}