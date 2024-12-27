import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { loginValidationSchema, registerValidationSchema } from './user.validation';
import { authMiddleware } from '../../middlewares/authMiddleware';


const router = express.Router();

router.post(
    '/auth/register',
    validateRequest(registerValidationSchema),
    UserControllers.registerUser);

router.post(
    '/auth/login',
    validateRequest(loginValidationSchema),
    UserControllers.loginUser);

    router.patch('/admin/users/:userId/block', authMiddleware.userAuthMiddleware, authMiddleware.adminAuthMiddleware,  UserControllers.blockUser);


export const UserRoutes = router;
