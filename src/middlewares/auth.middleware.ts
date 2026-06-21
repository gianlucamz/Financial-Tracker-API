import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../modules/auth/auth.dto';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userEmail: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    req.userId = decoded.sub;
    req.userEmail = decoded.email;

    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
