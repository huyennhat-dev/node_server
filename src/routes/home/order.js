const orderController = require("../../controllers/order");
const authjwt = require("../../middleware/authenticate_token");

const router = require("express").Router();

router.post("/create-url", authjwt, orderController.createUrl);
router.get("/vnpay-return", orderController.vnpRs);

router.get("/user-order", authjwt,orderController.showOrderByUser);


module.exports = router;
