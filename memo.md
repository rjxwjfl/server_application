CREATE TABLE user_mst (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  user_pw TEXT,
  device_token VARCHAR(255) NOT NULL,
  fb_uid CHAR(32) NOT NULL
  <!--   
  sub_state BOOLEAN NOT NULL DEFAULT FALSE,
  sub_deadline TIMESTAMP 
  -->
);

CREATE TABLE user_dtl (
  user_dtl_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  latest_access TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(50),
  introduce VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL
);

CREATE TABLE user_prj (
  user_prj_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  prj_id INT NOT NULL
);

CREATE TABLE user_task (
  user_task_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  task_id INT NOT NULL
);

CREATE TABLE payment_info (
  pmt_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date TIMESTAMP NOT NULL
);

CREATE TABLE project_mst (
  prj_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(25) NOT NULL,
  category INT NOT NULL,
  mst_id INT NOT NULL,
  prj_desc VARCHAR(255) NOT NULL,
  goal VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  start_on TIMESTAMP,
  expire_on TIMESTAMP,
  pvt BOOLEAN NOT NULL DEFAULT 0,
  prj_pw TEXT
);

CREATE TABLE project_rules (
  rule_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  rule VARCHAR(50)
);

CREATE TABLE project_mbr (
  prj_mbr_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  user_id INT NOT NULL,
  role INT NOT NULL DEFAULT 3
);

CREATE TABLE project_group_mst(
  grp_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  grp_name VARCHAR(50) NOT NULL
);

CREATE TABLE project_group_dtl(
  grp_dtl_id INT AUTO_INCREMENT PRIMARY KEY,
  grp_id INT NOT NULL,
  user_id INT NOT NULL
);

CREATE TABLE project_ms (
  prj_ms_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  task_id INT,
  ms_title VARCHAR(50),
  ms_content VARCHAR(255),
  ms_state INT NOT NULL DEFAULT 0
  -- milestone complete date => task complete_at
);

CREATE TABLE task_mst (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  pub_id INT NOT NULL,
  task_mgr_id INT,
  task_sub TEXT,
  lbl_clr VARCHAR(6),
  priority INT NOT NULL DEFAULT 0
  -- low = 0, urgency = 3 
);

CREATE TABLE task_dtl (
  task_dtl_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  task_att_id INT,
  task_dtl_desc TEXT,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  task_pe TINYINT NOT NULL DEFAULT 0,
  task_period TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  task_freq INT
);

CREATE TABLE task_assigned (
  task_asgd_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  task_asgd_att_id INT,
  task_pnt TEXT,
  task_cmt TEXT,
  task_state INT NOT NULL DEFAULT 0,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  cmpl_date TIMESTAMP
);

CREATE TABLE feed (
  feed_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  title VARCHAR(50) NOT NULL,
  author_id INT NOT NULL,
  feed_cnt VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE feed_cmt (
  feed_cmt_id INT AUTO_INCREMENT PRIMARY KEY,
  feed_id INT NOT NULL,
  author_id INT NOT NULL,
  feed_cmt_cnt VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE feed_cmt_reply(
  feed_reply_id	INT AUTO_INCREMENT PRIMARY KEY,
  feed_id INT NOT NULL,
  feed_cmt_id INT NOT NULL,
  author_id INT NOT NULL,
  feed_reply_cnt VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE task_att(
  task_att_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  att_url TEXT NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE task_assigned_att(
  task_asgd_att_id INT AUTO_INCREMENT PRIMARY KEY,
  prj_id INT NOT NULL,
  task_id INT NOT NULL,
  task_asgd_id INT NOT NULL,
  user_id INT NOT NULL,
  att_url TEXT NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


SELECT
	tm.*, td.*
FROM task_mst tm
LEFT JOIN task_dtl td ON tm.task_id = td.task_id
WHERE tm.prj_id = 4;
-- Load task data that matches the project.

SELECT
  *
FROM task_mst tm
RIGHT JOIN task_user tu ON tm.task_id = tu.task_id
WHERE tu.user_id = 8;

SELECT
tm.task_id,
tm.prj_id,
tm.pub_id,
pud.name AS pub_name,
pud.image_url AS pub_image,
tm.task_mgr_id,
mud.name AS mgr_name,
mud.image_url AS mgr_image,
td.task_att_id,
tm.task_sub,
td.task_dtl_desc,
tm.lbl_clr,
tm.priority,
td.create_at,
td.update_at,
td.task_pe,
td.task_period,
td.start_date,
td.end_date,
td.task_freq,
COUNT(DISTINCT tu.user_id) AS assigned_users_count
FROM task_mst AS tm
LEFT JOIN user_dtl pud ON tm.pub_id = pud.user_id
LEFT JOIN user_dtl mud ON tm.task_mgr_id = mud.user_id
LEFT JOIN task_dtl td ON tm.task_id = td.task_id
LEFT JOIN task_user tu ON tm.task_id = tu.task_id
LEFT JOIN user_dtl ud ON tu.user_id = ud.user_id
WHERE tm.prj_id = 4
GROUP BY
tm.task_id,
tm.prj_id,
tm.pub_id,
pud.name,
pud.image_url,
tm.task_mgr_id,
mud.name,
mud.image_url,
td.task_att_id,
td.task_dtl_desc,
tm.lbl_clr,
tm.priority,
td.create_at,
td.update_at,
td.task_pe,
td.task_period,
td.start_date,
td.end_date,
td.task_freq;
-- task view compact a contain user count


SELECT
tm.task_id,
tm.prj_id,
tm.pub_id,
pud.name AS pub_name,
pud.image_url AS pub_image,
tm.task_mgr_id,
mud.name AS mgr_name,
mud.image_url AS mgr_image,
td.task_att_id,
tm.task_sub,
td.task_dtl_desc,
tm.lbl_clr,
tm.priority,
td.create_at,
td.update_at,
td.task_pe,
td.task_period,
td.start_date,
td.end_date,
td.task_freq,
ud.name,
ud.image_url
FROM task_mst AS tm
LEFT JOIN user_dtl pud ON tm.pub_id = pud.user_id
LEFT JOIN user_dtl mud ON tm.task_mgr_id = mud.user_id
LEFT JOIN task_dtl td ON tm.task_id = td.task_id
LEFT JOIN task_user tu ON tm.task_id = tu.task_id
LEFT JOIN user_dtl ud ON tu.user_id = ud.user_id
WHERE tm.prj_id = 4 AND tm.task_id=8;
-- task view details for user circle avatar list