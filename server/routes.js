import { Router } from 'express';
import { Database } from 'sqlite3';

const router = Router();

router.get('/users', async (req, res) => {
    const users = await Database('users').select('*');
    res.json(users);
});

router.post('/users', async (req, res) => {
    const { name, email } = req.body;
    await Database('users').insert({ name, email });
    res.status(201).json({ success: true });
});

export default router;
