import { IncomingMessage, ServerResponse } from 'http';
import { json } from 'micro';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validateDataEntry from '../services/validate-data-entry'

export default async function authUser(req: IncomingMessage, res: ServerResponse) {
    // Faz o parsing do corpo da requisição de forma assíncrona
    const { email, password } = await json(req) as any; // Usar 'as any' ou uma interface para evitar erros de tipagem.

    const isValid = await validateDataEntry(email, password);
    if (!isValid) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ msg: "Dados inválidos!" }));
        return;
    }

    const prisma = new PrismaClient();
    const fetchUser = await prisma.user.findUnique({ where: { email: String(email) } });

    if (!fetchUser) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ msg: `Usuário não encontrado: ${email}` }));
        return;
    }

    const checkPassword = await bcrypt.compare(password, fetchUser.password);

    if (!checkPassword) {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ msg: `Password incorreto!` }));
        return;
    }

    const secret = process.env.SECRET;

    if (!secret) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ msg: "Token secreto não configurado no ambiente!" }));
        return;
    }

    const token = jwt.sign({ id: fetchUser.id }, secret, { expiresIn: '1h' });
    const dados = { id: fetchUser.id, email: fetchUser.email, name: fetchUser.name };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ msg: "Autenticação realizada com sucesso!", token, dados }));
}