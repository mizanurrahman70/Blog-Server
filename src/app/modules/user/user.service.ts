import { User } from './user.model';
import { IUser } from './user.interface';
import { hashPassword, comparePassword } from './user.utils';
import { Types } from 'mongoose';

 const registerUserIntoDB = async (data: Partial<IUser>): Promise<IUser> => {
  const { name, email, password } = data;
  const hashedPassword = await hashPassword(password!);

  const user = new User({ name, email, password: hashedPassword });
  return await user.save();
};

export const loginUser = async (email: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return null;
  }
  return user;
};

export const blockUserInDb = async (userId: string) => {
  // Ensure userId is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(userId);

  // Check if the user exists
  if (!user) {
    throw new Error('User not found');
  }

  // Update the isBlocked property
  user.isBlocked = true;
  await user.save();
};


export const UserServices = {
  registerUserIntoDB,
  loginUser,
  blockUserInDb,
}