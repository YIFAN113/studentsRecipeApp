import express from 'express';
import CookingLearning from './cookingLearningModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); 

router.get('/', asyncHandler(async (req, res) => {
    const cookingLearnings = await CookingLearning.find();
    res.status(200).json(cookingLearnings);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const cookingLearning = await CookingLearning.findById(req.params.id);
    if (cookingLearning) {
        res.status(200).json(cookingLearning);
    } else {
        res.status(404).json({ message: 'Cooking learning not found' });
    }
}));

router.post('/', asyncHandler(async (req, res) => {
    const cookingLearning = await new CookingLearning(req.body).save();
    res.status(201).json(cookingLearning);
}));

export default router;