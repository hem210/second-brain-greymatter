import { Router, Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { UserModel } from "../db";
import { z } from "zod";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const userRouter = Router();

userRouter.post("/api/v1/signup", async (req: Request, res: Response) => {
    const signupSchema = z.object({
        email: z.string().email("Enter a valid email address."),
        name: z.string().min(3, "Name should have minimum 3 letters.").max(10, "Name should have maximum 10 letters."),
        password: z.string().min(8, "Password should have minimum 8 characters")
        .max(20, "Password should have maximum 20 characters")
        .regex(/[A-Z]/, "Password should have atleast 1 uppercase letter")
        .regex(/[a-z]/, "Password should have atleast 1 lowercase letter")
        .regex(/[0-9]/, "Password should have atleast 1 number")
    })
    // return res.json({message: "True"});

    const parsedBody = signupSchema.safeParse(req.body);
    if(!parsedBody.success){
        // console.log(parsedBody.error);
        console.log(parsedBody.error.flatten().fieldErrors);
        
        res.status(411).json({
            message: "Incorrect Format",
            error: parsedBody.error.errors[0].message
        })
        return;
    }

    const {email, name, password} = parsedBody.data;

    try {
        const existingUser = await UserModel.findOne({
            email: email
        });
        if(existingUser) {
            res.status(403).json({
                message: "User already exists"
            });
            return;
        }

        const hashed_password = await hash(password, 5);

        await UserModel.create({
            email: email,
            name: name,
            password: hashed_password
        })

        res.json({
            message: "User created successfully."
        });
        return;
    } catch (err){
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
});

userRouter.post("/api/v1/signin", async (req: Request, res: Response) => {
    const signinSchema = z.object({
        email: z.string().email("Enter a valid email address."),
        password: z.string().min(8, "Password should have minimum 8 characters")
        .max(20, "Password should have maximum 20 characters")
        .regex(/[A-Z]/, "Password should have atleast 1 uppercase letter")
        .regex(/[a-z]/, "Password should have atleast 1 lowercase letter")
        .regex(/[0-9]/, "Password should have atleast 1 number")
    });
    

    const parsedBody = signinSchema.safeParse(req.body);
    if(!parsedBody.success){
        console.log(parsedBody.error.flatten().fieldErrors);
        
        res.status(411).json({
            message: "Incorrect Format",
            error: parsedBody.error.errors[0].message
        })
        return;
    }

    const {email, password} = parsedBody.data;

    try {
        const existingUser = await UserModel.findOne({ email: email });
        if(existingUser) {
            const result = await compare(password, existingUser.password);
            if(result){
                const token = await jwt.sign({
                    id: existingUser._id.toString()
                }, JWT_SECRET);
                res.json({token: token});
                return;
            }
            else{
                res.status(403).json({ message: "Incorrect email or password" });
                return;
            }
        }
        else{
            res.status(403).json({message: "User doesn't exist. Please sign up."});
            return;
        }
    } catch (err){
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
})