const taskCtrl = require("../controller/taskCtrl");
const router = require("express").Router();

router.route('/')
    .get(taskCtrl.getAssignedTask);
    
router.route('/taskList')
    .get(taskCtrl.getTaskList);

router.route('/userTaskList')
    .get(taskCtrl.getUserTaskList);

module.exports = router;