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
            }
            );
        });
    },

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
    },

    // /user/:id/
    getUserData: async (req, res) => { },
    modUserDtl: async (req, res) => {
        const { introduce, image_url } = req.body;
        const sqlQuery = `UPDATE user_dtl SET introduce = ${introduce}, image_url = ${image_url} WHERE user_id = ${req.params.id}`;

        sql.query(sqlQuery, (error, rows) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            } else {
                res.status(200).send(rows);
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
                    res.status(500).send('Internal server error');
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
    }
};

module.exports = userCtrl;