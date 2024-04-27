import express from 'express';
import Recipe from './recipeModel'
import asyncHandler from 'express-async-handler';
const multer = require('multer');
const { ensureUpload } = require('../../db/middleware');
//import { v4 as uuidv4 } from 'uuid';
const router = express.Router(); 




router.get('/', async (req, res) => {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
});

router.get('/search', asyncHandler(async (req, res) => {
    const { query, cookingMethod, cookingTime, cost, category, suitableFor, budget } = req.query;

    let searchConditions = [];
    if (query) {
        searchConditions.push({ title: new RegExp(query, 'i') }); 
    }

    const tagsFields = { cookingMethod, cookingTime, cost, category, suitableFor };
    for (const [key, value] of Object.entries(tagsFields)) {
        if (value) {
            const tagsArray = value.split(',').map(tag => tag.trim());
            searchConditions.push({ [`tags.${key}`]: { $in: tagsArray } });
        }
    }

    if (budget) {
        searchConditions.push({ budget: { $lte: Number(budget) } });
    }

    if (searchConditions.length === 0) {
        return res.status(400).json({ message: 'Search query or tags is required' });
    }

    const recipes = await Recipe.find({ $and: searchConditions });
    res.status(200).json(recipes);
}));

router.get('/test-query', async (req, res) => {
    try {
        const recipes = await Recipe.find({ 'cookingMethod': { $in: ['Grill'] } });
        console.log("Found recipes:", recipes);
        res.json(recipes); 
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:id', asyncHandler(async (req, res) => {
    console.log('Request hit / endpoint');
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) {
        res.status(200).json(recipe);
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
}));

router.post('/upload', ensureUpload, (req, res) => {
    req.upload.single('Image')(req, res, function (err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        res.status(201).json({
            fileId: req.file.id,
            filename: req.file.filename
        });
    });
});

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