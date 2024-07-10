import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});