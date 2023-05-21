const productController = require("../../controllers/admin/product");
const router = require("express").Router();

router.get("/", productController.index);
router.get("/create", productController.add);
router.post("/create", productController.create);

router.get("/edit/:id", productController.edit);
router.put("/edit/:id", productController.update);

router.delete("/delete/:id", productController.delete);

module.exports = router;
