import prisma from '../../prisma/prismaClient.js';
// import type { User } from '@prisma/client'; // Remove this line

type User = typeof prisma.user extends { findUnique: (args: any) => Promise<infer T> } ? T : never;

type IUserSaveData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Partial<IUserSaveData>): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }

    async create(data: IUserSaveData): Promise<User> {
        return prisma.user.create({
            data,
        });
    }
}