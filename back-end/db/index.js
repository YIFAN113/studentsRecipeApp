import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import Grid from 'gridfs-stream';
const { initializeUpload } = require('./middleware');


dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;

let gfs, upload;

db.on('error', (err) => {
    console.log(`database connection error: ${err}`);
});
db.on('disconnected', () => {
    console.log('database disconnected');
});
db.once('open', () => {
    console.log(`database connected to ${db.name} on ${db.host}`);

    
    const storage = new GridFsStorage({
        db: db.db,
        file: (req, file) => {
            return {
                filename: 'file_' + Date.now() + path.extname(file.originalname),
                bucketName: 'uploads'
            };
        }
    });

    initializeUpload(storage);

})
