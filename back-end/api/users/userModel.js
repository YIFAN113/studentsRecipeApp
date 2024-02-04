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