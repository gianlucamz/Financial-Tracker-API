import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { LoginDTO, RegisterDTO, TokenPayload } from './auth.dto';

export class AuthService {
  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
  }

  async register(data: RegisterDTO) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new Error('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = this.generateToken({ sub: user.id, email: user.email });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new Error('Credenciais inválidas');
    }

    const token = this.generateToken({ sub: user.id, email: user.email });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }
}
