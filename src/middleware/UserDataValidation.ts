import { IncomingMessage, ServerResponse } from 'http';
import { json } from 'micro';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma'; // Adicionei a importação do Prisma

const schemas = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(4, "Nome é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

interface CreateUserBody {
  id: string;
  name: string;
  email: string;
  password: string;
}

export default async function createUserHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
  const prisma = new PrismaClient();

  // 1. Leia o corpo da requisição com `micro/json`
  const rawData = await json(req);

  // 2. Valide os dados usando o Zod
  const result = schemas.safeParse(rawData);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: "Dados inválidos",
      errors: result.error.format()
    }));
    return;
  }

  // Se a validação for bem-sucedida, prossiga com a lógica de criação
  try {
    const { name, email, password } = result.data;

    // 3. Prepare os dados (gerar ID e hash da senha)
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Salve o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        id,
        name,
        email,
        password: hashedPassword
      }
    });

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: "Usuário criado com sucesso!",
      user: user
    }));

  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      message: "Erro interno do servidor durante a criação do usuário."
    }));
  }
}