import prisma from "../../prisma/prismaClient.js";

import type { Prisma, Order } from "@prisma/client";


export class OrderRepository {
    async findAll(): Promise<Order[]> {
        return prisma.order.findMany();
    }

    async findAllByUserId(clientId: bigint): Promise<Order[]> {
        return prisma.order.findMany({
            where: { clientId },
        });
    }

    async findById(id: bigint): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id },
        });
    }

    async update(id: bigint, data: Prisma.OrderItemUpdateInput): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data,
        });
    }

    async delete(id: bigint): Promise<void> {
        await prisma.order.delete({
            where: { id },
        });
    }

    async create(data: Prisma.OrderCreateInput): Promise<Order> {
        return prisma.order.create({
            data,
        });
    }
}