const userCtrl = require("../controller/userCtrl");
const router = require("express").Router();

router.route('/').get(userCtrl.getMyRole);

router.route('/config')
    .get(userCtrl.getOwnData)
    .post(userCtrl.regUserData)
    .put(userCtrl.modUserDtl);

router.route('/pw').post(userCtrl.changeUserPw);
router.route('/project').get(userCtrl.getMyProject);
router.route('/info')
    .get(userCtrl.getUserData)
    .post(userCtrl.getUserMst);


module.exports = router;