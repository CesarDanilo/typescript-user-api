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
    const { id, name, email, password } = req.body; // Desestruturar o corpo da requisição

    // O id é gerado no backend, certo? Se não, a tipagem estaria incorreta, já que o usuário não pode enviar um id.
    const prisma = new PrismaClient();

    try {
        const response = await prisma.user.create({
            data: {
                id,
                name,
                email,
                password
            }
        });
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