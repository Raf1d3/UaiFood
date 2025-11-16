import prisma from "../../prisma/prismaClient.js";
import { OrderStatus, type Order, type Prisma } from "@prisma/client";
import { OrderRepository } from "../repositories/orderRepossitory.js";

import type { IAuthenticatedUser } from "../@types/express/index.js";
import { ItemRepository } from "../repositories/itemRepository.js";
import { AddressRepository } from "../repositories/addressRepository.js";

import type { CreateOrderDto } from "../schemas/order.schemas.js";

export class OrderService {
  private orderRepository = new OrderRepository();
  private itemRepository = new ItemRepository();
  private addressRepository = new AddressRepository();

  async create(
    authenticatedUser: IAuthenticatedUser,
    data: CreateOrderDto
  ): Promise<Order> {
    const address = await this.addressRepository.findById(data.addressId);
    if (!address) {
      throw new Error("Endereço não encontrado.");
    }
    if (address.userId !== authenticatedUser.id) {
      throw new Error("Acesso negado. Este endereço não pertence a você.");
    }

    const itemIds = data.items.map((item) => item.itemId);
    const itemsInDb = await this.itemRepository.findAllByInIds(itemIds);

    // Garante que todos os itens pedidos foram encontrados no banco
    if (itemsInDb.length !== itemIds.length) {
      throw new Error("Um ou mais itens no pedido não foram encontrados.");
    }

    // --- Transação ---
    // 'prisma.$transaction' garante que ou TUDO funciona, ou NADA é salvo.
    try {
      const newOrder = await prisma.$transaction(async (tx) => {
        // Cria a 'Order' (o "cabeçalho" do pedido)
        const order = await tx.order.create({
          data: {
            paymentMethod: data.paymentMethod,
            status: OrderStatus.PENDING, // Status inicial
            client: { connect: { id: authenticatedUser.id } }, // Conecta ao cliente
            createdBy: { connect: { id: authenticatedUser.id } }, // Adiciona o usuário que criou o pedido
            // (Você pode adicionar 'address' aqui também)
          },
        });

        // Prepara os 'OrderItems'
        const orderItemsData = data.items.map((itemDto) => {
          // Pega o preço do item que buscamos no banco
          const itemDb = itemsInDb.find((i) => i.id === itemDto.itemId);

          // (futuramente pode ser implementado checagem de estoque)

          return {
            orderId: order.id,
            itemId: itemDto.itemId,
            quantity: itemDto.quantity,
            // unitPrice: itemDb.unitPrice // Salva o preço no momento da compra
          };
        });

        // Salva todos os OrderItems de uma vez
        await tx.orderItem.createMany({
          data: orderItemsData,
        });

        return order;
      });

      // Retorna o pedido completo
      // (Busca de novo para poder incluir os 'items' na resposta)
      return (await this.orderRepository.findById(newOrder.id))!;
    } catch (error: any) {
      // Se qualquer parte da transação falhar, o Prisma faz o rollback.
      throw new Error("Erro ao processar o pedido: " + error.message);
    }
  }

  async findById(
    orderId: bigint,
    authenticatedUser: IAuthenticatedUser
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    if (
      authenticatedUser.role === "CLIENT" &&
      order.clientId !== authenticatedUser.id
    ) {
      throw new Error("Acesso negado.");
    }

    return order;
  }

  async findAllByAuthenticatedUser(
    authenticatedUser: IAuthenticatedUser
  ): Promise<Order[]> {
    if (authenticatedUser.role === "ADMIN") {
      return this.orderRepository.findAll();
    }

    return this.orderRepository.findAllByUserId(authenticatedUser.id);
  }
}
