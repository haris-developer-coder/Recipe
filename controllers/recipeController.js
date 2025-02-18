const { Response500, Response200, Response400, Response404 } = require("../Functions/Responce");
const { Required } = require('../helpers/validation');
const Recipe = require('../models/recipe');
const Users = require("../models/users");
const { removeEmptyProperties } = require('../helpers/filterObject');
const checkIdAndroles = require('../helpers/checkIdAndroles');
const Rating = require("../models/ratings");
const Category = require("../models/category");

exports.postCreateRecipe = async (req, res, next) => {
    const { title, description, ingredients, instructions, category } = req.body;
    const { userId } = req.headers;

    try{

        if(
            !Required("Recipe Title", title, res) || 
            !Required("Description", description, res) || 
            !Required("Ingredients", ingredients, res) || 
            !Required("Instructions", instructions, res) || 
            !Required("Category", category, res)
        ){
            return;
        }

        const obj = {
            title,
            description,
            ingredients,
            instructions,
            category,
            user_id: userId
        };

        const saveRecipe = Recipe(obj);
        const savedRecipe = await saveRecipe.save();

        const userUpdate = await Users.findOneAndUpdate(
            { _id: userId },
            { $push: { recipes: savedRecipe._id } },
            { new: true }
        );

        return Response200(null, "Recipe Create Successfully!", savedRecipe, res);
    }
    catch(err){
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.getRecipes = async (req, res, next) => {
    try{
        const { searchParams } = req.body;
        
        let recipeData = '';
        if(searchParams.length > 0){
            recipeData = await Recipe.find({ category: { $regex: searchParams, $options: 'i' }, deleted_at: null }).populate({
                path: "user_id",
                select: "name email profile_picture gender experience specialty certifications availability city state country postal_code social_links"
            }).populate({
                path: "comments",
                select: "message rating created_at user_id",
                populate:{
                    path: "user_id",
                    select: "name profile_picture gender _id"
                }
            });
        }else{
            recipeData = await Recipe.find({ deleted_at: null }).populate({
                path: "user_id",
                select: "name email profile_picture gender experience specialty certifications availability city state country postal_code social_links"
            }).populate({
                path: "comments",
                select: "message rating created_at user_id",
                populate:{
                    path: "user_id",
                    select: "name profile_picture gender _id"
                }
            });
        }

        return Response200(null, 'Recipe Data Fetch Successfully!', recipeData, res);
    }
    catch(err){
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }
};

exports.getViewRecipe = async (req, res, next) => {
    const { recipe_id } = req.query;
    
    try{
        const recipeData = await Recipe.findOne({_id: recipe_id, deleted_at: null}).populate({
                path: "user_id",
                select: "name email profile_picture gender experience specialty certifications availability city state country postal_code social_links"
            }).populate({
                path: "comments",
                select: "message rating created_at user_id",
                populate:{
                    path: "user_id",
                    select: "name profile_picture gender _id"
                }
            });

        if(recipeData){
            return Response200(null, "Recipe Data Fetch Successfully!", recipeData, res)
        }
        
        return Response404(null, "Recipe Not Found", res);
    }
    catch(err)
    {
        console.log('Internal Error: ', err);
        return Response500(err || err.message, 'Internal Server Error', res);
    }

};

exports.postEditRecipe = async (req, res, next) => {

    try{
        const { recipe_id, title, description, ingredients, instructions, category } = req.body;
        const { userId } = req.headers;
        
        if(
            !Required("Recipe ID", recipe_id, res)
        ){
            return;
        }

        const recipeData = await Recipe.findOne({_id: recipe_id, deleted_at: null});

        if(!recipeData){
            return Response400('Invalid ID', 'Please provide correct recipe ID.', res);
        }

        const hasPermission = await checkIdAndroles(
            Recipe, 
            { _id: recipe_id, user_id: userId, deleted_at: null },
            res
        );

        if (!hasPermission) {
            return;
        }

        const obj = {
            title,
            description,
            ingredients,
            instructions,
            category
        };

        const filterObject = removeEmptyProperties(obj);

        filterObject.updated_at = Date.now();

        const updatedRecipe = await Recipe.findOneAndUpdate({_id: recipe_id}, filterObject, { new: true });

        return Response200(null, "Recipe Update Successfully!", updatedRecipe, res);
    }
    catch(err)
    {
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.postDeleteRecipe = async (req, res, next) => {

    try{
        const { recipe_id } = req.body;
        const { userId } = req.headers;

        if(
            !Required("Recipe ID", recipe_id, res)
        ){
            return;
        }

        const recipeData = await Recipe.findOne({_id: recipe_id, deleted_at: null});

        if(!recipeData){
            return Response404("Invalid ID", "Please provide correct Recipe ID.", res);
        }

        const hasPermission = await checkIdAndroles(
            Recipe, 
            { _id: recipe_id, user_id: userId, deleted_at: null },
            res
        );

        if (!hasPermission) {
            return;
        }

        if(recipeData.comments){

            if (!Array.isArray(recipeData.comments)) {
                recipeData.comments = [];
            }

            for(let id of recipeData.comments){
                await Rating.findOneAndUpdate(
                    { _id: id},
                    {deleted_at: Date()},
                    { new: true }
                )
            }
        }

        recipeData.deleted_at = Date.now();
        recipeData.rating = [];
        const updateRecipe = await recipeData.save();

        const userData = await Users.findOne({ _id: userId });

        if (userData) {

            if (!Array.isArray(userData.recipes)) {
                userData.recipes = [];
            }

            userData.recipes = userData.recipes.filter(
                (recipe) => recipe.toString() !== recipe_id.toString()
            );

            await userData.save();
        }

        return Response200(null, "Recipe Deleted Successfully!", updateRecipe, res);

    }
    catch(err)
    {
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.postCreateCategory = async (req, res, next) => {

    try{
        const { name } = req.body;

        if(
            !Required("Category Name", name, res)
        ){
            return;
        }

        const obj = {
            name: name
        };

        const categoryData = Category(obj);
        await categoryData.save();

        return Response200(null, "Category Data has been save successfully!", categoryData, res);
    }
    catch(err){
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.getAllCategory = async (req, res, next) => {

    try{
        const categoryData = await Category.find({ deleted_at: null });

        return Response200(null, "Category Data Fetch Successfully!", categoryData, res);
    }
    catch(err){
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.postEditCategory = async (req, res, next) => {

    try{
        const { name, category_id } = req.body;

        if(
            !Required("Category Name", name, res) &&
            !Required("Category ID", category_id, res) 
        ){
            return;
        }

        const categoryData = await Category.findOneAndUpdate({ _id: category_id }, {name: name, updated_at: Date.now()}, { new: true } );

        return Response200(null, "Category Data Updated Successfully!", categoryData, res);
    }
    catch(err){
        console.log("Internal Error: ", err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};