import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoConnect from './config/db.config';
import AuthRoutes from './routes/auth.routes';
import TasksRoutes from './routes/tasks.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', AuthRoutes);
app.use('/api', TasksRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ 
      message: "Welcome to task management API." 
    });
});

app.use((req, res) => {
    res.type('json').status(404).json({
        message: '404 Endpoint not found',
        status: 404
    });
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}.`));
mongoConnect();