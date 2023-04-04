const { app, connection } = require("../../../../app");

app.post('/user/modifyinfo', async(req, res) => {
    const data = req.body;
    const { introduce, image_url } = data;

    connection.getConnection((err, sql) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const sqlQuery = "UPDATE user_dtl SET introduce = ?, image_url = ? WHERE user_id = ?";
            const values = [introduce, image_url, req.user.user_id]; // req.user.user_id에는 현재 로그인한 사용자의 user_id 값이 들어갑니다.

            sql.query(sqlQuery, values, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.status(200).send("User info updated successfully");
                }
            });
        }
    });
});

app.post('/user/changepw', async (req, res) => {
  const data = req.body;
  const { user_id, old_password, new_password } = data;

  
  if (old_password && new_password) {
    
    connection.query('SELECT password FROM user_mst WHERE user_id = ?', [user_id], async (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      } else {
        if (results.length > 0) {
          const user = results[0];
          const passwordMatch = await bcrypt.compare(old_password, user.password);
          if (passwordMatch) {
            const hashedPassword = await bcrypt.hash(new_password, 10);
            connection.query('UPDATE user_mst SET password = ? WHERE user_id = ?', [hashedPassword, user_id], (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).send('Internal server error');
              } else {
                res.status(200).send('Password changed successfully');
              }
            });
          } else {
            res.status(400).send('Old password is incorrect');
          }
        } else {
          res.status(404).send('User not found');
        }
      }
    });
  } else {
    res.status(400).send('Both old and new passwords are required');
  }
});
