import type { Request, Response } from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../utils/radisClient.js";
import sendMail from "../utils/mailer.js";

// import {Pool} from "pg"; 

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

export const register = async(req: Request, res: Response) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password || typeof password !== 'string'){
        return res.status(400).json({message: "Credentials is missing"});
    }

    const exists = await prisma.user.findFirst({ where: { OR: [ { email: email }, { username: username } ] } });
    if(exists){
        return res.status(400).json({ message: `Someone with email ${email} or username ${username} already exists`});
    }
    

    const saltRounds = 10;
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);

    try{
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("otp", otp);

        const otpHash = bcrypt.hashSync(otp, salt);

        await redisClient.setex(`pending:${email}`, 15*60, JSON.stringify({ username, email, passwordHash, otpHash }));
        // await sendMail({to: email, from: String(process.env.EMAIL_USER), subject: "OTP Verification for X Social Media", text: otp});

        
        // const user = await prisma.user.create({
        //     data: {username, email, password: hash},
        //     select: {id: true, username: true, email: true}
        // })

        // const token = jwt.sign({userId: user.id, username: user.username}, JWT_SECRET, {expiresIn: "7d"});
        // res.cookie('token', token, {
        //     httpOnly: true, 
        //     secure: process.env.NODE_ENV === 'production', 
        //     maxAge: 7 * 24 * 60 * 60 * 1000, 
        // });
        
        res.status(200).json({"message": `OTP has been sent to your email ${email}`});
    }
    catch(err: any){
        res.status(400).json({ message: err.message });
    }
}

export const verifyOtp = async(req: Request, res: Response) => {
    const {email, otp} = req.body;

    if(!otp || !email){
        return res.status(400).json({message: "Something went wrong"});
    }

    const data = await redisClient.get(`pending:${email}`);
    if (!data) {
        return res.status(400).json({ message: "OTP expired or invalid" });
    }
    const pendingUser = JSON.parse(data);
    
    const ok = bcrypt.compare(otp.toString(), pendingUser.otpHash);
    if(!ok){
        return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const {username, passwordHash} = pendingUser;
    const user = await prisma.user.create({
        data: {username, email, password: passwordHash},
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

export const login = async(req: Request, res: Response) => {
    const {emailOrUsername, password} = req.body;
    
    
    if(!emailOrUsername || !password  || typeof password !== 'string'){
        return res.status(400).json({message: "Credentials is missing"});
    }

    try{
        let user = await prisma.user.findUnique({ where: { email: emailOrUsername } });
        
        if(!user){
            user = await prisma.user.findUnique({ where: { username: emailOrUsername } });
        }
        
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
    
        const ok = await bcrypt.compare(password, user.password);
        if(!ok){
            return res.status(400).json({ message: "Invalid credentials" });
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
        res.status(400).json({ message: err.message });
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