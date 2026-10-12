import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export interface AuthRequest extends Request {
  user?: jwt.JwtPayload | string
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({
      message: "Token missing..!"
    })
  }

  const [scheme, token] = authHeader.split(" ")
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header"
    })
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not configured")
    return res.status(500).json({
      message: "Authentication is not configured"
    })
  }

  try {
    const payload = await jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({ message: "Invalid or expire token..!" })
  }
}
