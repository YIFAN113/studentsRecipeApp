import express from 'express';
import Recipe from './recipeModel'
//import { v4 as uuidv4 } from 'uuid';
const router = express.Router(); 

router.get('/', async (req, res) => {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
});

router.post('/', async (req, res) => {
    const recipe = await Recipe(req.body).save();
    res.status(201).json(recipe);
});
export default router;