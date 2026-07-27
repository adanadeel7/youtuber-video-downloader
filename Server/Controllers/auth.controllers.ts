import mongoose from 'mongoose'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import expres from 'express'
import { User } from '../models/user.model.ts'


dotenv.config()

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


const jwt_secret:any = process.env.JWT_SECRET; 


async function Register(req:any,res:any) {
    try {
        // take name, email , password from body 

        const {name , email, password} = req.body


        // Check weather User Exists 
        const userExists = await User.findOne(
            {
                email
            }
        )

        if (userExists) {
            return res.status(400).json({
                message:"The User Already Exists"
            })
        }

        
        //Hash Password 
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name, 
            email, 
            password : hashedPassword
        })

        // Token Creation 

        const token = jwt.sign(
            {
                id : user._id
            }, 
            jwt_secret, {expiresIn: "7d"}
        )

        //Cookie Creation 
        res.cookie("token", token, cookieOptions);


        //Success Response 
        res.status(201).json({
            message : "User Successfully Registered", 
            token, 
            user : { 
                _id : user._id, 
                email : user.email, 
                name : user.name
            }
        })




    } catch (error) {
        return res 
        .status(500)
        .json({message : "Registration Failed"})
    }
    
}

async function Login(req:any,res:any) {
    try {
        // take name, email , password from body 

        const {name , email, password} = req.body


        // Check weather User Exists 
        const users = await User.findOne(
            {
                email
            }
        )

        if (!users) {
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }

        
        //Hash Password 
        const isPasswordValid = await bcrypt.compare(password,users.password)
        
        if (!isPasswordValid) { 
            return res.status(400).json(
                {
                    message : " Invalid email or password"
                }
            )
        }

        // Token Creation 

        const token = jwt.sign(
            {
                id : users._id
            }, 
            jwt_secret, {expiresIn: "7d"}
        )

        //Cookie Creation 
        res.cookie("token", token, cookieOptions);


        //Success Response 
        res.status(200).json({
            message : "User Successfully Logined in", 
            token, 
            user : { 
                _id : users._id, 
                email : users.email, 
                name : users.name
            }
        })




    } catch (error:any) {
        return res 
        .status(500)
        .json({message : "Login Failed", error : error.message})
    }

    
}


async function logoutUser(req : any,res : any) {
    res.clearCookie("token")
    res.status(200).json({
        message: "User Successfully logged Out"
    })
    
}


export {Register, Login, logoutUser}