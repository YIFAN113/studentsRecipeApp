import express from 'express';
import { recipeData } from './recipeData';

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
})
export default router;