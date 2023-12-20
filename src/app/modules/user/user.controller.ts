import { Request, Response } from 'express';
import { UserServices } from './user.service';
import { userValidationSchema, orderSchema } from './user.validation';

const createUser = async (req: Request, res: Response) => {
    try {
        const { user: userData } = req.body;
        const zodParsedData = userValidationSchema.parse(userData);
        const result = await UserServices.createUserIntoDB(zodParsedData);

        res.status(200).json({
            success: true,
            message: 'User created successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 409,
                description: error.message + '!',
            },
        });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await UserServices.getAllUsersFromDB();
    
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 500,
                description: error.message + '!',
            },
        });
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await UserServices.getSingleUserFromDB(userId);
    
        res.status(200).json({
            success: true,
            message: 'User fetched successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 404,
                description: error.message + '!',
            },
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { user: updatedUserData } = req.body;
        const zodParsedData = userValidationSchema.parse(updatedUserData);
        const result = await UserServices.updateUserIntoDB(userId, zodParsedData);
    
        res.status(200).json({
            success: true,
            message: 'User updated successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 404,
                description: error.message + '!',
            },
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await UserServices.deleteUserFromDB(userId);
    
        res.status(200).json({
            success: true,
            message: 'User deleted successfully!',
            data: result.upsertedId,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 404,
                description: error.message + '!',
            },
        });
    }
};

const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { order: orderData } = req.body;
        const zodParsedData = orderSchema.parse(orderData);
        const result = await UserServices.addOrderIntoUserDB(userId, zodParsedData);

        res.status(200).json({
            success: true,
            message: 'Order created successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 404,
                description: error.message + '!',
            },
        });
    }
};

const getAllOrdersForSingleUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const orders = await UserServices.getAllOrdersForSingleUserFromDB(userId);

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully!',
            data: {
                orders,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 404,
                description: error.message + '!',
            },
        });
    }
};

const calculateTotalPriceOfOrdersForSingleUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const totalPrice = await UserServices.calculateTotalPriceOfOrdersForUserFromDB(userId);

        res.status(200).json({
            success: true,
            message: 'Total price calculated successfully!',
            data: {
                totalPrice,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: {
                code: 404,
                description: error.message + '!',
            },
        });
    }
};

export const UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    createOrder,
    getAllOrdersForSingleUser,
    calculateTotalPriceOfOrdersForSingleUser,
};