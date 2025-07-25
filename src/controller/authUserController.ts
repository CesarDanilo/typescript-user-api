import express, { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validateDataEntry from '../services/validate-data-entry'

export default async function authUser(req: Request, res: Response) {
    const { email, password } = req.body;

    const isValid = await validateDataEntry(email, password);
    if (!isValid) {
        return res.status(400).json({ msg: "Dados inválidos!" });
    }

    const prisma = new PrismaClient();
    const fetchUser = await prisma.user.findUnique({ where: { email: String(email) } });

    if (!fetchUser) {
        return res.status(400).json({ msg: `Usuário não encontrado: ${email}` })
    }

    const checkPassword = await bcrypt.compare(password, fetchUser.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: `Password incorreto!` })
    }

    const secret = process.env.SECRET;

    if (!secret) {
        return res.status(500).json({ msg: "Token secreto não configurado no ambiente!" });
    }
    
    const token = jwt.sign({ id: fetchUser.id }, secret, { expiresIn: '1h' });

    const dados = { id: fetchUser.id, email: fetchUser.email, name: fetchUser.name };

    return res.status(200).json({ msg: "Autenticação realizada com sucesso!", token, dados })

}   