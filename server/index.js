import express, { json } from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
