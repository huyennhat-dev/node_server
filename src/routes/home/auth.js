const authController = require("../../controllers/home/auth");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();

router.post("/login", authController.login);
router.get("/check-login", authjwt, authController.checkLogin);

module.exports = router;
