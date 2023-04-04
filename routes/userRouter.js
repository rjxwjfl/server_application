const userCtrl = require("../controller/userCtrl");
const router = require("express").Router();

router.route('/:id');
router.route('/register').post(userCtrl.registUserData);
router.route('/regoogle').post(userCtrl.registGoogleUser);

module.exports = router;