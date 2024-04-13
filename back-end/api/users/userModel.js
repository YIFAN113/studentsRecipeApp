const mongoose = require('mongoose');
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    uploadedRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
    favouriteRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}]
}, {timestamps: true});


userSchema.methods.comparePassword = async function (passw) { 
    return await bcrypt.compare(passw, this.password); 
  };

  userSchema.statics.findByUserName = function (username) {
    return this.findOne({ username: username });
  };

  userSchema.methods.addToFavourites = async function (recipeId) {
    if (!this.favouriteRecipes.includes(recipeId)) {
      this.favouriteRecipes.push(recipeId);
      await this.save();
      return { added: true, message: 'Recipe added to favourites.' };
    } else {
      return { added: false, message: 'Recipe already in favourites.' };
    }
  };

  userSchema.methods.removeFromFavourites = function (recipeId) {
    this.favouriteRecipes = this.favouriteRecipes.filter(id => id.toString() !== recipeId.toString());
    return this.save();
  };

  userSchema.methods.getFavourites = function() {
    return this.populate('favouriteRecipes');
  };

  userSchema.pre('save', async function(next) {
    const saltRounds = 10; 
    if (this.isModified('password') || this.isNew) {
      try {
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
        next();
    } catch (error) {
       next(error);
    }
  
    } else {
        next();
    }
  });
export default mongoose.model('User', userSchema);