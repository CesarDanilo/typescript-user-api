import express, { Request, Response } from 'express';
import mainRoute from '../src/routes/routes';
import cors from 'cors';

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api', mainRoute);

// Não use app.listen(), pois o Vercel gerencia o servidor.
// Em vez disso, exporte a aplicação.
export default app;