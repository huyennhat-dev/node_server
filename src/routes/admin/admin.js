const userAdminController = require("../../controllers/admin/admin");
const authjwt = require("../../middleware/authenticate_token");
const { authPage } = require("../../middleware/authorization");

const router = require("express").Router();

router.get("/", authjwt, authPage(["ADM"]), userAdminController.index);
//create
router.get("/create", authjwt, authPage(["ADM"]), userAdminController.add);
router.post("/create", authjwt, authPage(["ADM"]), userAdminController.create);

//edit & update
router.get("/edit/:id", authjwt, authPage(["ADM"]), userAdminController.edit);
router.put("/edit/:id", authjwt, authPage(["ADM"]), userAdminController.update);

//delete
router.delete(
  "/delete/:id",
  authPage(["ADM"]),
  authjwt,
  userAdminController.delete
);

module.exports = router;
