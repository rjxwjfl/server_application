const connection = require("../configs/dbConfig");
const fcmCtrl = require("./fcmCtrl");

const projectCtrl = {
  // post
  createPrj: async (req, res) => {
    const mstId = req.query.uid;
    const { title, category, prj_desc, goal, start_on, expire_on, pvt, prj_pw } = req.body;

    connection.beginTransaction((error) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }

      const mstQuery = `
        INSERT INTO project_mst (title, category, mst_id, prj_desc, goal, start_on, expire_on, pvt, prj_pw)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const mstQueryValue = [title, category, mstId, prj_desc, goal, start_on, expire_on, pvt, prj_pw];

      connection.query(mstQuery, mstQueryValue, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }

        const prjId = result.insertId;
        const mbrQuery = `
          INSERT INTO project_mbr (prj_id, user_id, role) 
          VALUES (?, ?, 0)
        `;
        const mbrQueryValue = [prjId, mstId];

        connection.query(mbrQuery, mbrQueryValue, (error, result) => {
          if (error) {
            console.error(error);
            connection.rollback(() => {
              return res.sendStatus(500);
            });
          }

          const userPrjQuery = `
            INSERT INTO user_prj (user_id, prj_id)
            VALUES (?, ?)
          `;
          const userPrjQueryValue = [mstId, prjId];

          connection.query(userPrjQuery, userPrjQueryValue, (error, result) => {
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

              return res.status(200).send({ prj_id: prjId });
            });
          });
        });
      });
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
    const page = req.query.page || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const searchKeyword = req.query.searchKeyword;

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
      LIMIT ? OFFSET ?
    `;

    let queryValue = searchKeyword? [ `%${searchKeyword}%`, limit, offset ]:[ limit, offset];

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
      SELECT *
      FROM project_mst pm
      WHERE pm.prj_id = ?
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
      res.send(rows);
    });
  },

  getMembers: async (req, res) => {
    const prjId = req.query.pid;
    const query = `
      SELECT pm.role, ud.name, ud.introduce, ud.image_url, ud.latest_access, tm.progress, tm.evaluation
      FROM project_mbr pm
      LEFT JOIN user_dtl ud ON pm.user_id = ud.user_id
      LEFT JOIN task_dtl td ON pm.user_id = td.pic_id
      WHERE pm.prj_id=${prjId}
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

  purgeUser: (req, res) => {
    const prjId = req.query.pid;
    const userId = req.query.uid;

    connection.beginTransaction((error) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }
      const query = `
        DELETE
          td, tc, tcr
        FROM task t
        LEFT JOIN task_dtl td ON td.task_id = t.task_id
        LEFT JOIN task_cmt tc ON tc.task_id = t.task_id
        LEFT JOIN task_cmt_reply tcr ON tcr.task_cmt_id = tc.task_cmt_id
        WHERE t.prj_id = ${prjId} AND td.pic_id = ${userId};
      `;
      connection.query(query, (error, result) => {
          if (error) {
            console.error(error);
            return connection.rollback(() => {
              res.sendStatus(500);
            });
          }

          connection.query(
            "DELETE FROM task_cmt WHERE user_id = ?",
            [userId],
            (error, result) => {
              if (error) {
                console.error(error);
                return connection.rollback(() => {
                  res.sendStatus(500);
                });
              }

              connection.query(
                "DELETE FROM feed_cmt_reply WHERE cmt_id IN (SELECT id FROM feed_cmt WHERE user_id = ?)",
                [userId],
                (error, result) => {
                  if (error) {
                    console.error(error);
                    return connection.rollback(() => {
                      res.sendStatus(500);
                    });
                  }

                  connection.query(
                    "DELETE FROM feed_cmt WHERE user_id = ?",
                    [userId],
                    (error, result) => {
                      if (error) {
                        console.error(error);
                        return connection.rollback(() => {
                          res.sendStatus(500);
                        });
                      }

                      connection.query(
                        "DELETE FROM feed WHERE user_id = ?",
                        [userId],
                        (error, result) => {
                          if (error) {
                            console.error(error);
                            return connection.rollback(() => {
                              res.sendStatus(500);
                            });
                          }

                          connection.query(
                            "DELETE FROM task_dtl WHERE pic_id = ?",
                            [userId],
                            (error, result) => {
                              if (error) {
                                console.error(error);
                                return connection.rollback(() => {
                                  res.sendStatus(500);
                                });
                              }

                              connection.query(
                                "DELETE FROM user_task WHERE user_id = ?",
                                [userId],
                                (error, result) => {
                                  if (error) {
                                    console.error(error);
                                    return connection.rollback(() => {
                                      res.sendStatus(500);
                                    });
                                  }

                                  connection.query(
                                    "DELETE FROM user_prj WHERE user_id = ? AND prj_id = ?",
                                    [userId, prjId],
                                    (error, result) => {
                                      if (error) {
                                        console.error(error);
                                        return connection.rollback(() => {
                                          res.sendStatus(500);
                                        });
                                      }
                                      connection.query(
                                        "DELETE FROM project_mbr WHERE user_id = ? AND prj_id = ?",
                                        [userId, prjId],
                                        (error, result) => {
                                          if (error) {
                                            console.error(error);
                                            return connection.rollback(() => {
                                              res.sendStatus(500);
                                            });
                                          }

                                          connection.commit((error) => {
                                            if (error) {
                                              console.error(error);
                                              return connection.rollback(() => {
                                                res.sendStatus(500);
                                              });
                                            }

                                            return res.sendStatus(200);
                                          });
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  }, // 수정작업 필요

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
            const feedCmt = `DELETE FROM feed_cmt WHERE feed_id IN (
            SELECT feed_id FROM feed WHERE prj_id = ${prjId})`;

            connection.query(feedCmt, (error, result) => {
              if (error) {
                console.error(error);
                connection.rollback(() => {
                  return res.sendStatus(500);
                });
              }
              const userPrj = `DELETE FROM user_prj WHERE prj_id = ${prjId}`;

              connection.query(userPrj, (error, result) => {
                if (error) {
                  console.error(error);
                  connection.rollback(() => {
                    return res.sendStatus(500);
                  });
                }
                const userTask = `DELETE FROM user_task WHERE task_id IN (
                    SELECT task_id FROM task WHERE prj_id = ${prjId})`;
                connection.query(userTask, (error, result) => {
                  if (error) {
                    console.error(error);
                    connection.rollback(() => {
                      return res.sendStatus(500);
                    });
                  }
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
                    const mileStone = `DELETE FROM project_ms WHERE prj_id = ${prjId}`;
                    connection.query(mileStone, (error, result) => {
                      if (error) {
                        console.error(error);
                        connection.rollback(() => {
                          return res.sendStatus(500);
                        });
                      }
                      const taskDel = `DELETE FROM task WHERE prj_id = ${prjId}`;

                      connection.query(taskDel, (error, result) => {
                        if (error) {
                          console.error(error);
                          connection.rollback(() => {
                            return res.sendStatus(500);
                          });
                        }
                        const prjRule = `DELETE FROM project_rules WHERE prj_id = ${prjId}`;
                        connection.query(prjRule, (error, result) => {
                          if (error) {
                            console.error(error);
                            connection.rollback(() => {
                              return res.sendStatus(500);
                            });
                          }
                          const prjMember = `DELETE FROM project_mbr WHERE prj_id = ${prjId}`;
                          connection.query(prjMember, (error, reseult) => {
                            if (error) {
                              console.error(error);
                              connection.rollback(() => {
                                return res.sendStatus(500);
                              });
                            }
                            const prjDel = `DELETE FROM project_mst WHERE prj_id = ${prjId}`;
                            connection.query(prjDel, (error, result) => {
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
                                res.sendStatus(200);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }, // callback hell
};

module.exports = projectCtrl;
