const express = require('express');
const likesRoutes = express.Router();
const likesController = require('../controllers/likesController');
const Authenticate = require('../Middleware/Authenticate');
const multer = require('multer');
const upload = multer();

likesRoutes.post('/likes', Authenticate('user'), upload.none(), likesController.postLikes);

module.exports = likesRoutes;