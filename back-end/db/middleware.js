const multer = require('multer');
let upload = null;

module.exports.ensureUpload = (req, res, next) => {
    if (!upload) {
        return res.status(500).json({ message: "Upload is not initialized yet" });
    }
    req.upload = upload;
    next();
};

module.exports.initializeUpload = (storage) => {
    upload = multer({ storage });
};