import { Router } from 'express';
const router = Router();
import db from './database';

router.get('/users', async (req, res) => {
    const users = await db('users').select('*');
    res.json(users);
});

router.post('/users', async (req, res) => {
    const { name, email } = req.body;
    await db('users').insert({ name, email });
    res.status(201).json({ success: true });
});

export default router;
