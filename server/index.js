import express from 'express';
import cors from 'cors';
import routes from './routes'; // Asegúrate de que la ruta sea correcta

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});