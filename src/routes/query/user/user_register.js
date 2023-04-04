const { app, connection } = require("../../../app");

app.post('/user/register', async (req, res) => {
    const user = req.body;
    const { username, password, name, device_token, fb_uid } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.getConnection((err, sql) => {
        if (err) throw err;
        sql.beginTransaction((err) => {
            if (err) throw err;

            const userMstQuery = 'INSERT INTO user_mst (username, password, name, device_token, fb_uid) VALUES (?, ?, ?, ?, ?)';

            sql.query(userMstQuery, [username, hashedPassword, name, device_token, fb_uid], (err, result) => {
                if (err) {
                    sql.rollback(() => {
                        throw err;
                    });
                }

                const userId = result.insertId;
                const userDtlQuery = 'INSERT INTO user_dtl (user_id) VALUES (?)';

                sql.query(userDtlQuery, [userId], (err) => {
                    if (err) {
                        sql.rollback(() => {
                            throw err;
                        });
                    }
                    sql.commit((err) => {
                        if (err) {
                            sql.rollback(() => {
                                throw err;
                            });
                        }
                        res.status(201).json({ message: 'User created successfully' });
                    });
                });
            });
        });
    });
});

app.post('/user/google-register', async (req, res) => {
    const user = req.body;
    const { username, name, device_token, fb_uid } = user;

    connection.getConnection((err, sql) => {
        if (err) throw err;
        sql.beginTransaction((err) => {
            if (err) throw err;

            const userMstQuery = 'INSERT INTO user_mst (username, name, device_token, fb_uid) VALUES (?, ?, ?, ?)';

            sql.query(userMstQuery, [username, name, device_token, fb_uid], (err, result) => {
                if (err) {
                    sql.rollback(() => {
                        throw err;
                    });
                }

                const userId = result.insertId;
                const userDtlQuery = 'INSERT INTO user_dtl (user_id) VALUES (?)';

                sql.query(userDtlQuery, [userId], (err) => {
                    if (err) {
                        sql.rollback(() => {
                            throw err;
                        });
                    }
                    sql.commit((err) => {
                        if (err) {
                            sql.rollback(() => {
                                throw err;
                            });
                        }
                        res.status(201).json({ message: 'User created successfully' });
                    });
                });
            });
        });
    });
});
