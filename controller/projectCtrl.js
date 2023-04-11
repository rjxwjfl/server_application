const connection = require("../configs/dbConfig");
const fcmCtrl = require("./fcmCtrl");

const projectCtrl = {
  createPrj: async (req, res) => {
    const {
      title,
      category,
      prj_desc,
      goal,
      start_on,
      expire_on,
      rules,
      prj_pw,
    } = req.body;
    const mstId = req.query.uid;
    const pvt = req.query.private;
  
    connection.beginTransaction((error) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }
  
      let mstQueryValues = [
        title,
        category,
        mstId,
        prj_desc,
        goal,
        start_on || null,
        expire_on || null,
      ];
  
      let mstQueryColumns = [
        "title",
        "category",
        "mst_id",
        "prj_desc",
        "goal",
        "start_on",
        "expire_on",
      ];
  
      if (pvt == 1) {
        mstQueryColumns.push("pvt", "prj_pw");
        mstQueryValues.push(pvt, prj_pw);
      }
  
      let mstQuery = `
        INSERT INTO project_mst (${mstQueryColumns.join(", ")}) 
        VALUES (?, ?, ?, ?, ?, ?, ? ${pvt == 1 ? ", ?, ?" : ""})`;
  
      connection.query(mstQuery, mstQueryValues, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
  
        const prjId = result.insertId;
  
        if (rules && rules.length > 0) {
          const ruleValues = rules.map((rule) => [prjId, rule]);
          const ruleQuery = `INSERT INTO project_rules (prj_id, rule) VALUES ?`;
          connection.query(ruleQuery, [ruleValues], (error, result) => {
            if (error) {
              console.error(error);
              connection.rollback(() => {
                return res.sendStatus(500);
              });
            }
          });
        }
  
        const memberQuery = `INSERT INTO project_mbr (prj_id, user_id, role) VALUES (${prjId}, ${mstId}, 0)`;
        connection.query(memberQuery, (error, result) => {
          if (error) {
            console.error(error);
            connection.rollback(() => {
              return res.sendStatus(500);
            });
          }
        });
  
        connection.commit((error) => {
          if (error) {
            console.error(error);
            connection.rollback(() => {
              return res.sendStatus(500);
            });
          }
          res.status(200).send({ prj_id: prjId });
        });
      });
    });
  },
  // Transaction 씹히고 생성되는 문제가 있음

  updatePrj: async (req, res) => {
    const prjId = req.query.pid;
    const { title, category, description, goal, start_on, expire_on } =
      req.body;

    const query = `
      UPDATE project_mst
      SET title='${title}', category=${category}, description='${description}', goal='${goal}', start_on='${start_on}', expire_on='${expire_on}'
      WHERE project_id=${projectId}
    `;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  }, //fcm

  setMileStone: async (req, res) => {
    const { ms_title, ms_content, ms_state } = req.body;
    const prjId = req.query.pid;
    const taskId = req.query.tid;

    const query = `
      INSERT INTO project_ms (prj_id, task_id, ms_title, ms_content, ms_state)
      VALUES (${prjId}, ${taskId}, '${ms_title}', '${ms_content}', ${ms_state})
    `;
  },

  empowerMst: async (req, res) => {
    const prjId = req.query.pid;
    const { oldMasterId, newMasterId } = req.body;

    const query = `
      UPDATE project_mbr pm
      JOIN project_mst pmst ON pmst.prj_id = pm.prj_id
      SET pm.role = CASE
          WHEN pm.user_id = ${oldMasterId} THEN 'member'
          WHEN pm.user_id = ${newMasterId} THEN 'master'
          ELSE pm.role
        END
      WHERE pm.prj_id = ${prjId}
    `;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  }, //fcm

  createRule: async (req, res) => {
    const prjId = req.query.pid;
    const rule = req.body.rule;

    const query = `
        INSERT INTO project_rules (prj_id, rule)
        VALUES (${prjId}, '${rule}')
      `;
    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  deleteRule: async (req, res) => {
    const ruleId = req.query.rid;

    const query = `DELETE FROM project_rules WHERE rule_id = ${ruleId}`;

    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  searchPrj: async (req, res) => {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const searchKeyword = req.query.searchKeyword || "";
    const categories = req.query.category || [];
    const sort = req.query.sort || "";
    let queryMatrix = [];

    let query = `
      SELECT 
        p.prj_id, 
        p.mst_id,
        p.title, 
        p.category, 
        p.prj_desc,
        p.goal, 
        p.start_on, 
        p.expire_on, 
        COUNT(pm.prj_mbr_id) AS member_count, 
        u.name AS master_name, 
        u.introduce AS master_introduce, 
        u.image_url AS master_image_url 
      FROM project_mst p 
      LEFT JOIN project_mbr pm ON p.prj_id = pm.prj_id 
      LEFT JOIN user_dtl u ON p.mst_id = u.user_id
    `;

    if (searchKeyword) {
      queryMatrix.push(`p.title LIKE '%${searchKeyword}%'`);
    }

    if (categories && Array.isArray(categories)) {
      if (categories.length > 0) {
        const categoryFilter = categories
          .map((category) => `p.category = ${category}`)
          .join(" OR ");
        queryMatrix.push(`(${categoryFilter})`);
      }
    }

    if (queryMatrix.length > 0) {
      query += ` WHERE ${queryMatrix.join(" AND ")}`;
    }

    query += ` 
    GROUP BY p.prj_id, p.title, p.mst_id, p.category, p.prj_desc, p.goal, p.start_on, p.expire_on, u.name, u.introduce, u.image_url`;

    if (sort) {
      switch (sort) {
        case "start_on_desc":
          query += ` ORDER BY p.start_on DESC`;
          break;
        case "start_on_asc":
          query += ` ORDER BY p.start_on ASC`;
          break;
        case "expire_on_desc":
          query += ` ORDER BY p.expire_on DESC`;
          break;
        case "expire_on_asc":
          query += ` ORDER BY p.expire_on ASC`;
          break;
        case "member_count_desc":
          query += ` ORDER BY member_count DESC`;
          break;
        case "member_count_asc":
          query += ` ORDER BY member_count ASC`;
          break;
        case "title_asc":
          query += ` ORDER BY p.title ASC`;
          break;
        case "title_desc":
        default:
          query += ` ORDER BY p.title DESC`;
          break;
      }
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    connection.query(query, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      console.log(rows);
      res.send(rows);
    });
  },

  getProject: async (req, res) => {
    const prjId = req.query.pid;

    const query = `
      SELECT *
      FROM project_mst pm
      WHERE pm.prj_id = ${prjId}
    `;

    connection.query(query, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  getRules: async (req, res) => {
    const prjId = req.query.pid;

    const query = `
      SELECT *
      FROM project_rules
      WHERE prj_id = ${prjId}
    `;

    connection.query(query, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  joinProject: async (req, res) => {
    const project_id = req.query.pid;
    const user_id = req.query.uid;

    const query = `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (${project_id}, ${user_id}, 3)
    `;
    // in flutter : accept(->member) or denied(->row delete)
    connection.query(query, (error, result) => {
      if (error) {
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  adjustRole: async (req, res) => {
    const project_id = req.query.pid;
    const { user_id, role } = req.body;

    const query = `UPDATE project_members SET role=${role} WHERE user_id=${user_id} AND project_id=${project_id}`;
    connection.query(query, (error, result) => {
      if (error) {
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  }, //fcm

  getMembers: async (req, res) => {
    const project_id = req.query.pid;
    const query = `
      SELECT pm.role, ud.name, ud.introduce, ud.image_url, ud.latest_access, tm.progress, tm.evaluation
      FROM project_members pm
      LEFT JOIN user_dtl ud ON pm.user_id = ud.user_id
      LEFT JOIN tasks_members tm ON pm.user_id = tm.user_id
      WHERE pm.project_id=${project_id}
    `;
    connection.query(query, (error, rows) => {
      if (error) {
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  inviteMember: async (req, res) => {
    const { project_id, user_id } = req.body;
    fcmCtrl.invitePush();
  },

  deletePrj: async (req, res) => {
    const prjId = req.query.pid;

    connection.beginTransaction((error) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }
      const taskCmtReply = `
        DELETE FROM task_cmt_reply WHERE task_cmt_id IN (
          SELECT task_cmt_id FROM task_cmt WHERE task_id IN (
            SELECT task_id FROM task WHERE prj_id = ${prjId}))`;

      connection.query(taskCmtReply, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const taskCmt = `
      DELETE FROM task_cmt WHERE task_id IN (
        SELECT task_id FROM task WHERE prj_id = ${prjId})`;
      connection.query(taskCmt, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const feedCmtReply = `DELETE FROM feed_cmt_reply WHERE feed_cmt_id IN (
        SELECT feed_cmt_id FROM feed_cmt WHERE feed_id IN (
            SELECT feed_id FROM feed WHERE prj_id = ${prjId}))`;
      connection.query(feedCmtReply, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const feedCmt = `DELETE FROM feed_cmt WHERE feed_id IN (
      SELECT feed_id FROM feed WHERE prj_id = ${prjId})`;

      connection.query(feedCmt, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const userPrj = `DELETE FROM user_prj WHERE prj_id = ${prjId}`;

      connection.query(userPrj, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const userTask = `DELETE FROM user_task WHERE task_id IN (
          SELECT task_id FROM task WHERE prj_id = ${prjId})`;
      connection.query(userTask, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const taskDtl = `
          DELETE FROM task_dtl WHERE task_id IN (
            SELECT task_id FROM task WHERE prj_id = ${prjId}
        )`;
      connection.query(taskDtl, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const mileStone = `DELETE FROM project_ms WHERE prj_id = ${prjId}`;
      connection.query(mileStone, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const taskDel = `DELETE FROM task WHERE prj_id = ${prjId}`;

      connection.query(taskDel, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const prjRule = `DELETE FROM project_rules WHERE prj_id = ${prjId}`;
      connection.query(prjRule, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const prjMember = `DELETE FROM project_mbr WHERE prj_id = ${prjId}`;
      connection.query(prjMember, (error, reseult) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      const prjDel = `DELETE FROM project_mst WHERE prj_id = ${prjId}`;
      connection.query(prjDel, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
      });
      connection.commit((error) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }
        res.sendStatus(200);
      });
    });
  },
};

module.exports = projectCtrl;
