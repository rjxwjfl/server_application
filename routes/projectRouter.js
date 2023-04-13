const projectCtrl = require("../controller/projectCtrl");
const router = require("express").Router();

router.route("/")
    .get(projectCtrl.searchPrj)
    .post(projectCtrl.createPrj)
    .put(projectCtrl.updatePrj)
    .delete(projectCtrl.deletePrj);

router.route("/rule")
    .get(projectCtrl.getRules)
    .post(projectCtrl.setRule)
    .delete(projectCtrl.deleteRule);

router.route("/member")
    .get(projectCtrl.getMembers)
    .post(projectCtrl.acceptJoin)
    .put(projectCtrl.adjustRole);

router.route("/dtl")
    .get(projectCtrl.getProject);



module.exports = router;