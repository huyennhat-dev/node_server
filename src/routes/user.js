const userAdminController = require("../controllers/admin/user");
const authjwt = require("../middleware/authenticate_token");

const router = require("express").Router();

router.get("/", userAdminController.index);
//create
router.get("/create", userAdminController.add);
router.post("/create", userAdminController.create);

//edit & update
router.get("/edit/:id", userAdminController.edit);
router.put("/edit/:id", userAdminController.update);

//delete
router.delete("/delete/:id", userAdminController.delete);

module.exports = router;
