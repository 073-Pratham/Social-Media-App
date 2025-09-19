import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";


const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

interface TokenPayload {
    userId: string,
    username: string
}

interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = async(req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// export const checkAdmin = async(req: AuthRequest, res: Response, next: NextFunction) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ error: "No token" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
//     const user = await prisma.user.findUnique({where: {id: decoded.userId}});

//     if (user?.role !== "admin") {
//       throw new Error("Forbidden: Admin access required");
//     }
//     next();
//   } catch(err: any) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// }