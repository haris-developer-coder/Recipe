const { Required, Password, Email } = require('../helpers/validation');
const { Response400, Response404, Response500, Response200 } = require('../Functions/Responce');
const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const { removeEmptyProperties } = require('../helpers/filterObject');
const { TokenGenerate } = require('../Functions/GenerateToken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { SendEmail } = require('../Functions/EmailSend');

// Image Store Function
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/profiles/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

exports.Register = async (req, res, next) => {
    const { name, email, password, mobile, gender, social_links, country, state, city, postal_code, availability, certifications, specialty, experience, role } = req.body;
    
    try{
        console.log(req.body);
        return;
        if(role == 'user')
        {
            if(
                !Required("Name", name, res) ||
                !Email("Email", email, res) ||
                !Password("Password", password, res) ||
                !Required("Mobile", mobile, res) ||
                !Required("Gender", gender, res) || 
                !Required("Country", country, res) || 
                !Required("City", city, res) || 
                !Required("State", state, res) || 
                !Required("Postal Code", postal_code, res)
            )
            {
                return;
            }

            const userData = await Users.findOne({email: email});

            if(userData){  

                if(req.file)
                {
                    const ImageName = req.file.filename;
                    const oldImagePath = path.join(__dirname, '../public/images/profiles/', ImageName);
                    fs.unlink(oldImagePath, (error) => {
                        if(error){
                            console.log('Failed to delete Image: ', error);
                        }
                    })
                }

                return Response400(null, 'Please Enter different email.', res);
            }

            const hasehdPassword = await bcrypt.hash(password, 10);

            const obj = {
                name,
                email,
                mobile,
                gender,
                role,
                country,
                city,
                state,
                postal_code,
                password: hasehdPassword
            }
            
            if(req.file)
            {
                const ImageName = req.file.filename;

                obj.profile_picture = '/images/profiles/' + ImageName;
            }

            const filterObject = removeEmptyProperties(obj);

            const registerUser = Users(filterObject);
            const saveUser = await registerUser.save();

            // const tranporter = nodemailer.createTransport({
            //     host: 'smtp.gmail.com',
            //     port: 465,
            //     secure: true,
            //     auth:{
            //         user: process.env.APP_EMAIL,
            //         pass: process.env.APP_PASSWORD
            //     },
            //     tls: {
            //         rejectUnauthorized: false,
            //     }
            // })

            // await tranporter.sendMail({
            //     from,
            //     to,
            //     subject,
            //     text,
            //     html
            // });

            //Email Send Success Registration
            const from = 'Recipe-Sharing-Platform';
            const subject = "Registration Successfull";
            const text = "You have successfully registered on our platform. Now you can login and use our services.";
            const html = "<h1>You have successfully registered on our platform. Now you can login and use our services.</h1>";

            await SendEmail(from, email, subject, text, html);
            
            return Response200(null, 'User Registered Successfully!', saveUser, res);
        }

        if(role == 'cheif'){
            if(
                !Required("Name", name, res) ||
                !Email("Email", email, res) ||
                !Password("Password", password, res) ||
                !Required("Mobile", mobile, res) ||
                !Required("Gender", gender, res) ||
                !Required("Country", country, res) || 
                !Required("City", city, res) || 
                !Required("State", state, res) || 
                !Required("Postal Code", postal_code, res) || 
                !Required("Availability", availability, res) || 
                !Required("Certification", certifications, res) || 
                !Required("Specialty", specialty, res) || 
                !Required("Experience", experience, res)
            )
            {
                return;
            }

            const userData = await Users.findOne({email: email});

            if(userData){

                if(req.file)
                {
                    const ImageName = req.file.filename;
                    const oldImagePath = path.join(__dirname, '../public/images/profiles/', ImageName);
                    fs.unlink(oldImagePath, (error) => {
                        if(error){
                            console.log('Failed to delete Image: ', error);
                        }
                    })
                }

                return Response400(null, 'Please Enter different email.', res);
            }

            const hasehdPassword = await bcrypt.hash(password, 10);

            const obj = {
                name,
                email,
                mobile,
                gender,
                role,
                social_links,
                country,
                city,
                state,
                postal_code,
                availability,
                certifications,
                specialty,
                experience,
                password: hasehdPassword
            }

            if(req.file)
            {
                const ImageName = req.file.filename;

                obj.profile_picture = '/images/profiles/' + ImageName;
            }
            
            const filterObject = removeEmptyProperties(obj);

            const registerUser = Users(filterObject);
            const saveUser = await registerUser.save();

            //Email Send Success Registration
            const from = 'Recipe-Sharing-Platform';
            const subject = "Registration Successfull";
            const text = "You have successfully registered on our platform. Now you can login and use our services.";
            const html = "<h1>You have successfully registered on our platform. Now you can login and use our services.</h1>";

            await SendEmail(from, email, subject, text, html);

            return Response200(null, 'User Registered Successfully!', saveUser, res);
        }

        return Response400(null, 'Please Provide Correct Role for registration', res);
    }
    catch(err)
    {
        if(req.file)
                {
                    const ImageName = req.file.filename;
                    const oldImagePath = path.join(__dirname, '../public/images/profiles/', ImageName);
                    fs.unlink(oldImagePath, (error) => {
                        if(error){
                            console.log('Failed to delete Image: ', error);
                        }
                    })
                }
                
        console.log('Internal Error: ', err)
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.Login = async (req, res, next) => {
    const { email, password } = req.body;
    const { device_token } = req.headers;

    try{
        if(!Required("Email", email, res) || !Required("Password", password, res) || !Required("Device Token", device_token, res)){
            return;
        }

        const userData = await Users.findOne({email: email});

        if(!userData){
            return Response400(null, 'Incorrect Email or Password', res);
        }

        const checkPassword = await bcrypt.compare(password, userData.password);

        if(checkPassword){
            const token = await TokenGenerate(userData._id, userData.role);

            userData.device_token = device_token;
            await userData.save();

            const { password, ...responseData } = userData.toObject();

            responseData.accessToken = token;

            return Response200(null, "User Login Successfully!", responseData, res);
        }
        
        return Response400(null, 'Incorrect Email or Password', res);
    }
    catch(err)
    {
        console.log('Internal Error: ', err);
        return Response500(err || err.message, "Internal Server Error", res);
    }

};

exports.Logout = async (req, res, next) => {
    
    try{
        const { userId } = req.headers;

        if(userId != undefined || userId != null){

            const userData = await Users.findOne({_id: userId});

            userData.device_token = "";
            await userData.save();

            return Response200(null, "User Loggout successfully!", {}, res);
        }

        return Response400(null, "Something went wrong!", res);
    }
    catch(err)
    {
        console.log('Internal Error: ', err || err.message);
        return Response500(err || err.message, "Internal Server Error", res);
    }
};

exports.uploadImage = upload.single('profile_picture');