const mongoose = require('mongoose');

const cookingLearningSchema = new mongoose.Schema({
    title: {type: String, required: true, index: true},
   content: {type: String, required: true}
});

export default mongoose.model('CookingLearning', cookingLearningSchema);