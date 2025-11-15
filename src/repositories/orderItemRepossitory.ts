import prisma from "../../prisma/prismaClient.js";

import type { Prisma, OrderItem } from "@prisma/client";


export class OrderItemRepository {

    async findAllByOrderId(orderId: bigint): Promise<OrderItem[]>{
        return prisma.orderItem.findMany({
            where: { orderId}
        })
    }

    async findById(id: bigint): Promise<OrderItem | null> {
        return prisma.orderItem.findUnique({
            where: { id },
        });
    }

    async update(id: bigint, data: Prisma.OrderUpdateInput): Promise<OrderItem> {
        return prisma.orderItem.update({
            where: { id },
            data,
        });
    }

    async delete(id: bigint): Promise<void> {
        await prisma.orderItem.delete({
            where: { id },
        });
    }
    /*
    async create(data: Prisma.OrderItemCreateInput): Promise<OrderItem> {
        return prisma.orderItem.create({
            data,
        });
    }
    */
}