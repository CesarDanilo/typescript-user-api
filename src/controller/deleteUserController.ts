import express, { Request, Response } from 'express'
import { PrismaClient } from "../generated/prisma";

export default async function deleteUser(req: Request, res: Response) {
  const prisma = new PrismaClient();
  const { id } = req.query;

  try {
    const response = await prisma.user.delete({ where: { id: String(id) } });
    return res.status(200).json({
      msg: "Usuário deletado com súcesso"
    })

  } catch (erro) {
    return res.status(500).json({ msg: `Algo deu errado: ${erro}` })
  }
}