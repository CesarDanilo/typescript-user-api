import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

interface CreateUserBody {
    id: string;
    name: string;
    email: string;
    password: string;
}

export default async function createUser(
    req: Request<{}, {}, CreateUserBody>,
    res: Response
) {
    const data = req.body as CreateUserBody;
    const prisma = new PrismaClient();

    try {
        const response = await prisma.user.create({ data });
        return res.status(201).json({
            msg: "Usuário criado com sucesso",
            data: response,
        });
    } catch (erro) {
        return res.status(500).json({
            msg: `Erro ao criar usuário: ${erro}`,
        });
    }
}
