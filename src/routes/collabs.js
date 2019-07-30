const express = require("express");
const router = express.Router();
const User = require("../db/models").User;
const collabController = require("../controllers/collabController");

router.get("/wikis/:wikiId/collaborators", collabController.view);

router.post("/wikis/:wikiId/collaborators/create", collabController.create);
router.post("/wikis/:wikiId/collaborators/delete", collabController.delete);

module.exports = router; 