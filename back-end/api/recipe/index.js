import express from 'express';
import Recipe from './recipeModel'
import asyncHandler from 'express-async-handler';
const multer = require('multer');
import { GridFsStorage } from 'multer-gridfs-storage';
//import { v4 as uuidv4 } from 'uuid';
const router = express.Router(); 




router.get('/', async (req, res) => {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
});

router.get('/search', asyncHandler(async (req, res) => {
    const { query, tags } = req.query; 

    let searchConditions = [];
    if (query) {
        const searchCondition = new RegExp(query, 'i'); 
        searchConditions.push({ name: searchCondition });
    }

    if (tags) {
        const tagsArray = tags.split(',').map(tag => tag.trim());
        searchConditions.push({ tags: { $all: tagsArray } });
    }

    if (searchConditions.length === 0) {
        return res.status(400).json({ message: 'Search query or tags is required' });
    }

    const recipes = await Recipe.find({
        $and: searchConditions
    });

    res.status(200).json(recipes);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    console.log('Request hit / endpoint');
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

router.post('/:id/review', asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { text, postedBy } = req.body; 

    if (!text || !postedBy) {
        return res.status(400).json({ message: 'Review text and postedBy are required' });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
    }

    if (!recipe.reviews) {
        recipe.reviews = [];
    }

    const newReview = {
        text,
        postedBy,
        createdAt: new Date() 
    };

    recipe.reviews.push(newReview);

    await recipe.save();

    res.status(201).json(newReview);
}));


export default router;