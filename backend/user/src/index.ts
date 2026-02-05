import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.js';


dotenv.config();


const app = express();





app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);

const port = process.env.PORT ;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});