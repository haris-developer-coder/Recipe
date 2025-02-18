const jwt = require('jsonwebtoken');
const { Response500, Response400 } = require('../Functions/Responce');
require('dotenv').config();

module.exports = (requiredRole = null) => {
    return async (req, res, next) => {
        try{
            if(req.headers["authorization"]){
                const token = req.headers["authorization"].split(" ")[1];

                const decodeToken = jwt.decode(token);
                if(!decodeToken){
                    return Response400("Invalid token", 'The provided token is invalid or corrupted', res);
                }

                const { userId, userRole } = decodeToken;

                jwt.verify(token, process.env.AUTH_SECRET, (err, isVerified) => {
                    if(err){
                        return Response400("Unauthorized", 'Invalid or expired token', res);
                    }

                    req.headers.userId = userId;
                    req.headers.userRole = userRole;
                    
                    if (requiredRole && userRole !== requiredRole) {
                        return Response400("Forbidden", `You don't have permission to access this Url`, res);
                    }

                    return next();
                })

            }
            else{
                return Response400("Unauthorized", 'No token provided. Please log in to access this API.', res);
            }
        }
        catch(err)
        {
            console.log('Internal Error: ', err);
            return Response500(err || err.message, 'Internal Server Error', res);
        }
    }
}