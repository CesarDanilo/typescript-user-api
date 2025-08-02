import { IncomingMessage, ServerResponse } from 'http';
import { PrismaClient } from '../generated/prisma';
import { parse } from 'url';

export default async function fetchUsers(req: IncomingMessage, res: ServerResponse) {
    const prisma = new PrismaClient();

    // 1. Obtenha a URL da requisição
    const { url } = req;

    // 2. Analise a URL para obter os parâmetros de query
    const { query } = parse(url || '', true);
    const { id } = query;

    try {
        if (id) {
            const user = await prisma.user.findUnique({ where: { id: String(id) } });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ msg: user }));
            return; // Garante que a execução pare aqui
        }

        const data = await prisma.user.findMany();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ msg: data }));

    } catch (erro) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ msg: erro }));
    }
}