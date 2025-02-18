var express = require('express');
var usersRouter = express.Router();
const multer = require('multer');
const upload = multer();
const Authenticate = require('../Middleware/Authenticate');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/userController');

usersRouter.post('/register', (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      AuthController.uploadImage(req, res, next); 
    } else {
      upload.none()(req, res, next);
    }
  }, AuthController.Register);

usersRouter.post('/login', upload.none(), AuthController.Login);

usersRouter.post('/logout', Authenticate(), AuthController.Logout);

usersRouter.get('/profile', Authenticate(), UserController.getProfile);

usersRouter.post('/edit-profile', Authenticate(), (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      AuthController.uploadImage(req, res, next); 
    } else {
      upload.none()(req, res, next);
    }
  }, UserController.postEditProfile);

module.exports = usersRouter;
