module.exports = app => {
  const parcele = require("../controllers/parcela.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", parcele.create);

  // Retrieve all Tutorials
  router.get("/", parcele.findAll);

  // Retrieve all published Tutorials
  router.get("/published", parcele.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", parcele.findOne);

  // Update a Tutorial with id
  router.put("/:id", parcele.update);

  // Delete a Tutorial with id
  router.delete("/:id", parcele.delete);

  // Create a new Tutorial
  router.delete("/", parcele.deleteAll);

  app.use("/api/tutorials", router);
};
