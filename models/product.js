const mongose = require('mongoose');

const Product_Data = mongose.Schema(
    {
        pro_name: { type: String, required: true },
        pro_price: { type: Number, required: true },
        pro_quantity: { type: Number, required: true },
        pro_category: { type: String, required: true },
        pro_description: { type: String, required: true }
    }
);
module.exports = mongose.model('products',Product_Data);