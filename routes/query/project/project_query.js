const { app, connection } = require("../../../app");


app.post('/project/create', async (req, res) => {
  const data = req.body;
  const { title, category, description, goal, start_on, expire_on, rules, members } = data;
  const master_id = req.user.user_id;

  connection.beginTransaction((err) => {
    if (err) { 
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }
  
    const projectMstQuery = "INSERT INTO project_mst (title, category, master_id, description, goal, start_on, expire_on) VALUES (?, ?, ?, ?, ?, ?, ?)";
    connection.query(projectMstQuery, [title, category, master_id, description, goal, start_on, expire_on], (err, result) => {
      if (err) {
        console.log(err);
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }
  
      const project_id = result.insertId;
  
      if (rules && rules.length > 0) {
        const ruleValues = rules.map(rule => [project_id, rule]);
        const projectRulesQuery = "INSERT INTO project_rules (project_id, rule) VALUES ?";
        connection.query(projectRulesQuery, [ruleValues], (error, result) => {
          if (error) {
            console.log(error);
            connection.rollback(() => {
              res.status(500).send('Internal Server Error');
            });
            return;
          }
        });
      }
  
      if (members && members.length > 0) {
        const memberValues = members.map(member => [project_id, member.user_id, member.role]);
        const projectMembersQuery = "INSERT INTO project_members (project_id, user_id, role) VALUES ?";
        connection.query(projectMembersQuery, [memberValues], (error, result) => {
          if (error) {
            console.log(error);
            connection.rollback(() => {
              res.status(500).send('Internal Server Error');
            });
            return;
          }
        });
      }
  
      connection.commit((err) => {
        if (err) {
          console.log(err);
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }
        res.send("SUCCESS");
      });
    });
  });
});

app.put('/project/:id', async (req, res) => {
  const projectId = req.params.id;
  const data = req.body;

  const { title, category, description, goal, start_on, expire_on } = data;

  const query = `
      UPDATE project_mst
      SET title=?, category=?, description=?, goal=?, start_on=?, expire_on=?
      WHERE project_id=?
    `;

  connection.query(query, [title, category, description, goal, start_on, expire_on, projectId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result);
    }
  });
});


app.put('/project/:id/empowerment', async (req, res) => {
  const projectId = req.params.id;
  const { oldMasterId, newMasterId } = req.body;

  const query = `
      UPDATE project_members pm
      JOIN project_mst pmst ON pmst.project_id = pm.project_id
      SET pm.role = CASE
          WHEN pm.user_id = ? THEN 'member'
          WHEN pm.user_id = ? THEN 'master'
          ELSE pm.role
        END
      WHERE pm.project_id = ?
    `;

  connection.query(query, [oldMasterId, newMasterId, projectId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result);
    }
  });
});


app.delete('/project/:id', async (req, res) => {
  const projectId = req.params.id;
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
      WHERE project_mst.project_id = ?;
    `;
  connection.query(query, [projectId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result);
    }
  });
});

app.get('/projects/search', async (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  const offset = (page - 1) * limit; 
  const searchKeyword = req.query.searchKeyword || '';
  const filter = req.query.category || ''; 


  try {
    const projects = await getProjects(searchKeyword, filter, limit, offset);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


async function getProjects(searchKeyword, filter, limit, offset) {
  let projectsQuery = "SELECT * FROM projects";
  let queryValues = [];

  if (searchKeyword) {
    projectsQuery += " WHERE title LIKE ?";
    queryValues.push(`%${searchKeyword}%`);
  }

  if (filter) {
    projectsQuery += " AND category=?";
    queryValues.push(filter.category);
  }

  projectsQuery += ` LIMIT ${limit} OFFSET ${offset}`;

  return new Promise((resolve, reject) => {
    connection.query(projectsQuery, queryValues, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
}



