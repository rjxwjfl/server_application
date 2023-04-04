CREATE TABLE user_mst (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password TEXT,
  name VARCHAR(100) NOT NULL,
  device_token VARCHAR(255) NOT NULL,
  fb_uid CHAR(32) NOT NULL
);

CREATE TABLE user_dtl (
  user_dtl_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  latest_access TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  introduce VARCHAR(255) DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  state BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_deadline TIMESTAMP
);

CREATE TABLE user_project (
  user_project_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NOT NULL
);

CREATE TABLE payment_info (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date TIMESTAMP NOT NULL
);

CREATE TABLE project_mst (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(25) NOT NULL,
  category INT NOT NULL,
  master_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  goal VARCHAR(255) NOT NULL,
  start_on TIMESTAMP NOT NULL,
  expire_on TIMESTAMP NOT NULL
);

CREATE TABLE project_rules (
  rule_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  rule VARCHAR(50)
);

CREATE TABLE project_members (
  pmember_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('master', 'manager', 'member', 'guest') NOT NULL DEFAULT 'member'
);

CREATE TABLE tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  author_id INT NOT NULL,
  title VARCHAR(25) NOT NULL,
  description VARCHAR(255),
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  start_on TIMESTAMP NOT NULL,
  deadline TIMESTAMP NOT NULL
);

CREATE TABLE tasks_members (
  tmembers_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  progress INT NOT NULL DEFAULT 0,
  evaluation INT NOT NULL DEFAULT 0
);

CREATE TABLE tasks_comment (
  tcomments_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  content VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE feed (
  feed_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(25) NOT NULL,
  content VARCHAR(255) NOT NULL,
  author_id INT NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE feed_comment (
  fcomments_id INT AUTO_INCREMENT PRIMARY KEY,
  feed_id INT NOT NULL,
  content VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);