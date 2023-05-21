const indexController = require("../../controllers/home/index");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();

router.get("/", indexController.test);
router.get("/recommend-product", indexController.recommendProduct);

module.exports = router;
