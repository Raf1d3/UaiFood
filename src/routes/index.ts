import { Router } from 'express';
import addressRouter from './addressRoutes.js';
import itemRouter from './itemRoutes.js';
import orderRouter from './orderRoutes.js';
import userRouter from './userRoutes.js';
import categoryRouter from './categoryRoutes.js';

const router = Router();

router.use(userRouter);
router.use("/address", addressRouter);
router.use("/category", categoryRouter);
router.use("/item", itemRouter);
router.use("/order", orderRouter);

export default router;