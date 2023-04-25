const taskCtrl = require("../controller/taskCtrl");
const router = require("express").Router();

router.route('/')
    .get(taskCtrl.getAllTasks)
    .post(taskCtrl.createTask);
    
router.route('/info')
    .get(taskCtrl.getTask);

module.exports = router;