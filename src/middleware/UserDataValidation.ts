import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const schemas = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(4, "Nome é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

interface CreateUserBody {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default async function UserDataValidation(
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
  next: NextFunction
) {
  const result = schemas.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: result.error.format()
    });
  }

  req.body.id = uuidv4();
  req.body.password = await bcrypt.hash(req.body.password, 10);

  next();
}
