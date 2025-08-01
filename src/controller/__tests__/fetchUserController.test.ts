// __tests__/fetchUserController.test.ts

// 1. Mocke o módulo do PrismaClient. O caminho deve ser relativo ao seu arquivo de teste.
const prisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
};
jest.mock('../../generated/prisma', () => ({
  PrismaClient: jest.fn(() => prisma),
}));

import { email } from 'zod';
import fetchUsers from '../fetchUserController';
import { Request, Response } from 'express';

describe('fetchUsers Controller', () => {

  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    // 2. Antes de cada teste, crie objetos mock para req e res.
    // Usamos jest.fn() para rastrear as chamadas de status e json.
    mockResponse = {
      status: jest.fn(() => mockResponse) as any,
      json: jest.fn(),
    };
    mockRequest = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todos os usuários se nenhum ID for fornecido', async () => {
    // Dados que o mock do Prisma irá retornar
    const mockUsers = [{ id: '1', name: 'Alice', email: 'alice@gmail.com', password: '$2b$10$z6CwMymTSxyPqHG3bTcdGO8dbHO6QWSD1cC5TIWjrgW6.mk.of606' }, { id: '2', name: 'Bob', email: 'bob@gmail.com', password: '$2b$10$z6CwMymTSxyPqHG3bTcdGO8dbHO6QWSD1cC5TIWjrgW6.mk.of606' }];

    // 3. Configure o mock do Prisma para o caso findMany
    (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers);

    // 4. Chame o controller com o mock de req e res
    mockRequest.query = {};
    await fetchUsers(mockRequest as Request, mockResponse as Response);

    // 5. Faça as verificações (Assertions)
    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: mockUsers });
  });

  it('deve retornar um único usuário se um ID for fornecido', async () => {
    // Dados que o mock do Prisma irá retornar
    const mockUser = { id: '1', name: 'Alice' };

    // 3. Configure o mock do Prisma para o caso findUnique
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    // 4. Chame o controller com um ID na requisição
    mockRequest.query = { id: '1' };
    await fetchUsers(mockRequest as Request, mockResponse as Response);

    // 5. Faça as verificações
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: mockUser });
  });

  it('deve retornar um erro 500 se o banco de dados falhar', async () => {
    // 3. Configure o mock para simular uma falha
    (prisma.user.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB connection error'));

    // 4. Chame o controller
    mockRequest.query = {};
    await fetchUsers(mockRequest as Request, mockResponse as Response);

    // 5. Faça as verificações para o caso de erro
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: expect.any(Error) });
  });

});