const Users = require('../models/users');
const Recipe = require('../models/recipe');
const { Response400 } = require('../Functions/Responce');

module.exports = async (model, query, res) => {
    try {
        const response = await model.findOne(query);
        
        if (response == null) {
            Response400("Permission", 'You don’t have permission to access this URL.', res);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error in checkIdAndroles:", error.message);
        Response400("Error", 'An error occurred while checking permissions.', res);
        return false;
    }
};