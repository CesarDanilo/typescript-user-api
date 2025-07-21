import express, { Request, Response } from 'express';
import route from './routes/routes'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', route);

app.listen(port, () => {
    console.log(`SERVIDOR RODANDO: http://localhost:${port}`);
});
