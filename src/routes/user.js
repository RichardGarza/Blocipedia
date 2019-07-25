const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const validation = require("./validation");



router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signIn);
router.get("/users/sign_out", userController.sign_out);

router.post("/users/sign_up", validation.validateUsers , userController.create);
router.post("/users/sign_in", userController.sign_in);
router.post("/users/:id/upgrade", userController.upgrade);


module.exports = router;