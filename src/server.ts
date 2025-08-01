import express, { Request, Response } from 'express';
import route from './routes/routes'
import cors from 'cors'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',           // permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // permite todos os métodos que você precisa
    allowedHeaders: ['Content-Type', 'Authorization'], // permite cabeçalhos comuns
}));

app.use('/api', route);

app.listen(port, () => {
    console.log(`SERVIDOR RODANDO: http://localhost:${port}`);
});
