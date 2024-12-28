import {  UserServices } from './user.service';
import { loginValidationSchema, registerValidationSchema} from './user.validation';
import config from '../../config';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';



const JWT_SECRET = config.jwt_secret as string;

const registerUser = catchAsync(async (req, res) => {
  const validatedData = registerValidationSchema.parse(req.body);

  const result = await UserServices.registerUserIntoDB(validatedData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});



export const loginUser = catchAsync(async (req, res) => {
  const validatedData = loginValidationSchema.parse(req.body);

  const user = await UserServices.loginUser(validatedData.email, validatedData.password);

  if (!user) {
    throw {
      statusCode: 401,
      success: false,
      message: 'Invalid credentials',
    };
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Login successful',
    data: { token },
  });
});

export const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // Call the service to block the user
  await UserServices.blockUserInDb(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User blocked successfully',
  });
});




export const UserControllers = {
  registerUser,
  loginUser,
  blockUser,
};