const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const validation = require("./validation");


router.get("/users/sign_up", userController.sign_up);
router.get("/users/sign_in", userController.sign_in);

router.post("/users/sign_up", userController.create);

module.exports = router;