const express = require("express");
const server = require("../app");
const pro = require("../controllers/productsController");
server.use(express.json());
const a = new pro();

server
  .get("/", (req, res) => {
    res.send("Hello, World!");
  })
  .post("/create", a.create)
  .patch("/update/:id", a.updatepro)
  .get("/readAll", a.getAll)
  .get("/getOne/:id", a.getSpecific)
  .delete("/delete/:id", a.remove_Pro);
