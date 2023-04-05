const projectCtrl = require("../controller/projectCtrl");
const router = require("express").Router();

router.route("/").get(projectCtrl.searchPrj);
router.route("/create/").post(projectCtrl.createPrj);
router.route("/update/").post(projectCtrl.updatePrj);
router.route("/delete/").post(projectCtrl.deletePrj);



module.exports = router;