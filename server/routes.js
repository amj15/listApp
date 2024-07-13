import { Router } from 'express';
import db from './database.js';
import { getTasks } from './repositories/tasks.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import fs from 'fs';
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


// Configuración de Google Calendar
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

let oauth2Client;

// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content));
});

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getAccessToken(oauth2Client);
    } else {
      oauth2Client.setCredentials(JSON.parse(token));
    }
  });
}

function getAccessToken(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  // You need to implement this part to handle the authorization code
  // and exchange it for a token. This is typically done in a web server
  // environment where the user can visit the URL and authorize the app.
}

router.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
  
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      // Store the token to disk for later program executions
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      res.send('Authorization successful. You can close this window.');
    } catch (error) {
      res.status(500).send('Error while trying to retrieve access token');
    }
  });

// CRUD operations for Google Calendar
router.post('/create-event', async (req, res) => {
  const { summary, description, start, end } = req.body;
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary,
    description,
    start: {
      dateTime: start,
    },
    end: {
      dateTime: end,
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/events', async (req, res) => {
    console.log('Holi');
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    console.log(calendar);
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(response.data.items);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/delete-event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error);
  }
});


export default router;
