const categoriesController = require("../../controllers/categories");
const router = require("express").Router();

router.get("/", categoriesController.index);

//create
router.get("/create", categoriesController.add);
router.post("/create", categoriesController.create);

//edit
router.get("/edit/:id", categoriesController.edit);
router.put("/edit/:id", categoriesController.update);

//delete
router.delete("/delete/:id", categoriesController.delete);

module.exports = router;
