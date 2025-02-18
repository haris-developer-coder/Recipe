const { Response200, Response500, Response400, Response404 } = require('../Functions/Responce');
const { Required } = require('../helpers/validation');
const Likes = require('../models/likes');
const Recipe = require('../models/recipe');

exports.postLikes = async (req, res, next) => {

    try{
        const { userId } = req.headers;
        const { recipe_id, status } = req.body;

        if(
            !Required("Recipe ID", recipe_id, res) ||
            !Required("Status", status, res)
        ){
            return;
        }

        if(status == 1){

            const likeData = await Likes.findOne({ recipe_id: recipe_id, user_id: userId });

            if(likeData){
                return Response200(null, "Likes Added Successfully!", likeData, res)
            }

            const obj = {
                status,
                user_id: userId,
                recipe_id
            };

            const saveLikes = Likes(obj);
            await saveLikes.save();

            const likesData = await Likes.find({ recipe_id: recipe_id });
            const likesCount = likesData.length;

            await Recipe.findOneAndUpdate(
                { _id: recipe_id },
                { likes: likesCount },
                { new: true }
            );

            return Response200(null, "Likes Added Successfully!", saveLikes, res);

        }
        else if(status == 0){

            const likeData = await Likes.findOne({ recipe_id: recipe_id, user_id: userId });

            if(likeData){
                
                const likeRemove = await Likes.findOneAndDelete(likeData._id);

                const likesData = await Likes.find({ recipe_id: recipe_id });
                const likesCount = likesData.length;

                await Recipe.findOneAndUpdate(
                    { _id: recipe_id },
                    { likes: likesCount },
                    { new: true }
                );

                return Response200(null, "Like Remove Successfully!", likeRemove, res);
            }
            
            return Response404("Not Found", "Likes Data Not Found!", res);
        }

        return Response400("Invalid", "Please provide correct data", res);        
    }
    catch(err){
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};