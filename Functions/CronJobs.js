const Users = require('../models/users');
const Recipe = require('../models/recipe');
const Ratings = require('../models/ratings');
const Category = require('../models/category');

exports.deleteDataAfter10Minutes = () => {

    Users.deleteMany({ deleted_at: { $ne: null }})
    .then((result) => {
        console.log('Users deleted successfully!');
    })
    .catch(err => {
        console.log('Users Does not delete', err);
    })

    Recipe.deleteMany({ deleted_at: { $ne: null }})
    .then((result) => {
        console.log('Recipe deleted successfully!');
    })
    .catch(err => {
        console.log('Recipe Does not delete', err);
    })

    Category.deleteMany({ deleted_at: { $ne: null }})
    .then((result) => {
        console.log('Category deleted successfully!');
    })
    .catch(err => {
        console.log('Category Does not delete', err);
    })

    Ratings.deleteMany({ deleted_at: { $ne: null }})
    .then((result) => {
        console.log('Ratings deleted successfully!');
    })
    .catch(err => {
        console.log('Ratings Does not delete', err);
    });

};