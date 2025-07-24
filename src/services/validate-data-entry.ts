import express, { Request, Response, NextFunction } from 'express'
import { z } from 'zod';

export default async function validateDataEntry(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const schema = z.object({
        email: z.string().email('E-mail não é valido'),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
    })

    const result = await schema.safeParse({
        email: email,
        password: password
    })

    if (!result.success) {
        return res.status(400).json({
            msg: 'Informações inválidas',
            errors: result.error
        });
    }

    next();
}   