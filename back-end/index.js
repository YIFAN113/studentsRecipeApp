import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import recipeRouter from './api/recipe';
import usersRouter from './api/users';
import './db';
import authenticate from './authenticate';
import mapRotes from './api/map';
import cookingLearningRouter from './api/cookingLearning'
//const { listBuckets } = require('./googleStorage');

dotenv.config();

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
};
const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/api/recipe',authenticate, recipeRouter);
app.use('/api/users', usersRouter);
app.use('/api/map', mapRotes);
app.use('/api/cookingLearning', cookingLearningRouter)
app.use(errHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
  //listBuckets();
});