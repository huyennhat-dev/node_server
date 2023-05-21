const authAdminController = require("../../controllers/admin/auth");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();
router.post("/login", authAdminController.login);

module.exports = router;
