import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import authenticate from '../../authenticate';
import bcrypt from 'bcrypt';

const router = express.Router(); 

router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

router.post('/', asyncHandler(async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ success: false, msg: 'Username and password are required.' });
        }
        if (req.query.action === 'register') {
            await registerUser(req, res);
        } else {
            await authenticateUser(req, res);
        }
    } catch (error) {
       
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
}));


router.put('/:id', authenticate, async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ code: 403, msg: 'Unauthorized to update this user.' });
    }
    const updates = {};
    if (req.body.username) {
        updates.username = req.body.username;
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
        const result = await User.updateOne({ _id: req.params.id }, { $set: updates });
        if (result.matchedCount) {
            res.status(200).json({ code: 200, msg: 'User Updated Successfully' });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to Update User' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, msg: 'Internal Server Error' });
    }
});



router.post('/favourites/add/:recipeId', authenticate, asyncHandler(async (req, res) => {
    const { recipeId } = req.params;
    const username = req.user.username; 
  
    const user = await User.findByUserName(username);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found.' });
    }
    
    const result = await user.addToFavourites(recipeId);
    if (result.added) {
      res.status(200).json({ success: true, msg: result.message });
    } else {
      res.status(200).json({ success: false, msg: result.message });
    }
  }));

  router.get('/favourites', authenticate, asyncHandler(async (req, res) => {
    const user = req.user;
  
    try {
      const populatedUser = await user.populate('favouriteRecipes');
      res.status(200).json({ success: true, favouriteRecipes: populatedUser.favouriteRecipes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: 'Internal server error.' });
    }
  }));



async function registerUser(req, res) {
    await User.create(req.body);
    res.status(201).json({ success: true, msg: 'User successfully created.' });
}

async function authenticateUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET);
        res.status(200).json({ success: true, token: 'BEARER ' + token, userId: user._id});
    } else {
        res.status(401).json({ success: false, msg: 'Wrong password.' });
    }
}
export default router;