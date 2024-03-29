import express from 'express';
import Recipe from './recipeModel'
import asyncHandler from 'express-async-handler';
//import { v4 as uuidv4 } from 'uuid';
const router = express.Router(); 

router.get('/', async (req, res) => {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
});

router.get('/:id', asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) {
        res.status(200).json(recipe);
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
}));

router.post('/', asyncHandler(async (req, res) => {
    const recipe = await Recipe(req.body).save();
    res.status(201).json(recipe);
}));
export default router;