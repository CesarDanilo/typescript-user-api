import express, { Request, Response } from 'express'
import validateDataEntry from '../services/validate-data-entry'

export default async function authUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (await validateDataEntry(email, password)) { console.log("Dados Invalidos!") };

}