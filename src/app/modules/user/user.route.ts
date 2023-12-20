import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

// will call controller function
router.post('/', UserControllers.createUser);
router.get('/', UserControllers.getAllUsers);
router.get('/:userId', UserControllers.getSingleUser);
router.put('/:userId', UserControllers.updateUser);
router.delete('/:userId', UserControllers.deleteUser);
router.put('/:userId/orders', UserControllers.createOrder);
router.get('/:userId/orders', UserControllers.getAllOrdersForSingleUser);
router.get('/:userId/orders/total-price', UserControllers.calculateTotalPriceOfOrdersForSingleUser);

export const UserRoutes = router;