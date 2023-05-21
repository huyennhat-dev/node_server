const productController = require("../../controllers/home/product");
const router = require("express").Router();

router.get("/:id", productController.index);
router.get(
  "/categories/:slug",
  productController.productByCategories
);

module.exports = router;
