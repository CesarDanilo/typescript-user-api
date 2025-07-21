import express, { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma';

export default async function fetchUsers(req: Request, res: Response) {

    const prisma = new PrismaClient();
    const { id } = req.query;

    try {
        if (id) {
            const user = await prisma.user.findUnique({ where: { id: String(id) } })
            return res.status(200).json({
                msg: user
            })
        }

        const data = await prisma.user.findMany();
        return res.status(200).json({
            msg: data
        })
        
    } catch (erro) {
        return res.status(500).json({
            msg: erro
        })
    }
}