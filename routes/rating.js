const express = require('express');
const ratingRouter = express.Router();
const multer = require('multer');
const upload = multer();

const Authenticate = require('../Middleware/Authenticate');

const ratingController = require('../controllers/ratingController');

ratingRouter.post('/add-rating', Authenticate('user'), upload.none(), ratingController.postRating);

module.exports = ratingRouter;