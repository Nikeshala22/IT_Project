import express from 'express';
import { getUserData, loginUser, registerUser } from '../controllers/userController.js';
import userAuth from '../middleware/authUser.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;