import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Servidor está funcionando corretamente!');
});

app.post('/usuarios', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        let users = [];
        if (Object.keys(req.query).length) {
            users = await prisma.user.findMany({
                where: {
                    name: req.query.name,
                    age: req.query.age,
                    email: req.query.email
                }
            });
        } else {
            users = await prisma.user.findMany();
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });
        res.status(201).json({ message: "Usuario deletado com sucesso!" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

/*
    1 Tipo de Rota / Método HTTP
    2 Endereço / Ex.: www.loja/endereco
*/

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/*
    Criar nossa API de Usuários

    - Criar um usuário
    - Listar todos os usuarios
    - Editar um usuário
    - Deletar um usuário

    Verbos HTTP

    Get -> Listar
    Post -> Criar
    Put -> Editar vários
    Patch -> Editar UM
    Delete -> Deletar
*/