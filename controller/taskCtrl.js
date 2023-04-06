const connection = require("../configs/dbConfig");

const taskCtrl = {
  createTask: async (req, res) => {
    const { title, description, start_on, deadline } = req.body;
    const project_id = req.query.pid;
    const author_id = req.query.uid;

    connection.beginTransaction((error) => {
      if (error) {
        console.error(error);
        return res.sendStatus(500);
      }

      const tasksQuery = `
              INSERT INTO tasks (project_id, author_id, title, description, start_on, deadline) 
              VALUES (${project_id}, ${author_id}, '${title}', '${description}', '${start_on}', '${deadline}')`;

      connection.query(tasksQuery, (error, result) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            return res.sendStatus(500);
          });
        }

        const task_id = result.insertId;

        const taskMemberQuery = `INSERT INTO tasks_members (task_id, user_id) VALUES (${task_id}, ${author_id})`;
        connection.query(taskMemberQuery, (error, result) => {
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

  addMembers: async (req, res) => {},

  getTasks: async (req, res) => {},

  getTaskCmt: async (req, res) => {},
};

module.exports = taskCtrl;
