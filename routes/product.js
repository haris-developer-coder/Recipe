const express = require("express");
const pro_Controller = require("../controllers/productsController");

const router = express.Router();
const a = new pro_Controller();

router.post("/create", a.create);
router.patch("/update/:id", a.updatepro);
router.get("/readAll", a.getAll);
router.get("/getOne/:id", a.getSpecific);
router.delete("/delete/:id", a.remove_Pro);

module.exports = router;
