import express from 'express';
import { recipeData } from './recipeData';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router(); 

router.get('/', (req, res) => {
    res.json(recipeData);
});

router.get('/:id',(req,res) => {
    const{ id } = req.params
    const recipe = recipeData.recipes.find(recipe => recipe.id === id);
    if(!recipe) {
        return res.status(404).json({ status: 404, message: 'recipe not found'});   
    }
    return res.status(200).json(recipe);
});

router.post('/',(req,res) => {
    const{ title, ingredient} = req.body;
    const newRecipe = {
        id: uuidv4(),
        title,
        ingredient
    };
    recipeData.recipes.push(newRecipe);
    res.status(201).json(newRecipe);
    recipeData.total_results++;
});
export default router;