const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {type: String, required: true, index: true},
    Image: {type: String},
    types: [{type: String}],
    tools: [{type: String}],
    location: {type: String},
    ingredients: [{
        name: {type: String, required: true},
        quantity: {type: String}
    }],
    cookingSteps: [{type: String, required: true}],
    author: {type: String}
}, {timestamps: true});

export default mongoose.model('Recipe', recipeSchema);