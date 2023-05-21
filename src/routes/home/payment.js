const paymentController = require("../../controllers/payment");
const router = require("express").Router();

router.post("/create-url", paymentController.createUrl);
router.get("vnpay_return", paymentController.vnpRs);

module.exports = router;
