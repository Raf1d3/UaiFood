import { OrderService } from "../services/orderService.js";

export class OrderController {
    private static orderService = new OrderService();

    static async create(req: Request<IdParams, any, CreateOrderDto>, res: Response) {

    }
}