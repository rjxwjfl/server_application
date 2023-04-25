const connection = require("../configs/dbConfig");

const taskCtrl = {
  createTask: async (req, res) => {
    const {
      author_id,
      manager_id,
      title,
      task_desc,
      start_on,
      expire_on,
      task_att,
    } = req.body;
    const prjId = req.query.pid;

    const query = ``;
    const queryValue = [];
    
    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
      // add fcm notify to project members
    });
  },

  assignTask: async (req, res) => {
    const { pic_id, task_dtl_cnt } = req.body;
    const taskId = req.query.tid;

    const query = `
      INSERT INTO task_dtl (task_id, pic_id, task_dtl_cnt)
      VALUES (${taskId}, ${pic_id}, '${task_dtl_cnt}')
    `;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
      // add fcm notify to pic
    });
  },

  createTaskCmt: async (req, res) => {
    const { author_id, task_cmt_cnt } = req.body;
    const taskId = req.query.tid;

    const query = `
      INSERT INTO task_cmt (task_id, author_id, task_cmt_cnt)
      VALUES (${taskId}, ${author_id}, '${task_cmt_cnt}')
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

  createTaskCmtRly: async (req, res) => {
    const { author_id, task_reply_cnt } = req.body;
    const taskId = req.query.tid;
    const cmtId = req.query.cid;

    const query = `
      INSERT INTO task_cmt_reply (task_id, task_cmt_id, author_id, task_reply_cnt)
      VALUES (${taskId}, ${cmtId}, ${author_id}, ${task_reply_cnt})
    `;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
      // add fcm notify to author
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

  evaluateUser: async (req, res) => {
    const { user_eval } = req.body;
    const taskId = req.query.tid;
    const picId = req.query.pic;

    const query = `
      UPDATE task_dtl
      SET user_eval = ${user_eval}
      WHERE task_id = ${taskId} AND pic_id = ${picId}
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

  getTask: async (req, res) => {
    const tskId = req.query.tid;
    const prjId = req.query.pid;

    const query = `
      SELECT *
      FROM task
      WHERE task_id = ${tskId} AND prj_id = ${prjId}
    `;

    connection.query(query, (error, row) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(row);
    });
  },

  // for task compact list
  getAllTasks: async (req, res) => {
    const prjId = req.query.pid;

    const query = `
      SELECT 
      t.task_id, 
        t.prj_id, 
        t.title, 
        t.task_desc, 
        t.create_at, 
        t.update_at, 
        t.complete_at, 
        t.start_on, 
        t.expire_on, 
        t.task_state,
        t.author_id,
        a.name as author_name, 
        a.image_url as author_image_url,
        t.manager_id,
        m.name as manager_name, 
        m.image_url as manager_image_url
      FROM task t
      LEFT JOIN user_dtl a ON t.author_id = a.user_id
      LEFT JOIN user_dtl m ON t.manager_id = m.user_id;
      WHERE prj_id = ?
  `;

    connection.query(query, [prjId], (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  getTaskCmt: async (req, res) => {
    const tskId = req.query.tid;

    const query = `
      SELECT *
      FROM task_cmt
      WHERE task_id = ${tskId}
    `;

    connection.query(query, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  getTaskCmtReply: async (req, res) => {
    const tskId = req.query.tid;

    const query = `
      SELECT *
      FROM task_cmt_reply
      WHERE task_id = ${tskId}
    `;

    connection.query(query, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  deleteTask: async (req, res) => {
    const taskId = req.query.tid;

    connection.beginTransaction((err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }

      const taskQuery = `DELETE FROM task WHERE task_id=${taskId}`;
      const taskDtlQuery = `DELETE FROM task_dtl WHERE task_id=${taskId}`;
      const taskCmtQuery = `DELETE FROM task_cmt WHERE task_id=${taskId}`;
      const taskCmtReplyQuery = `DELETE FROM task_cmt_reply WHERE task_id=${taskId}`;
      const userTaskQuery = `DELETE FROM user_task WHERE task_id=${taskId}`;

      connection.query(taskQuery, (error, result) => {
        if (error) {
          return connection.rollback(() => {
            console.log(error);
            res.sendStatus(500);
          });
        }
        connection.query(taskDtlQuery, (error, result) => {
          if (error) {
            return connection.rollback(() => {
              console.log(error);
              res.sendStatus(500);
            });
          }
          connection.query(taskCmtQuery, (error, result) => {
            if (error) {
              return connection.rollback(() => {
                console.log(error);
                res.sendStatus(500);
              });
            }
            connection.query(taskCmtReplyQuery, (error, result) => {
              if (error) {
                return connection.rollback(() => {
                  console.log(error);
                  res.sendStatus(500);
                });
              }
              connection.query(userTaskQuery, (error, result) => {
                if (error) {
                  return connection.rollback(() => {
                    console.log(error);
                    res.sendStatus(500);
                  });
                }
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      console.log(err);
                      res.sendStatus(500);
                    });
                  }
                  res.sendStatus(200);
                });
              });
            });
          });
        });
      });
    });
  },
};

module.exports = taskCtrl;
