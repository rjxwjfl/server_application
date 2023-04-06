const projectCtrl = require("../controller/projectCtrl");
const router = require("express").Router();

router.route("/")
    .get(projectCtrl.searchPrj)
    .post(projectCtrl.createPrj)
    .put(projectCtrl.updatePrj)
    .delete(projectCtrl.deletePrj);

router.route("/rule")
    .get(projectCtrl.getRules)
    .post(projectCtrl.createRule)
    .delete(projectCtrl.deleteRule);

router.route("/member")
    .get(projectCtrl.getMembers)
    .post(projectCtrl.joinProject)
    .put(projectCtrl.adjustRole);



module.exports = router;