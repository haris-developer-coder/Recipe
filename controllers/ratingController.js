const { Response500, Response400, Response200, Response404 } = require("../Functions/Responce");
const { Required } = require('../helpers/validation');
const { removeEmptyProperties } = require('../helpers/filterObject');
const Recipe = require('../models/recipe');
const Rating = require('../models/ratings');
const Users = require("../models/users");

exports.postRating = async (req, res, next) => {
    
    try{
        const { rating, message, recipe_id } = req.body;
        const { userId } = req.headers;

        if(
            !Required("Rating", rating, res) ||
            !Required("Recipe ID", recipe_id, res)
        ){
            return;
        }

        const recipeData = await Recipe.findOne({ _id: recipe_id, deleted_at: null });

        if(!recipeData){
            return Response404("Not Found", "Recipe not found please chwck recipe ID.", res);
        }

        const ratingData = await Rating.findOne({user_id: userId, recipe_id: recipe_id});

        if(ratingData){
            return Response400("Already Rated", "You have already reviewed this recipe.", res);
        }

        const obj = {
            rating,
            message: message || null,
            recipe_id,
            user_id: userId
        };

        const filterObject = removeEmptyProperties(obj);

        const saveRating = Rating(filterObject);
        await saveRating.save();

        const ratingsData = await Rating.find({ recipe_id: recipe_id });
        const ratingCount = ratingsData.length;
        const averageRating = ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingCount;

        await Recipe.findOneAndUpdate(
            { _id: recipe_id },
            { $push: { comments: saveRating._id }, average_rating: averageRating, rating_count: ratingCount },
            { new: true }
        );

        return Response200(null, "Rating Successfully!", saveRating, res);
    }
    catch(err)
    {
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};