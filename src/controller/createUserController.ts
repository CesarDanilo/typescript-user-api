import { json } from 'micro';
import { PrismaClient } from '../generated/prisma';
import { IncomingMessage, ServerResponse } from 'http'; // Importe os tipos nativos

interface CreateUserBody {
    id: string;
    name: string;
    email: string;
    password: string;
}

export default async function createUser(
    req: IncomingMessage, // Use o tipo nativo
    res: ServerResponse // Use o tipo nativo
) {
    const data = await json(req) as CreateUserBody; // Agora o 'json' do 'micro' aceita 'req'

    const prisma = new PrismaClient();

    try {
        const response = await prisma.user.create({ data });
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            msg: "Usuário criado com sucesso",
            data: response,
        }));
    } catch (erro) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            msg: `Erro ao criar usuário: ${erro}`,
        }));
    }
}