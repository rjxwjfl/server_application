const e = require("express");
const connection = require("../configs/dbConfig");
const fcmCtrl = require("./fcmCtrl");

const projectCtrl = {
  // post
  createPrj: async (req, res) => {
    const mstId = req.query.uid;
    const { title, category, prj_desc, goal, start_on, expire_on, pvt, prj_pw } = req.body;

    const query = `
      CALL createPrj(?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const queryValue = [mstId, title, category, prj_desc, goal, start_on, expire_on, pvt, prj_pw];

    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        console.log(result);
        res.status(200).send({ prj_id: result[0]["prj_id"] });
      }
    });
  },

  setMileStone: async (req, res) => {
    const prjId = req.query.pid;
    const taskId = req.query.tid;
    const { ms_title, ms_content, ms_state } = req.body;

    const query = `
      INSERT INTO project_ms (prj_id, task_id, ms_title, ms_content, ms_state)
      VALUES (?, ?, ?, ?, ?)
    `;
    const queryValue = [prjId, taskId, ms_title, ms_content, ms_state];

    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  setRule: async (req, res) => {
    const prjId = req.query.pid;
    const { rule } = req.body.rule;

    const query = `
        INSERT INTO project_rules (prj_id, rule)
        VALUES (?, ?)
      `;
    const queryValue = [prjId, rule];
    
    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  },

  // put
  updatePrj: async (req, res) => {
    const prjId = req.query.pid;
    const { title, category, prj_desc, goal, start_on, expire_on } = req.body;

    const query = `
      UPDATE project_mst
      SET title=?, category=?, prj_desc=?, goal=?, start_on=?, expire_on=?
      WHERE prj_id=?
    `;
    const queryValue = [title, category, prj_desc, goal, start_on, expire_on, prjId];

    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {

        res.sendStatus(200);
        // add fcm notify
      }
    });
  },

  empowerMst: async (req, res) => {
    const prjId = req.query.pid;
    const { mstOld, mstNew } = req.body;

    const query = `
      UPDATE project_mbr pm
      JOIN project_mst pmst ON pmst.prj_id = pm.prj_id
      SET pm.role = CASE
          WHEN pm.user_id = ? THEN 'member'
          WHEN pm.user_id = ? THEN 'master'
          ELSE pm.role
        END
      WHERE pm.prj_id = ?
    `;
    const queryValue = [mstOld, mstNew, prjId];

    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
        // add fcm notify
      }
    });
  },

  adjustRole: async (req, res) => {
    const prjId = req.query.pid;
    const { user_id, role } = req.body;
  
    const query = `
      UPDATE project_members 
      SET role=? 
      WHERE user_id=? AND project_id=?
    `;
    const queryValue = [role, user_id, prjId];

    connection.query(query, queryValue, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
      // add fcm notify
    });
  },

  // get
  acceptJoin: async (req, res) => {
    const prjId = req.query.pid;
    const userId = req.query.uid;

    connection.beginTransaction((error) => {
      if (error){
        console.log(error);
        res.sendStatus(500);
      }

      const mbrQuery = `
        INSERT INTO project_mbr (prj_id, user_id, role)
        VALUES (?, ?, 3)
      `;
      const mbrQueryValue = [prjId, userId];
      // in flutter : accept(->member) or denied(->row delete)
      connection.query(mbrQuery, mbrQueryValue, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }

        const prjQuery = `
          INSERT INTO user_prj (user_id, prj_id)
          VALUES (?, ?)
        `;
        const prjQueryValue = [userId, prjId];

        connection.query(prjQuery, prjQueryValue, (error, result) => {
          if (error) {
            console.error(error);
            connection.rollback(() => {
              return res.sendStatus(500);
            });
          }
          connection.commit((error) => {
            if (error) {
              console.error(error);
              connection.rollback(() => {
                return res.sendStatus(500);
              });
            }
            // add fcm notify to accepted user
            return res.sendStatus(200);
          }); 
        });

      });
    });
  },

  searchPrj: async (req, res) => {
    const page = req.query.pg || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const searchKeyword = req.query.sk;
    const sort = req.query.st;

    console.log(searchKeyword);

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
        p.pvt,
        COUNT(pm.prj_mbr_id) AS member_count, 
        u.name AS master_name, 
        u.introduce AS master_introduce, 
        u.image_url AS master_image_url 
      FROM project_mst p 
      LEFT JOIN project_mbr pm ON p.prj_id = pm.prj_id 
      LEFT JOIN user_dtl u ON p.mst_id = u.user_id
      ${searchKeyword? `WHERE p.title LIKE ?` : ``}
      GROUP BY p.prj_id, p.title, p.mst_id, p.category, p.prj_desc, p.goal, p.start_on, p.expire_on, u.name, u.introduce, u.image_url
      ORDER BY ?
      LIMIT ? OFFSET ?
    `;

    const orderOption =  () => {
      const map = {
        1: `p.start_on DESC`,
        2: `p.start_on ASC`,
        3: `p.expire_on DESC`,
        4: `p.expire_on ASC`,
        5: `member_count DESC`,
        6: `member_count ASC`,
        7: `p.title ASC`,
      };
      const order = map[sort] ?? `p.title DESC`;
      return order;
    }

    console.log(query);

    let queryValue = searchKeyword? [ `%${searchKeyword}%`, orderOption(sort), limit, offset ]:[ orderOption(sort), limit, offset];

    console.log(queryValue);
    connection.query(query, queryValue, (error, rows) => {
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
    SELECT pm.*, COUNT(pmbr.prj_mbr_id) AS member_count
    FROM project_mst pm
    LEFT JOIN project_mbr pmbr ON pm.prj_id = pmbr.prj_id
    WHERE pm.prj_id = ?
    GROUP BY pm.prj_id
    `;

    connection.query(query, [prjId], (error, rows) => {
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
      WHERE prj_id = ?
    `;

    connection.query(query, [prjId], (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      console.log(rows);
      res.send(rows);
    });
  },

  getMembers: async (req, res) => {
    const prjId = req.query.pid;
    const query = `
      SELECT
        pm.user_id,
        pm.role,
        ud.latest_access,
        ud.name,
        ud.contact,
        ud.introduce,
        ud.image_url
      FROM project_mbr pm
      LEFT JOIN user_dtl ud ON pm.user_id = ud.user_id
      WHERE pm.prj_id = ?
    `;
    connection.query(query, [prjId], (error, rows) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      }
      console.log(rows);
      res.send(rows);
    });
  },

  inviteMember: async (req, res) => {
    const { project_id, user_id } = req.body;
    fcmCtrl.invitePush();
  },

  purgeUser: async (req, res) => {
    const userId = req.query.uid;
    const prjId = req.query.pid;

    const query = `
      CALL purgeUser(?, ?)
    `;
    const queryValue = [userId, prjId];

    connection.query(query, queryValue, (error, result) => {
      if (error){
        console.error(error);
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    });
  },

  deleteRule: async (req, res) => {
    const ruleId = req.query.rid;

    const query = `
      DELETE 
      FROM project_rules 
      WHERE rule_id = ?`;

    connection.query(query, [ruleId], (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  deletePrj: async (req, res) => {
    const prjId = req.query.pid;

    const query = `
      CALL prjRemove(?)
    `;

    connection.query(query, [prjId], (error, result)=>{
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  }, // callback hell
};

module.exports = projectCtrl;
