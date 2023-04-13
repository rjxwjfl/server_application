const connection = require("../configs/dbConfig");
const bcrypt = require("bcrypt");

const userCtrl = {
  registUserData: async (req, res) => {
    const { username, user_pw, name, contact, device_token, fb_uid } =
      req.body;
    const hashedPassword = await bcrypt.hash(user_pw, 10);
    connection.beginTransaction((error) => {
      if (error){
        console.log(error);
        res.sendStatus(500);
      };

      const userMstQuery = `
                INSERT INTO user_mst (username, user_pw, device_token, fb_uid) 
                VALUES (?, ?, ?, ?)`;
      const userMstValue = [username, hashedPassword, device_token, fb_uid];

      connection.query(userMstQuery, userMstValue, (error, result) => {
        if (error) {
          connection.rollback(() => {
            console.log(error);
            res.sendStatus(500);
          });
        }
        const userId = result.insertId;
        const userDtlQuery = `
                INSERT INTO user_dtl (user_id, name, contact) 
                VALUES (?, ?, ?)`;
        const userDtlValue = [userId, name, contact];

        connection.query(userDtlQuery, userDtlValue, (error) => {
          if (error) {
            connection.rollback(() => {
              console.log(error);
              res.sendStatus(500);
            });
          }
        
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                console.log(error);
                res.sendStatus(500);
              });
            }
            console.log(result);
            res.status(200).send({ user_id: userId });
          });
        });
      });
    });
  }, 

  registGoogleUser: async (req, res) => {
    const { username, name, contact, device_token, fb_uid } = req.body;
    
    connection.beginTransaction((error) => {
      if (error){
        console.log(error);
        res.sendStatus(500);
      };

      const userMstQuery = `
                INSERT INTO user_mst (username, device_token, fb_uid) 
                VALUES (?, ?, ?)`;
      const userMstValue = [username, device_token, fb_uid];

      connection.query(userMstQuery, userMstValue,(error, result) => {
        if (error) {
          connection.rollback(() => {
            console.log(error);
            res.sendStatus(500);
          });
        }

        const userId = result.insertId;
        const userDtlQuery = `
          INSERT INTO user_dtl (user_id, name, contact) 
          VALUES (?, ?, ?)`;
        const userDtlValue = [userId, name, contact];

        connection.query(userDtlQuery, userDtlValue, (error) => {
          if (error) {
            connection.rollback(() => {
        console.log(error);
        res.sendStatus(500);
            });
          }
          connection.commit((error) => {
            if (error) {
              connection.rollback(() => {
                console.log(error);
                res.sendStatus(500);
              });
            }
            console.log(result);
            res.status(200).send({ user_id: userId });
          });
        });
      });
    });
  }, // add duplication check for account

  // -- query for entire user data (user own)
  getOwnData: async (req, res) => {
    const userId = req.query.uid;
    const query = `
      SELECT 
        um.username,
        um.fb_uid,
        ud.create_at,
        ud.update_at,
        ud.latest_access,
        ud.name,
        ud.contact,
        ud.introduce,
        ud.image_url,
        ud.sub_state,
        ud.sub_deadline,
      FROM user_mst um
      LEFT JOIN user_dtl ud ON um.user_id = ud.user_id
      LEFT JOIN user_prj up ON um.user_id = up.user_id
      LEFT JOIN user_task ut ON um.user_id = ut.user_id
      WHERE um.user_id = ?
    `;

    connection.query(query, [userId], (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.status(200).send(result);
    });
  },

  // -- query for user data (another user)
  getUserData: async (req, res) => {
    const userId = req.query.uid;
    const query = `
      SELECT *
        FROM user_dtl
        WHERE user_id = ?
        `;
        // COUNT(DISTINCT up.prj_id) AS project_count,
        // COUNT(DISTINCT ut.task_id) AS task_count 
        // 1. Let's just write a query one more time.
        // 2. Let's get the whole dtl on Flutter or build a new model.
    connection.query(query, [userId], (error, result) => {
      if (error){
        console.log(error);
        res.sendStatus(500);
      }
      console.log(result);
      res.status(200).send(result);
    });
  },

  modUserDtl: async (req, res) => {
    const userId = req.query.uid;
    const { name, contact, introduce, image_url } = req.body;
    const query = `
        UPDATE user_dtl 
        SET name=?, contact=?, introduce=?, image_url=?
        WHERE user_id = ?
        `;
    const queryValue = [name, contact, introduce, image_url, userId];

    connection.query(query, queryValue, (error, rows) => {
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
    const userId = req.query.uid;

    if (old_password && new_password) {
      const select = `SELECT user_pw FROM user_mst WHERE user_id = ${userId}`;
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
              const updated = `UPDATE user_mst SET user_pw = ? WHERE user_id = ?`;
              const updatedValue = [hashedPassword, userId];

              connection.query(updated, updatedValue, (error, results) => {
                if (error) {
                  console.error(error);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
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
    const userId = req.query.uid;

    const query = `
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
          FROM user_prj up
          LEFT JOIN project_mst p ON up.prj_id = p.prj_id
          LEFT JOIN project_member pm ON p.project_id = pm.project_id 
          LEFT JOIN user_dtl u ON p.master_id = u.user_id
          WHERE up.user_id = ${userId}
          GROUP BY p.project_id, p.title, p.category, p.description, p.goal, p.start_on, p.expire_on, u.name, u.introduce, u.image_url;
        `;

    connection.query(query, (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      res.send(rows);
    });
  },
};

module.exports = userCtrl;


// ResultSetHeader {
//   fieldCount: 0,
//   affectedRows: 1,
//   insertId: 3,
//   info: '',
//   serverStatus: 3,
//   warningStatus: 0
// }