const pro_Model = require("../models/product");

class pro_Controller {
  create = async (req, res) => {
    try {
      const Products = await pro_Model.create({
        pro_name: req.body.pro_name,
        pro_price: req.body.pro_price,
        pro_quantity: req.body.pro_quantity,
        pro_category: req.body.pro_category,
        pro_description: req.body.pro_description,
      });

      res.json({ message: "Data created successfully!", Products });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to create data!", details: error.message });
    }
  };
  updatepro = async (req, res) => {
    const Products = await pro_Model.findOneAndUpdate(
      { _id: req.params.id },
      {
        pro_name: req.body.pro_name,
        pro_price: req.body.pro_price,
        pro_quantity: req.body.pro_quantity,
        pro_category: req.body.pro_category,
        pro_description: req.body.pro_description,
      }
    );
    if (!updatedpro) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.json({ message: "Product Updated Successfully", data: Products });
  };
  getAll = async (req, res) => {
    const Products = await pro_Model.find();
    if (Products) {
      res.json({ Products });
    } else {
      return res.status(404).json({ message: "Product Not Found" });
    }
  };
  getSpecific = async (req, res) => {
    const Products = await pro_Model.find({ _id: req.params.id });
    if (Products) {
      res.json({ Products });
    } else {
      return res.status(404).json({ message: "Product Not Found" });
    }
  };
  remove_Pro = async (req, res) => {
    await pro_Model.findOneAndDelete({ _id: req.params.id });
    try {
      res.send("del");
    } catch (e) {
      res.send("Data IS not Deleted");
    }
  };
}

module.exports = pro_Controller;
 