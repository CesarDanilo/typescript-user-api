import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { json } from "micro";
import { PrismaClient } from "../generated/prisma";

// 1. Crie a interface para tipar os dados de atualização
interface UpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
}

export default async function updateUser(req: IncomingMessage, res: ServerResponse) {
  const prisma = new PrismaClient();

  const { url } = req;
  const { query } = parse(url || "", true);
  const { id } = query;

  // 2. Use a interface para tipar o objeto 'data'
  const data = await json(req) as UpdateUserBody;

  try {
    if (!id) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ msg: "ID do usuário é obrigatório." }));
      return;
    }

    const response = await prisma.user.update({
      where: { id: String(id) },
      data: data, // Agora o TypeScript sabe que 'data' é do tipo 'UpdateUserBody'
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        msg: `Usuário Atualizado com sucesso`,
        user: response,
      })
    );
  } catch (erro) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        msg: `Algo deu errado: ${erro}`,
      })
    );
  }
}