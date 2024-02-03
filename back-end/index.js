import dotenv from 'dotenv';
import express from 'express';
import recipeRouter from './api/recipe';

dotenv.config();

const app = express();

const port = process.env.PORT;
app.use(express.json());
app.use('/api/recipe', recipeRouter);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});