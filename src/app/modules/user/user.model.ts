import { Schema, model } from 'mongoose';
import { TAddress, TFullName, TOrder, TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const fullNameSchema = new Schema<TFullName>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters'],
    },
});

const addressSchema = new Schema<TAddress>({
    street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true,
        maxlength: [20, 'Street can not be more than 20 characters'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [20, 'City can not be more than 20 characters'],
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        maxlength: [20, 'Country can not be more than 20 characters'],
    },
});

const orderSchema = new Schema<TOrder>({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least 1'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
    },
});

const userSchema = new Schema<TUser, UserModel>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            maxlength: [20, 'Username can not be more than 20 characters'],
            select: false, // Exclude password from query results
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            maxlength: [20, 'Password can not be more than 20 characters'],
        },
        fullName: {
            type: fullNameSchema,
            required: [true, 'Full name is required'],
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [15, 'Age must be at least 15 years old'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        hobbies: {
            type: [String],
            required: [true, 'Hobbies are required'],
        },
        address: {
            type: addressSchema,
            required: [true, 'Address is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        orders: {
            type: [orderSchema],
            default: [],
        },
    },
    {
        toJSON: {
            virtuals: true,
            transform: (doc, next) => {
                delete next.password; // Remove password field from the response data
                return next;
            },
        },
    },
);

// virtual
userSchema.virtual('userFullName').get(function () {
    return `${this.fullName.firstName} ${this.fullName.lastName}`;
});

// pre save middleware / hook
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

// post save middleware / hook
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

// Query Middleware
userSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

userSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

//creating a custom static method
userSchema.statics.isUserExists = async function (userId: string) {
    return await User.findOne({ userId });
};

export const User = model<TUser, UserModel>('User', userSchema);