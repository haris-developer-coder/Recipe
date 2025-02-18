const { Response500, Response200, Response400 } = require("../Functions/Responce");
const { removeEmptyProperties } = require("../helpers/filterObject");
const Users = require('../models/users');

exports.getProfile = async (req, res, next) => {
    
    try{
        const { userId } = req.headers;
        
        const userData = await Users.find({ _id: userId, deleted_at: null }).populate({
            path: "recipes",
            select: "title description ingredients instructions category average_rating rating_count comments created_at updated_at",
            populate:{
                path: "comments",
                select: "rating message created_at user_id",
                populate:{
                    path: "user_id",
                    select: "name profile_picture gender _id"
                }
            }
        });

        return Response200(null, "User Data Fetch Successfully!", userData, res);
    }
    catch(err){
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.postEditProfile = async (req, res, next) => {

    try{
        const { userId, userRole } = req.headers;

        if(userRole && userRole == 'user'){

            const { name, mobile, gender, city, state, country, postal_code, profile_picture } = req.body;

            const obj = {
                name,
                mobile,
                gender,
                city,
                state,
                country,
                postal_code,
                updated_at: Date.now()
            }
            
            if(req.file){

                const userData = Users.findOne({ _id: userId, deleted_at: null });

                if(userData.profile_picture != null){
                    const oldImageNamePath = path.join(__dirname, '../public', userData.profile_picture);
                    fs.unlink(oldImageNamePath, err => {
                        if(err){
                            console.log('image deleted failed: ', err);
                        }
                    })
                }

                obj.profile_picture = '/images/profiles/' + req.file.filename;
            }

            const filterObject = removeEmptyProperties(obj);

            const userUpdate = await Users.findOneAndUpdate({ _id: userId }, filterObject, { new: true });

            return Response200(null, "User Update Successfully!", userUpdate, res);
        }
        else if(userRole && userRole == 'cheif'){

            const { name, mobile, gender, city, state, country, postal_code, profile_picture, experience, specialty, certifications, availability, social_links } = req.body;

            const obj = {
                name,
                mobile,
                gender,
                city,
                state,
                country,
                postal_code,
                experience,
                specialty,
                certifications,
                availability,
                social_links,
                updated_at: Date.now()
            };

            if(req.file){

                const userData = Users.findOnd({ _id: userId, deleted_at: null });

                if(userData.profile_picture != null){
                    const oldImageNamePath = path.join(__dirname, '../public', userData.profile_picture);
                    fs.unlink(oldImageNamePath, err => {
                        if(err){
                            console.log('image deleted failed: ', err);
                        }
                    })
                }

                obj.profile_picture = '/images/profiles/' + req.file.filename;
            }

            const filterObject = removeEmptyProperties(obj);

            const userUpdate = await Users.findOneAndUpdate({ _id: userId }, filterObject, { new: true });

            return Response200(null, "User Update Successfully!", userUpdate, res);
        }

        return Response400("Error", "Something went wrong please login again!", res);
    }
    catch(err){

        if(req.file){
            const imageName = req.file.filename;
            const oldImagePath = path.join(__dirname, "../public/images/profiles/", imageName);
            fs.unlink(oldImagePath, err => {
                if(err){
                    console.log('image deleted failed: ', err);
                }
            });
        }

        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};