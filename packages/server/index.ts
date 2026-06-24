import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
app.use(express.json()); // middleware function for parsing data
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`App is listening to port ${port}`);
});
