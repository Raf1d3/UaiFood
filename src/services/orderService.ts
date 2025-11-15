import { OrderRepository } from "../repositories/orderRepossitory.js";
import type { Prisma, Order } from "@prisma/client";




export class OrderService {
  private orderRepository = new OrderRepository();

}