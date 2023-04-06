const connection = require("../configs/dbConfig");
const fcmCtrl = require("./fcmCtrl");

const projectCtrl = {
  createPrj: async (req, res) => {
    const { title, category, description, goal, start_on, expire_on, rules } =
      req.body;
    const master_id = req.query.uid;

    connection.beginTransaction((error) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }

      const projectMstQuery = `
        INSERT INTO project_mst (title, category, master_id, description, goal, start_on, expire_on) 
        VALUES ('${title}', ${category}, ${master_id}, '${description}', '${goal}', '${start_on}', '${expire_on}')`;

      connection.query(projectMstQuery, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }

        const project_id = result.insertId;

        if (rules && rules.length > 0) {
          const ruleValues = rules.map((rule) => [project_id, rule]);
          const projectRulesQuery = `INSERT INTO project_rules (project_id, rule) VALUES ${ruleValues}`;
          connection.query(projectRulesQuery, (error, result) => {
            if (error) {
              console.error(error);
              connection.rollback(() => {
                return res.sendStatus(500);
              });
            }
          });
        }

        const projectMembersQuery = `INSERT INTO project_members (project_id, user_id, role) VALUES (${project_id}, ${master_id}, 'master')`;
        connection.query(projectMembersQuery, (error, result) => {
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
    });
  },

  updatePrj: async (req, res) => {
    const projectId = req.query.pid;
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

  deletePrj: async (req, res) => {
    const projectId = req.query.pid;
    const query = `
      DELETE project_mst, project_rules, project_members, tasks, tasks_members, tasks_comment, feed, feed_comment
      FROM project_mst
      LEFT OUTER JOIN project_rules ON project_mst.project_id = project_rules.project_id
      LEFT OUTER JOIN project_members ON project_mst.project_id = project_members.project_id
      LEFT OUTER JOIN tasks ON project_mst.project_id = tasks.project_id
      LEFT OUTER JOIN tasks_members ON tasks.task_id = tasks_members.task_id
      LEFT OUTER JOIN tasks_comment ON tasks.task_id = tasks_comment.task_id
      LEFT OUTER JOIN feed ON project_mst.project_id = feed.project_id
      LEFT OUTER JOIN feed_comment ON feed.feed_id = feed_comment.feed_id
      WHERE project_mst.project_id = ${projectId};
    `;
    connection.query(query, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  }, 

  empowerMst: async (req, res) => {
    const projectId = req.query.pid;
    const { oldMasterId, newMasterId } = req.body;

    const query = `
      UPDATE project_members pm
      JOIN project_mst pmst ON pmst.project_id = pm.project_id
      SET pm.role = CASE
          WHEN pm.user_id = ${oldMasterId} THEN 'member'
          WHEN pm.user_id = ${newMasterId} THEN 'master'
          ELSE pm.role
        END
      WHERE pm.project_id = ${projectId}
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
    const project_id = req.query.pid;
    const rule = req.body.rule;

    const query = `
        INSERT INTO project_rules (project_id, rule)
        VALUES (${project_id}, '${rule}')
      `;
    connection.query(query, (error, result) => {
      if (error){
        console.log(error);
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });
  },

  deleteRule: async (req, res) => {
    const rule_id = req.query.rid;

    const query = `DELETE FROM project_rules WHERE rule_id = ${rule_id}`;

    connection.query(query, (error, result) => {
      if (error){
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

    let projectsQuery = `
      SELECT 
        p.project_id, 
        p.title, 
        p.category, 
        p.description,
        p.goal, 
        p.start_on, 
        p.expire_on, 
        COUNT(pm.pmember_id) AS member_count, 
        u.name AS master_name, 
        u.introduce AS master_introduce, 
        u.image_url AS master_image_url 
      FROM project_mst p 
      LEFT JOIN project_members pm ON p.project_id = pm.project_id 
      LEFT JOIN user_dtl u ON p.master_id = u.user_id
    `;

    if (searchKeyword) {
      projectsQuery += ` WHERE p.title LIKE '%${searchKeyword}%'`;
    }

    if (categories && Array.isArray(categories)) {
      if (categories.length > 0) {
        const categoryFilter = categories
          .map((category) => `p.category = ${category}`)
          .join(" OR ");
        projectsQuery += ` AND (${categoryFilter})`;
      }
    }
    
    projectsQuery += ` GROUP BY p.project_id, p.title, p.category, p.description, p.goal, p.start_on, p.expire_on, u.name, u.introduce, u.image_url`;

    if (sort) {
      switch (sort) {
        case "start_on_desc":
          projectsQuery += ` ORDER BY p.start_on DESC`;
          break;
        case "start_on_asc":
          projectsQuery += ` ORDER BY p.start_on ASC`;
          break;
        case "expire_on_desc":
          projectsQuery += ` ORDER BY p.expire_on DESC`;
          break;
        case "expire_on_asc":
          projectsQuery += ` ORDER BY p.expire_on ASC`;
          break;
        case "member_count_desc":
          projectsQuery += ` ORDER BY member_count DESC`;
          break;
        case "member_count_asc":
          projectsQuery += ` ORDER BY member_count ASC`;
          break;
        case "title_asc":
          projectsQuery += ` ORDER BY p.title ASC`;
          break;
        case "title_desc":
        default:
          projectsQuery += ` ORDER BY p.title DESC`;
          break;
      }
    }

    projectsQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    connection.query(projectsQuery, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      console.log(rows);
      res.send(rows);
    });
  },

  getProject: async (req, res) => {
    const project_id = req.query.pid;

    const query = `
      SELECT *
      FROM project_mst pm
      WHERE pm.project_id = ${project_id}
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
    const project_id = req.query.pid;

    const query = `
      SELECT *
      FROM project_rules
      WHERE project_id = ${project_id}
    `;

    connection.query(query, (error, rows) => {
      if (error){
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
      VALUES (${project_id}, ${user_id}, 'guest')
    `;
    // in flutter : accept(->member) or denied(->row delete)
    connection.query(query, (error, result) => {
      if (error){
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
      if (error){
        res.sendStatus(500);
      }
      res.sendStatus(200);
    });

  }, //fcm
  
  getMembers: async (req, res) => {
    const project_id = req.query.pid;
    const query = `
      SELECT pm.role, ud.name, ud.introduce, ud.image_url, tm.progress, tm.evaluation
      FROM project_members pm
      LEFT JOIN user_dtl ud ON pm.user_id = ud.user_id
      LEFT JOIN tasks_members tm ON pm.user_id = tm.user_id
      WHERE pm.project_id=${project_id}
    `;
    connection.query(query, (error, rows) => {
      if (error){
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },

  inviteMember: async (req, res) => {
    const { project_id, user_id } = req.body;
    fcmCtrl.invitePush();

  }
};

module.exports = projectCtrl;
