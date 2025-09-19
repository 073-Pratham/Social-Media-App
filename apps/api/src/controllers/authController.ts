import type { Request, Response } from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import {Pool} from "pg"; 

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

export const register = async(req: Request, res: Response) => {
    const {username, email, password} = req.body;
    if(username == undefined || email == undefined || password == undefined){
        return res.status(400).json({message: "Credentials is missing"});
    }

    const saltRounds = 10;
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    try{
        const user = await prisma.user.create({
            data: {username, email, password: hash},
            select: {id: true, username: true, email: true}
        })

        const token = jwt.sign({userId: user.id, username: user.username}, JWT_SECRET, {expiresIn: "7d"});
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        
        res.status(200).json({"user": user});
    }
    catch(err: any){
        res.status(500).json({ message: err.message });
    }
}

export const login = async(req: Request, res: Response) => {
    const {emailOrUsername, password} = req.body;
    
    
    if(!emailOrUsername || !password){
        return res.status(400).json({message: "Credentials is missing"});
    }

    try{
        let user = await prisma.user.findUnique({ where: { email: emailOrUsername } });
        
        if(!user){
            user = await prisma.user.findUnique({ where: { username: emailOrUsername } });
        }
        
        if(!user){
            return res.status(401).json({ error: "Invalid credentials" });
        }
    
        const ok = await bcrypt.compare(password, user.password);
        if(!ok){
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({userId: user.id, username: user.username}, JWT_SECRET, {expiresIn: "7d"});
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        
        res.status(200).json({"user": user});
    }
    catch(err: any){
        res.status(500).json({ message: err.message });
    }
}

export const myProfile = async(req: Request, res: Response) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(400).json({"message": "User is not authenticated to access this profile"});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = await prisma.user.findUnique({where: {id: decoded.userId}});

         res.status(200).json({"user": user});
    }
    catch(err: any){
        res.status(400).json({"message": "User is not authenticated to access this profile"});
    }
}

export const logout = async(req: Request, res: Response) => {
    const token = req.cookies.token;

    console.log("token", token);

    if(!token){
        return res.status(400).json({"message": "User is not authenticated to access this profile"});
    }
    
    res.clearCookie('token');
    res.status(200).send("You've been logged out");
}

export const updateProfile = async(req: Request, res: Response) => {
    const token = req.cookies.token;
    const updateData = req.body;

    const valid = ["id", "username", "email", "password", "profilePicture"];

    if(!token){
        return res.status(400).json({"message": "User is not authenticated to access this profile"});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        for (const key of Object.keys(updateData)) {
            if (!valid.includes(key)) {
                return res.status(400).json({ message: `You're not allowed to change ${key}` });
            }
        }
        

        if(updateData.password !== undefined){
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(updateData.password, salt);
            updateData.password = hash;
        }

        if(updateData.email !== undefined){
            const exits = prisma.user.findUnique({where: {email: updateData.email}});
            if(!exits){
                return res.status(400).json({ message: `Someone with email ${updateData.email} already exists`});
            }
        }


        const user = await prisma.user.update({where: {id: decoded.userId}, data: updateData});

        res.status(200).send(user);
    }
    catch(err: any){
        res.status(400).json({"message": "User is not authenticated to access this profile"});
    }
}