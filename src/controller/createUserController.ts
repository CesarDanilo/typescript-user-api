import express, { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

export default async function createUser(req: Request, res: Response) {
    const data = req.body;
    const prisma = new PrismaClient();

    try {
        const response = await prisma.user.create({ data });

        return res.status(201).json({
            msg: `Usuário criado com súcesso `,
            data: response
        })

    } catch (erro) {
        return res.status(500).json({
            msg: `não foi possivel fazer o cadastro do usuario: ${erro}`
        })
    }
}