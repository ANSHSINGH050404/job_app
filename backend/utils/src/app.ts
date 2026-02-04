import express from 'express';
import cors from 'cors';
import router from './route';

const app = express();

app.use(cors());
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/utils', router);

export default app;