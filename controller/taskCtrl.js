const connection = require("../configs/dbConfig");

const taskCtrl = {
  createTask: async (req, res) => {
    const {
      pub_id,
      task_mgr_id,
      task_sub,
      lbl_clr,
      priority,
      task_att_id,
      task_dtl_desc,
      task_pe,
      task_period,
      start_date,
      end_date,
      task_freq,
      users,
    } = req.body;
    const prjId = req.query.pid;

    const userMap = users.map((user) => {
      const {
        user_id,
        task_user_att_id,
        task_pnt,
        task_cmt,
        task_state,
        start_date,
        end_date,
      } = user;

      return {
        user_id,
        task_user_att_id,
        task_pnt,
        task_cmt,
        task_state,
        start_date,
        end_date,
      };
    });

    const taskUsers = JSON.stringify(userMap);

    console.log(taskUsers);

    const query = `CALL createTask(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const queryValue = [
      pub_id,
      task_mgr_id,
      task_sub,
      lbl_clr,
      priority,
      task_att_id,
      task_dtl_desc,
      task_pe,
      task_period,
      start_date,
      end_date,
      task_freq,
      taskUsers,
      prjId,
    ];

    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      const taskId = parseInt(result[0][0].task_id);
      console.log(taskId);
      res.status(200).send({ task_id: taskId });
    });
  },

  assignTask: async (req, res) => {
    const { users } = req.body;
    const prjId = req.query.pid;
    const taskId = req.query.tid;

    const userMap = users.map((user) => {
      const {
        user_id,
        task_user_att_id,
        task_pnt,
        task_cmt,
        task_state,
        start_date,
        end_date,
      } = user;

      return {
        user_id,
        task_user_att_id,
        task_pnt,
        task_cmt,
        task_state,
        start_date,
        end_date,
      };
    });

    const taskUsers = JSON.stringify(userMap);

    const query = `CALL assignTask(?, ?, ?)`;
    const queryValue = [prjId, taskId, taskUsers];

    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
      // add fcm notify to pic
    });
  },

  updateTaskState: async (req, res) => {
    const taskAsgdId = req.query.taid;

    const query = ``;
    const queryValue = [];

    connection.query(query, (error, result) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  updateManager: async (req, res) => {
    const { manager_id } = req.body;
    const taskId = req.query.tid;

    const query = `
      UPDATE task
      SET manager_id = ${manager_id}
      WHERE task_id = ${taskId}
    `;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
      // add fcm notify to task members
    });
  },

  updateDtl: async (req, res) => {
    const { task_dtl_cnt } = req.body;
    const taskId = req.query.tid;
    const picId = req.query.uid;

    const query = `
      UPDATE task_dtl
      SET task_dtl_cnt = ${task_dtl_cnt}
      WHERE task_id = ${taskId} AND pic_id = ${picId}
    `;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  updateProg: async (req, res) => {
    const { user_prog } = req.body;
    const taskId = req.query.tid;
    const picId = req.query.uid;

    const query = `
      UPDATE task_dtl
      SET user_prog = ${user_prog}
      WHERE task_id = ${taskId} AND pic_id = ${picId}
    `;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  // Get detail data to selected task
  getTaskList: async (req, res) => {
    const prjId = req.query.pid;

    const query = `
    SELECT
      tm.task_id,
      tm.prj_id,
      tm.pub_id,
      pud.name AS pub_name,
      pud.image_url AS pub_image,
      tm.task_mgr_id,
      mud.name AS mgr_name,
      mud.image_url AS mgr_image,
      td.task_att_id,
      tm.task_sub,
      td.task_dtl_desc,
      tm.lbl_clr,
      tm.priority,
      td.create_at,
      td.update_at,
      td.task_pe,
      td.task_period,
      td.start_date,
      td.end_date,
      td.task_freq,
      COUNT(DISTINCT ta.user_id) AS users_count
    FROM task_mst AS tm
    LEFT JOIN user_dtl pud ON tm.pub_id = pud.user_id
    LEFT JOIN user_dtl mud ON tm.task_mgr_id = mud.user_id
    LEFT JOIN task_dtl td ON tm.task_id = td.task_id
    LEFT JOIN task_assigned ta ON tm.task_id = ta.task_id
    LEFT JOIN user_dtl ud ON ta.user_id = ud.user_id
    WHERE tm.prj_id = ? 
    GROUP BY
      tm.task_id,
      tm.prj_id,
      tm.pub_id,
      pud.name,
      pud.image_url,
      tm.task_mgr_id,
      mud.name,
      mud.image_url,
      td.task_att_id,
      td.task_dtl_desc,
      tm.lbl_clr,
      tm.priority,
      td.create_at,
      td.update_at,
      td.task_pe,
      td.task_period,
      td.start_date,
      td.end_date,
      td.task_freq
    `;

    connection.query(query, [prjId], (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  getUserTaskList: async (req, res) => {
    const userId = req.query.uid;
    const prjId = req.query.pid;

    let query = `
      SELECT
        tm.task_id,
        tm.prj_id,
        tm.pub_id,
        pud.name AS pub_name,
        pud.image_url AS pub_image,
        tm.task_mgr_id,
        mud.name AS mgr_name,
        mud.image_url AS mgr_image,
        td.task_att_id,
        tm.task_sub,
        td.task_dtl_desc,
        tm.lbl_clr,
        tm.priority,
        td.create_at,
        td.update_at,
        td.task_pe,
        td.task_period,
        td.start_date,
        td.end_date,
        td.task_freq,
        COUNT(DISTINCT ta.user_id) AS users_count
      FROM user_task ut
      LEFT JOIN task_mst tm ON ut.task_id = tm.task_id
      LEFT JOIN user_dtl pud ON tm.pub_id = pud.user_id
      LEFT JOIN user_dtl mud ON tm.task_mgr_id = mud.user_id
      LEFT JOIN task_dtl td ON tm.task_id = td.task_id
      LEFT JOIN task_assigned ta ON tm.task_id = ta.task_id
      LEFT JOIN user_dtl ud ON ta.user_id = ud.user_id
      WHERE ut.user_id = ?
      `;
    const queryParams = [userId];

    if (prjId) {
      queryParams.push(prjId);
      query += `AND tm.prj_id = ?`
    }
    query += `
      GROUP BY
        tm.task_id,
        tm.prj_id,
        tm.pub_id,
        pud.name,
        pud.image_url,
        tm.task_mgr_id,
        mud.name,
        mud.image_url,
        td.task_att_id,
        td.task_dtl_desc,
        tm.lbl_clr,
        tm.priority,
        td.create_at,
        td.update_at,
        td.task_pe,
        td.task_period,
        td.start_date,
        td.end_date,
        td.task_freq
    `;
    connection.query(query, queryParams, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
      console.log(rows);
    });
  },

  // Get all tasks assigned to a user
  // If project id is provided, return only tasks for that project
  getAssignedTask: async (req, res) => {
    const userId = req.query.uid;
    const prjId = req.query.pid;

    let query = `
      SELECT
        tm.prj_id,
        tm.task_id,
        tm.pub_id,
        ta.task_asgd_id,
        pud.name AS pub_name,
        tm.task_mgr_id,
        mud.name AS mgr_name,
        tm.task_sub,
        tm.lbl_clr,
        tm.priority,
        ta.task_pnt,
        ta.task_cmt,
        ta.task_state,
        ta.create_at,
        ta.update_at,
        ta.start_date,
        ta.end_date,
        ta.cmpl_date
      FROM task_mst tm
      LEFT JOIN user_dtl pud ON tm.pub_id = pud.user_id
      LEFT JOIN user_dtl mud ON tm.task_mgr_id = mud.user_id
      LEFT JOIN task_assigned ta ON tm.task_id = ta.task_id
      WHERE ta.user_id = ?
      `;

    const queryParams = [userId];

    if (prjId) {
      query += " AND tm.prj_id = ?";
      queryParams.push(prjId);
    }

    connection.query(query, queryParams, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
      console.log(rows);
    });
  },
};

module.exports = taskCtrl;
