import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { PrismaClient } from "../generated/prisma";

export default async function deleteUser(req: IncomingMessage, res: ServerResponse) {
  const prisma = new PrismaClient();

  // 1. Analisa a URL para obter os parâmetros da query
  const { url } = req;
  const { query } = parse(url || '', true);
  const { id } = query;

  // 2. Valida se o ID existe
  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ msg: "O parâmetro 'id' é obrigatório" }));
    return;
  }

  try {
    const response = await prisma.user.delete({ where: { id: String(id) } });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      msg: "Usuário deletado com sucesso",
    }));

  } catch (erro) {
    // Trata o erro e envia a resposta
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ msg: `Algo deu errado: ${erro}` }));
  }
}