import prisma from "../../prisma/prismaClient.js";

import type { Prisma, Item } from "@prisma/client";


export class ItemRepository {
    async findAll(): Promise<Item[]> {
        return prisma.item.findMany();
    }

    findAllByCategoryId(categoryId: bigint): Promise<Item[]> {
        return prisma.item.findMany({
            where: { categoryId }
        })
    }

    async findById(id: bigint): Promise<Item | null> {
        return prisma.item.findUnique({
            where: { id },
        });
    }

    async update(id: bigint, data: Prisma.ItemUpdateInput): Promise<Item> {
        return prisma.item.update({
            where: { id },
            data,
        });
    }

    async delete(id: bigint): Promise<void> {
        await prisma.item.delete({
            where: { id },
        });
    }

    async create(data: Prisma.ItemCreateInput): Promise<Item> {
        return prisma.item.create({
            data,
        });
    }

}