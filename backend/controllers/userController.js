import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getUserData = async (req,res)=>{
    try{
        const {userId} = req.body;

        const user = await userModel.findById(userId);
        if(!user){
            return res.json({ success:false , message:'User not found'});
        }
        res.json({
            success:true,
            userData :{
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    }catch(error){
        res.json({success:false , message:error.message});
    }
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Updated registration controller with hashing
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.role !== 'user',
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ 
            message: error.message || 'Server error during registration'
        });
    }
};

// Updated login controller with password comparison
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.role !== 'user',
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || 'Server error during login'
        });
    }
};