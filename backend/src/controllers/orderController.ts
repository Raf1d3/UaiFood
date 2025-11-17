import type { Request, Response } from "express";
import { OrderService } from "../services/orderService.js";
import type { IdParams } from "../schemas/common.schema.js";
import type{ CreateOrderDto } from "../schemas/order.schemas.js";

export class OrderController {
  private static orderService = new OrderService();

  static async create(req: Request<{}, any, CreateOrderDto>, res: Response) {
    try {
      const authenticatedUser = req.user;

      const newOrder = await OrderController.orderService.create(
        authenticatedUser,
        req.body
      );
      res.status(201).json(newOrder);
    } catch (error: any) {
      if (error.message.includes("não encontrado")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Acesso negado")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const authenticatedUser = req.user;
      const orders =
        await OrderController.orderService.findAllByAuthenticatedUser(
          authenticatedUser
        );
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async findById(req: Request<IdParams>, res: Response) {
    try {
      const authenticatedUser = req.user;
      const orderId = BigInt(req.params.id);

      const order = await OrderController.orderService.findById(
        orderId,
        authenticatedUser
      );
      res.status(200).json(order);
    } catch (error: any) {
      if (error.message.includes("não encontrado")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Acesso negado")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
}
