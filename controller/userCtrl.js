const connection = require("../configs/dbConfig");
const bcrypt = require("bcrypt");

const userCtrl = {
  regUserData: async (req, res) => {
    const { username, user_pw, name, contact, device_token, fb_uid } =
      req.body;
    let hashedPassword;
    if (user_pw){
      hashedPassword = await bcrypt.hash(user_pw, 10);
    }
    const callQuery = `
      CALL regUserData(?, ?, ?, ?, ?, ?)
    `;
    const callValues = [username, hashedPassword, name, contact, device_token, fb_uid];

    connection.query(callQuery, callValues, (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        console.log(result);
        const userId = parseInt(result[0][0].message);
        res.status(200).send({ user_id: userId });
      }
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

  getUserMst: async (req, res) => {
    const { username } = req.body;

    console.log(req.body);
    const query = `
      SELECT *
      FROM user_mst
      WHERE username = ?
    `;

    connection.query(query, [username], (error, row) => {
      if (error){
        console.error(error);
        res.sendStatus(500);
      }
      console.log(row);
      res.send(row);
    });
  },

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

  getMyRole: async (req, res) => {
    const prjId = req.query.pid;
    const userId = req.query.uid;

    
    const query = `
      SELECT *
      FROM project_mbr 
      WHERE prj_id=? AND user_id=?
    `;

    const queryValue = [prjId, userId];

    connection.query(query, queryValue, (error, rows) => {
      if (error) {
        res.sendStatus(500);
      }
      console.log(rows);
      res.send(rows);
    });
  },

  getMyProject: async (req, res) => {
    const userId = req.query.uid;

    const query = `CALL getMyPrj ( ? )`;

    connection.query(query, [userId], (error, rows) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
      console.log(rows);
      res.send(rows[0]);
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