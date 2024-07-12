import { Router } from 'express';
import db from './database.js';
import { getTasks } from './repositories/tasks.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/static/images/avatar/'),
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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

router.post('/users', upload.single('image'), async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
  
      const { name } = req.body;
      const image = req.file.filename;
  
      const [newUser] = await db('users').insert({ name, image }).returning('*');
      res.json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });
  
  router.put('/users/:id', upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const image = req.file.filename;
  
      const [updatedUser] = await db('users')
        .where({ id })
        .update({ name, image })
        .returning('*');
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
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

router.get('/tasks', async (req, res) => {
    try {
      const tasks = await getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  });
  
  router.post('/tasks', async (req, res) => {
    try {
      const { title, description, userId, done } = req.body;
      const [newTask] = await db('tasks').insert({ title, description, userId, done }).returning('*');
      res.json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  });
  
  router.put('/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, userId, done } = req.body;
      const [updatedTask] = await db('tasks').where({ id }).update({ title, description, userId, done }).returning('*');
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });
  
  router.delete('/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db('tasks').where({ id }).del();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

export default router;
