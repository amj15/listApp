import { Router } from 'express';
import db from './database.js';
import { getTasks } from './repositories/tasks.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({status: 'ok'});
});

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await db('users').select('*');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Crear un nuevo usuario
router.post('/users', async (req, res) => {
    const { name, image } = req.body;
    try {
        const [id] = await db('users').insert({ name, image });
        res.status(201).json({ id, name, image });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Actualizar un usuario existente
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        await db('users').where({ id }).update({ name, image });
        res.json({ id, name, image });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Eliminar un usuario
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db('users').where({ id }).del();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

router.get('/tasks', async(req,res) => {
    const tasks = await getTasks();
    res.json(tasks);
});

export default router;
