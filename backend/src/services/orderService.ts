import prisma from "../../prisma/prismaClient.js";
import { OrderStatus, UserType, type Order, type Prisma } from "@prisma/client";
import { OrderRepository } from "../repositories/orderRepository.js";

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
    let clientIdForOrder: bigint;
    const createdByIdForOrder = authenticatedUser.id;

    if (authenticatedUser.role === UserType.ADMIN) {
      if (!data.clientId) {
        throw new Error("Admin deve especificar um 'clientId' para criar o pedido.");
      }
      clientIdForOrder = data.clientId;
    } else {
      clientIdForOrder = authenticatedUser.id;
    }

    const client = await prisma.user.findUnique({ where: { id: clientIdForOrder } });
    if (!client) {
      throw new Error("O cliente-alvo do pedido não foi encontrado.");
    }
    
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
            client: { connect: { id: clientIdForOrder } }, // Conecta ao cliente (quem paga)
            createdBy: { connect: { id: createdByIdForOrder } }, // Conecta o Criador (o atendente/admin/usuário logado)
            address: { connect: { id: data.addressId } }
          },
        });

        // Prepara os 'OrderItems'
        const orderItemsData = data.items.map((itemDto) => {
          // Pega o preço do item buscado no banco
          const itemDb = itemsInDb.find((i) => i.id === itemDto.itemId);

          // (futuramente pode ser implementado checagem de estoque)

          return {
            orderId: order.id,
            itemId: itemDto.itemId,
            quantity: itemDto.quantity,
            unitPrice: itemDb ? itemDb.unitPrice : 0 // Salva o preço no momento da compra
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
