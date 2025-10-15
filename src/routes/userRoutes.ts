import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/register', UserController.register);

userRouter.post('/login', UserController.login);

userRouter.delete('/delete/:id', UserController.deleteUser);

userRouter.put('/update/:id', UserController.updateProfile);

export default userRouter;