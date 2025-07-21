import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const schemas = z.object({
    email: z.string().email("Email inválido"),
    name: z.string().min(4, "Nome é obrigatorio"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
})

export default async function UserDataValidation(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    const result = schemas.safeParse({
        email: data.email,
        name: data.name,
        password: data.password
    })

    if (!result.success) {
        return res.status(400).json({
            message: "Dados inválidos",
            errors: result.error.format()
        });
    }

    req.body.id = uuidv4();
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;

    next();
}   