const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    text: { type: String, required: true },
    postedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


const recipeSchema = new mongoose.Schema({
    title: {type: String, required: true, index: true},
    Image: {type: String},
    budget:{type: Number},
    tags: {
        cookingMethod: [{ type: String, index: true }],
        cookingTime: [{ type: String, index: true }],
        cost: [{ type: String, index: true }],
        category: [{ type: String, index: true }],
        suitableFor: [{ type: String, index: true }]
    },
    ingredients: [{
        name: {type: String, required: true},
        quantity: {type: String}
    }],
    cookingSteps: [{type: String, required: true}],
    author: {type: String},
    reviews: [reviewSchema] ,
}, {timestamps: true});

export default mongoose.model('Recipe', recipeSchema);