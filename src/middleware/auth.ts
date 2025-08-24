// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SecretKey';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; name: string; email: string };
}

export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt_token;
  if (!token) {
    return res.status(401).redirect('/');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).redirect('/');
  }
};
