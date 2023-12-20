import { z } from 'zod';

const fullNameSchema = z.object({
    firstName: z
        .string()
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
            message: 'First Name must start with a capital letter',
        }),
    lastName: z.string().max(20),
});

const addressSchema = z.object({
    street: z.string().min(1).max(20),
    city: z.string().max(20),
    country: z
        .string()
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
        message: 'Country must start with a capital letter',
    }),
});

const orderSchema = z.object({
    productName: z.string(),
    price: z.number().min(1),
    quantity: z.number().min(1),
});

export const userValidationSchema = z.object({
    userId: z.string(),
    username: z.string().max(20),
    password: z.string().max(20),
    fullName: fullNameSchema,
    age: z.number().min(15),
    email: z.string().email(),
    isActive: z.boolean().default(true),
    hobbies: z.array(z.string()),
    address: addressSchema,
    isDeleted: z.boolean().optional().default(false),
    orders: z.array(orderSchema).default([]),
});

export default userValidationSchema;