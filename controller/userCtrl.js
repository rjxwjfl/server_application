const connection = require("../configs/dbConfig");
const bcrypt = require("bcrypt");

const userCtrl = {
  registUserData: async (req, res) => {
    const { username, password, name, device_token, fb_uid } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.beginTransaction((error) => {
      if (error) throw error;

      const userMstQuery = `
                INSERT INTO user_mst (username, password, device_token, fb_uid) 
                VALUES ('${username}','${hashedPassword}','${device_token}','${fb_uid}')`;
      connection.query(userMstQuery, (error, result) => {
        if (error) {
          connection.rollback(() => {
            console.log(error);
            throw error;
          });
        }
        const userDtlQuery = `INSERT INTO user_dtl (user_id, name) VALUES (${result.insertId}, '${name}')`;
        connection.query(userDtlQuery, (error) => {
          if (error) {
            connection.rollback(() => {
              throw error;
            });
          }
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                throw error;
              });
            }
            res.sendStatus(200);
          });
        });
      });
    });
  }, // add duplication check for account

  registGoogleUser: async (req, res) => {
    const { username, name, device_token, fb_uid } = req.body;
    connection.beginTransaction((error) => {
      if (error) throw error;

      const userMstQuery = `
                INSERT INTO user_mst (username, name, device_token, fb_uid) 
                VALUES (${username}, ${name}, ${device_token}, ${fb_uid})`;
      connection.query(userMstQuery, (error, result) => {
        if (error) {
          connection.rollback(() => {
            throw error;
          });
        }
        const userId = result.insertId;
        const userDtlQuery = `INSERT INTO user_dtl (user_id) VALUES (${userId})`;
        connection.query(userDtlQuery, (error) => {
          if (error) {
            connection.rollback(() => {
              throw error;
            });
          }
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                throw error;
              });
            }
            res.send(result);
          });
        });
      });
    });
  }, // add duplication check for account

  // /user/
  getUserData: async (req, res) => {},
  modUserDtl: async (req, res) => {
    const user_id = req.query.uid;
    const { name, introduce, image_url } = req.body;
    let query = `
        UPDATE user_dtl 
        SET `;

    if (name) {
      query += `name = '${name}', `;
    }
    if (introduce) {
      query += `introduce = '${introduce}', `;
    }
    if (image_url) {
      query += `image_url = '${image_url}' `;
    }
    query += `WHERE user_id = ${user_id}`;

    connection.query(query, (error, rows) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  },

  changeUserPw: async (req, res) => {
    const { old_password, new_password } = req.body;
    const userId = req.params.id;

    if (old_password && new_password) {
      const select = `SELECT password FROM user_mst WHERE user_id = ${userId}`;
      connection.query(select, async (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).send("Internal server error");
        } else {
          if (result.length > 0) {
            const user = result[0];
            const isMatch = await bcrypt.compare(old_password, user.password);
            if (isMatch) {
              const hashedPassword = await bcrypt.hash(new_password, 10);
              const updated = `UPDATE user_mst SET password = ${hashedPassword} WHERE user_id = ${userId}`;
              connection.query(updated, (error, results) => {
                if (error) {
                  console.error(error);
                  res.status(500).send("Internal server error");
                } else {
                  res.status(200).send("Password changed successfully");
                }
              });
            } else {
              res.status(400).send("Old password is incorrect");
            }
          } else {
            res.status(404).send("User not found");
          }
        }
      });
    } else {
      res.status(400).send("Both old and new passwords are required");
    }
  },

  getMyProject: async (req, res) => {
    const user_id = req.query.uid;
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
          WHERE p.master_id = ${user_id}
        `;

    if (searchKeyword) {
      projectsQuery += ` AND LIKE '%${searchKeyword}%'`;
    }

    if (categories.length > 0) {
      const categoryFilter = categories
        .map((category) => `p.category = ${category}`)
        .join(" OR ");
      projectsQuery += ` AND (${categoryFilter})`;
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
      res.send(rows);
    });
  },
};

module.exports = userCtrl;
