import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

export default async function updateUser(req: Request, res: Response) {
  const prisma = new PrismaClient();
  const { id } = req.query;

  const data = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        msg: "ID do usuário é obrigatório.",
      });
    }

    const response = await prisma.user.update({ where: { id: String(id) }, data: data });

    return res.status(200).json({
      msg: `Usuário Atualizado com sucesso`,
      user: response
    });

  } catch (erro) {
    return res.status(500).json({
      msg: `Algo deu errado: ${erro}`
    });
  }
}