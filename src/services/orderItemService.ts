import { OrderItemRepository } from "../repositories/orderItemRepossitory.js";
import type { Prisma, OrderItem } from "@prisma/client";


export class OrderItemService {
  private orderItemRepository = new OrderItemRepository();

}