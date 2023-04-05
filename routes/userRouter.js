const userCtrl = require("../controller/userCtrl");
const router = require("express").Router();

router.route('/:id');
router.route('/register').post(userCtrl.registUserData);
router.route('/withgoogle').post(userCtrl.registGoogleUser);

module.exports = router;