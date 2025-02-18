const express = require('express');
const recipeRouter = express.Router();
const multer = require('multer');
const upload = multer();
const Authenticate = require('../Middleware/Authenticate');

const recipeController = require('../controllers/recipeController');

recipeRouter.post('/create-recipe', Authenticate('cheif'), upload.none(), recipeController.postCreateRecipe);

recipeRouter.get('/recipes', upload.none(), recipeController.getRecipes);

recipeRouter.get('/view-recipe', Authenticate(), recipeController.getViewRecipe);

recipeRouter.post('/edit-recipe', Authenticate('cheif'), upload.none(), recipeController.postEditRecipe);

recipeRouter.post('/delete-recipe', Authenticate('cheif'), upload.none(), recipeController.postDeleteRecipe);

recipeRouter.get('/categories', Authenticate(), recipeController.getAllCategory);

recipeRouter.post('/add-category', Authenticate('cheif'), upload.none(), recipeController.postCreateCategory);

recipeRouter.post('/edit-category', Authenticate('cheif'), upload.none(), recipeController.postEditCategory);

module.exports = recipeRouter;