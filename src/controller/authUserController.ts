import express, { Request, Response } from 'express'

export default async function authUser(req: Request, res: Response) {
    const { email, senha } = req.body;
}