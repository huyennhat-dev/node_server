const indexController = require("../../controllers/home/index");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();

router.get("/", indexController.test);
router.get("/categories", indexController.categories);
router.get("/recommend-product", indexController.recommendProduct);

module.exports = router;
