import type { Request, Response } from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        
        res.status(200).json(user);
    }
    catch(err: any){
        res.status(500).json({ message: err.message });
    }
}

export const login = async(req: Request, res: Response) => {
    const {username, email, password} = req.body;

    if((!username && !email) || !password){
        return res.send(400).json({message: "Credentials is missing"});
    }

    try{
        let user;
        if (email) {
        user = await prisma.user.findUnique({ where: { email } });
        } else {
        user = await prisma.user.findUnique({ where: { username } });
        }
    
        if(!user){
            return res.status(401).json({ error: "Invalid credentials" });
        }
    
        const ok = bcrypt.compare(password, user.password);
        if(!ok){
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({userId: user.id, username: user.username}, JWT_SECRET, {expiresIn: "7d"});
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        
        res.status(200).json(user);
    }
    catch(err: any){
        res.status(500).json({ message: err.message });
    }
}
