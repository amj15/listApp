import { Router } from 'express';
import db from './database.js';
import { getTasks } from './repositories/tasks.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({status: 'ok'});
});

router.get('/users', async (req, res) => {
    const users = await db('users').select('*');
    res.json(users);
});

router.post('/users', async (req, res) => {
    const { name, email } = req.body;
    await db('users').insert({ name, email });
    res.status(201).json({ success: true });
});

router.get('/tasks', async(req,res) => {
    const tasks = await getTasks();
    res.json(tasks);
});

export default router;
