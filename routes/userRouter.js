const userCtrl = require("../controller/userCtrl");
const router = require("express").Router();

router.route('/')
    .post(userCtrl.registUserData)
    .put(userCtrl.modUserDtl);

router.route('/google').post(userCtrl.registGoogleUser);
router.route('/pw').post(userCtrl.changeUserPw);
router.route('/project').get(userCtrl.getMyProject);
router.route('/info').get(userCtrl.getUserData);

module.exports = router;