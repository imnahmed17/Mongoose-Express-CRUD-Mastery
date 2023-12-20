import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (userData: TUser) => {
    if (await User.isUserExists(userData.userId)) {
        throw new Error('User already exists');
    }

    return await User.create(userData); // built in static method
};

const getAllUsersFromDB = async () => {
    return await User.find();
};

const getSingleUserFromDB = async (userId: string) => {
    const user = await User.findOne({ userId }).select('-password'); // Exclude password field from the response data

    if (!user) {
        throw new Error(`User not found`); // check if user exists or deleted
    }

    return user;
};

const updateUserIntoDB = async (userId: string, updatedUserData: TUser) => {
    const existingUser = await User.findOne({ userId });

    if (!existingUser) {
        throw new Error(`User not found`); // check if user exists or deleted
    }

    existingUser.set(updatedUserData);
    await existingUser.save();

    return existingUser;
};

const deleteUserFromDB = async (userId: string) => {
    const user = await User.findOne({ userId }); 

    if (!user) {
        throw new Error(`User not found`); // check if user exists or deleted
    }

    return await User.updateOne({ userId }, { isDeleted: true });
};

export const UserServices = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
};