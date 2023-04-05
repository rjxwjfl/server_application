CREATE TABLE user_mst (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password TEXT,
  device_token VARCHAR(255) NOT NULL,
  fb_uid CHAR(32) NOT NULL
);

CREATE TABLE user_dtl (
  user_dtl_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  latest_access TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(100) NOT NULL,
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


200 (OK): 서버가 요청을 성공적으로 처리하고, 요청에 대한 적절한 응답을 반환했음을 나타냅니다.
201 (Created): 새로운 리소스를 성공적으로 생성했음을 나타냅니다.
204 (No Content): 서버가 요청을 성공적으로 처리했지만, 응답에는 별도의 내용이 없음을 나타냅니다.
400 (Bad Request): 클라이언트 요청이 유효하지 않아 서버가 요청을 이해하지 못했음을 나타냅니다.
401 (Unauthorized): 클라이언트가 인증되지 않았으므로, 요청한 리소스에 액세스할 수 없음을 나타냅니다.
403 (Forbidden): 클라이언트가 요청한 리소스에 액세스할 권한이 없음을 나타냅니다.
404 (Not Found): 요청한 리소스를 찾을 수 없음을 나타냅니다.
500 (Internal Server Error): 서버에서 요청을 처리하던 중에 에러가 발생했음을 나타냅니다.
502 (Bad Gateway): 서버가 게이트웨이나 프록시 역할을 하는 다른 서버로부터 잘못된 응답을 받았음을 나타냅니다.
503 (Service Unavailable): 서버가 요청을 처리할 준비가 되어 있지 않음을 나타냅니다.