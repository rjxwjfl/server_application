-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: appdatabase
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `feed`
--

DROP TABLE IF EXISTS `feed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feed` (
  `feed_id` int NOT NULL AUTO_INCREMENT,
  `prj_id` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `author_id` int NOT NULL,
  `feed_cnt` varchar(255) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`feed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed`
--

LOCK TABLES `feed` WRITE;
/*!40000 ALTER TABLE `feed` DISABLE KEYS */;
/*!40000 ALTER TABLE `feed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feed_cmt`
--

DROP TABLE IF EXISTS `feed_cmt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feed_cmt` (
  `feed_cmt_id` int NOT NULL AUTO_INCREMENT,
  `feed_id` int NOT NULL,
  `author_id` int NOT NULL,
  `feed_cmt_cnt` varchar(255) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`feed_cmt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed_cmt`
--

LOCK TABLES `feed_cmt` WRITE;
/*!40000 ALTER TABLE `feed_cmt` DISABLE KEYS */;
/*!40000 ALTER TABLE `feed_cmt` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `feed_cmt_BEFORE_DELETE` BEFORE DELETE ON `feed_cmt` FOR EACH ROW BEGIN

	DELETE FROM feed_cmt_reply fcr WHERE fcr.feed_cmt_id = OLD.feed_cmt_id;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `feed_cmt_reply`
--

DROP TABLE IF EXISTS `feed_cmt_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feed_cmt_reply` (
  `feed_reply_id` int NOT NULL AUTO_INCREMENT,
  `feed_id` int NOT NULL,
  `feed_cmt_id` int NOT NULL,
  `author_id` int NOT NULL,
  `feed_reply_cnt` varchar(255) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`feed_reply_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feed_cmt_reply`
--

LOCK TABLES `feed_cmt_reply` WRITE;
/*!40000 ALTER TABLE `feed_cmt_reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `feed_cmt_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_info`
--

DROP TABLE IF EXISTS `payment_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_info` (
  `pmt_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `date` timestamp NOT NULL,
  PRIMARY KEY (`pmt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_info`
--

LOCK TABLES `payment_info` WRITE;
/*!40000 ALTER TABLE `payment_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_mbr`
--

DROP TABLE IF EXISTS `project_mbr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_mbr` (
  `prj_mbr_id` int NOT NULL AUTO_INCREMENT,
  `prj_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` int NOT NULL DEFAULT '3',
  PRIMARY KEY (`prj_mbr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_mbr`
--

LOCK TABLES `project_mbr` WRITE;
/*!40000 ALTER TABLE `project_mbr` DISABLE KEYS */;
INSERT INTO `project_mbr` VALUES (1,1,6,0),(2,2,6,0),(3,3,6,0),(4,4,6,0),(5,5,6,0),(6,6,6,0),(7,7,6,0),(8,8,6,0),(9,9,6,0),(10,10,6,0),(11,11,8,0),(12,12,8,0),(13,13,8,0),(14,14,8,0),(15,15,8,0),(16,16,8,0),(17,17,8,0),(18,18,8,0),(19,19,8,0),(20,20,8,0),(21,21,8,0),(22,22,8,0),(23,23,8,0),(24,24,8,0),(25,25,8,0),(26,26,8,0),(27,27,8,0),(28,28,8,0),(29,29,8,0),(30,30,8,0),(31,31,8,0),(32,32,8,0),(33,33,8,0);
/*!40000 ALTER TABLE `project_mbr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_ms`
--

DROP TABLE IF EXISTS `project_ms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_ms` (
  `prj_ms_id` int NOT NULL AUTO_INCREMENT,
  `prj_id` int NOT NULL,
  `task_id` int DEFAULT NULL,
  `ms_title` varchar(50) DEFAULT NULL,
  `ms_content` varchar(255) DEFAULT NULL,
  `ms_state` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`prj_ms_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_ms`
--

LOCK TABLES `project_ms` WRITE;
/*!40000 ALTER TABLE `project_ms` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_ms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_mst`
--

DROP TABLE IF EXISTS `project_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_mst` (
  `prj_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(25) NOT NULL,
  `category` int NOT NULL,
  `mst_id` int NOT NULL,
  `prj_desc` varchar(255) NOT NULL,
  `goal` varchar(255) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_on` timestamp NULL DEFAULT NULL,
  `expire_on` timestamp NULL DEFAULT NULL,
  `pvt` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`prj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_mst`
--

LOCK TABLES `project_mst` WRITE;
/*!40000 ALTER TABLE `project_mst` DISABLE KEYS */;
INSERT INTO `project_mst` VALUES (1,'Test Title 1',1,6,'Test project description 1','Build complete One','2023-04-11 15:06:03',NULL,NULL,0),(2,'Test Title 2',2,6,'Test project description 2','Build complete Two','2023-04-11 15:06:17',NULL,NULL,0),(3,'Test Title 3',3,6,'Test project description 3','Build complete Three','2023-04-11 15:06:36',NULL,NULL,0),(4,'Test Title 4',5,6,'Test project description 4','Build complete Four','2023-04-11 15:06:59','2023-04-13 03:48:00','2023-04-13 21:48:00',0),(5,'Test Title 5',2,6,'Test project description 5','Build complete Five','2023-04-11 16:39:10',NULL,NULL,0),(6,'Test Title 6',3,6,'Test project description 6','Build complete Six','2023-04-11 16:39:35',NULL,NULL,0),(7,'Test Title 7',3,6,'Test project description 7','Build complete Seven','2023-04-11 16:39:51',NULL,NULL,0),(8,'Test Title 8',1,6,'Test project description 8','Build complete Eight','2023-04-11 16:40:12',NULL,NULL,0),(9,'Test Title 9',4,6,'Test project description 9','Build complete Nine','2023-04-11 16:40:33',NULL,NULL,0),(10,'Test Title 10',1,6,'Test project description 10','Build complete Ten','2023-04-11 16:40:51',NULL,NULL,0),(11,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:10:48',NULL,NULL,0),(12,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:12:19',NULL,NULL,0),(13,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:12:30',NULL,NULL,0),(14,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:13:16',NULL,NULL,0),(15,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:14:05',NULL,NULL,0),(16,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:17:18',NULL,NULL,0),(17,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:18:03',NULL,NULL,0),(18,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:19:07',NULL,NULL,0),(19,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:20:38',NULL,NULL,0),(20,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:21:04',NULL,NULL,0),(21,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:21:56',NULL,NULL,0),(22,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:22:39',NULL,NULL,0),(23,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:24:02',NULL,NULL,0),(24,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:25:50',NULL,NULL,0),(25,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:26:09',NULL,NULL,0),(26,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:26:50',NULL,NULL,0),(27,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:27:07',NULL,NULL,0),(28,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:27:49',NULL,NULL,0),(29,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:29:52',NULL,NULL,0),(30,'asdTEst',4,8,'asdasd','asd','2023-04-19 18:30:27',NULL,NULL,0),(31,'asdasd',2,8,'asdasdasd','asdasdasd','2023-04-19 18:31:26',NULL,NULL,0),(32,'qweqweqw',4,8,'sdasdfasdfsdf','asdasd','2023-04-19 18:31:55','2023-04-19 00:00:00','2023-04-20 00:00:00',0),(33,'asdasdasdasd',5,8,'asdasdasdasd','asdasdasdasd','2023-04-20 06:17:06','2023-04-20 00:00:00','2023-04-21 00:00:00',0);
/*!40000 ALTER TABLE `project_mst` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `project_mst_BEFORE_DELETE` BEFORE DELETE ON `project_mst` FOR EACH ROW BEGIN

	DELETE FROM user_prj up WHERE up.prj_id = OLD.prj_id;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `project_rules`
--

DROP TABLE IF EXISTS `project_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_rules` (
  `rule_id` int NOT NULL AUTO_INCREMENT,
  `prj_id` int NOT NULL,
  `rule` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_rules`
--

LOCK TABLES `project_rules` WRITE;
/*!40000 ALTER TABLE `project_rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_assigned`
--

DROP TABLE IF EXISTS `task_assigned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_assigned` (
  `task_asgd_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `user_id` int NOT NULL,
  `task_asgd_att_id` int DEFAULT NULL,
  `task_pnt` text,
  `task_cmt` text,
  `task_state` int NOT NULL DEFAULT '0',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `cmpl_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`task_asgd_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_assigned`
--

LOCK TABLES `task_assigned` WRITE;
/*!40000 ALTER TABLE `task_assigned` DISABLE KEYS */;
INSERT INTO `task_assigned` VALUES (1,8,7,NULL,'A파트 검사 필',NULL,0,'2023-04-27 07:42:35','2023-04-27 07:42:35','2023-04-27 02:30:00','2023-04-27 08:30:00',NULL),(2,8,8,NULL,'B파트 재고파악',NULL,0,'2023-04-27 07:42:35','2023-04-27 07:42:35','2023-04-27 02:30:00','2023-04-27 06:30:00',NULL),(4,9,7,NULL,'A파트 검사 필',NULL,0,'2023-04-27 07:44:39','2023-04-27 07:44:39','2023-04-27 02:30:00','2023-04-27 08:30:00',NULL),(5,9,8,NULL,'B파트 재고파악',NULL,0,'2023-04-27 07:44:39','2023-04-27 07:44:39','2023-04-27 02:30:00','2023-04-27 06:30:00',NULL),(7,10,7,NULL,'A파트 검사 필',NULL,0,'2023-04-27 08:25:52','2023-04-27 08:25:52','2023-04-27 02:30:00','2023-04-27 08:30:00',NULL),(8,10,8,NULL,'B파트 재고파악',NULL,0,'2023-04-27 08:25:52','2023-04-27 08:25:52','2023-04-27 02:30:00','2023-04-27 06:30:00',NULL),(9,8,13,NULL,'C파트 검사',NULL,0,'2023-04-28 02:29:03','2023-04-28 02:29:03','2023-04-27 02:30:00','2023-04-27 06:30:00',NULL);
/*!40000 ALTER TABLE `task_assigned` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `task_assigned_AFTER_UPDATE` AFTER UPDATE ON `task_assigned` FOR EACH ROW BEGIN
    IF NEW.task_state = 1 AND NEW.cmpl_date IS NULL THEN
        UPDATE `task_assigned` SET cmpl_date = CURRENT_TIMESTAMP WHERE task_asgd_id = NEW.task_asgd_id;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `task_dtl`
--

DROP TABLE IF EXISTS `task_dtl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_dtl` (
  `task_dtl_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `task_att_id` int DEFAULT NULL,
  `task_dtl_desc` text,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `task_pe` tinyint NOT NULL DEFAULT '0',
  `task_period` text,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `task_freq` int DEFAULT NULL,
  PRIMARY KEY (`task_dtl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_dtl`
--

LOCK TABLES `task_dtl` WRITE;
/*!40000 ALTER TABLE `task_dtl` DISABLE KEYS */;
INSERT INTO `task_dtl` VALUES (7,8,NULL,'내용 확인하고 업무 시작할 것','2023-04-27 07:42:35','2023-04-27 07:42:35',0,NULL,NULL,NULL,NULL),(8,9,NULL,'내용 확인하고 업무 시작할 것','2023-04-27 07:44:39','2023-04-27 07:44:39',0,NULL,NULL,NULL,NULL),(9,10,NULL,'내용 확인하고 업무 시작할 것','2023-04-27 08:25:52','2023-04-27 08:25:52',0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `task_dtl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_mst`
--

DROP TABLE IF EXISTS `task_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_mst` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `prj_id` int NOT NULL,
  `pub_id` int NOT NULL,
  `task_mgr_id` int DEFAULT NULL,
  `task_sub` text,
  `lbl_clr` varchar(6) DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_mst`
--

LOCK TABLES `task_mst` WRITE;
/*!40000 ALTER TABLE `task_mst` DISABLE KEYS */;
INSERT INTO `task_mst` VALUES (8,4,8,NULL,'5월 매출 전망','FFFFFF',3),(9,4,8,NULL,'5월 매출 전망','FFFFFF',3),(10,4,8,NULL,'5월 매출 전망','FFFFFF',3);
/*!40000 ALTER TABLE `task_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_dtl`
--

DROP TABLE IF EXISTS `user_dtl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_dtl` (
  `user_dtl_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `latest_access` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(100) NOT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `introduce` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_dtl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_dtl`
--

LOCK TABLES `user_dtl` WRITE;
/*!40000 ALTER TABLE `user_dtl` DISABLE KEYS */;
INSERT INTO `user_dtl` VALUES (6,6,'2023-04-11 14:15:13','2023-04-11 14:15:13','2023-04-11 14:15:13','Test@test.com',NULL,NULL,NULL),(8,8,'2023-04-13 13:03:33','2023-04-13 13:03:33','2023-04-13 13:03:33','rjxwjfl@gmail.com',NULL,NULL,NULL),(13,13,'2023-04-14 04:48:40','2023-04-14 04:48:40','2023-04-14 04:48:40','dowithdevelop@gmail.com',NULL,NULL,NULL);
/*!40000 ALTER TABLE `user_dtl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_mst`
--

DROP TABLE IF EXISTS `user_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_mst` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `user_pw` text,
  `device_token` varchar(255) NOT NULL,
  `fb_uid` char(32) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_mst`
--

LOCK TABLES `user_mst` WRITE;
/*!40000 ALTER TABLE `user_mst` DISABLE KEYS */;
INSERT INTO `user_mst` VALUES (6,'Test@test.com','$2b$10$u8VyGLIINnv0bJAbxIATwOhtina8e3gSdILF3FM7tzfGy6j3/tYVq','c21Cdyv4RXir1Iw9twCrOn:APA91bFgBk0LOWXuoOyfo-gJVe-b2n_PgThDFxww3kH7QvGDq-yts_rv1S41-xcJAZC3DYIhz1kuUSoMduo0i4myCnloES6RKQoxmlkZO88rlON6iq2Nozwy1rye4NBBZi12XYty3qOb','TEST UID'),(8,'rjxwjfl@gmail.com',NULL,'eQJ8eW-iTnudLRsdwnfD1J:APA91bGQG8Xs9w9VPeV2ZJCsNPc4tVa4G_lteGi1qQbociZzaRiKNCXJfX4r6OwJGSEuZBUDmKf_eQK2e36rnxzD-3WTfnmbJaeWOSUssssPCamseYVc2tdC8_rrr_MF326CnNRSelJo','k2yOZegMspcRR5P7oJMOqd1n0j12'),(13,'dowithdevelop@gmail.com',NULL,'diXrE7wZQN-RaZz6Co5kMM:APA91bFMCV5rPJJ6W2lJ7uHn6Ej5o9j3lSSHp3JibJbQVWBuPP0zWf3mQMO2Ga8I_Q31_ne0K5Y6voHzsaMfpTPPj_TfTFohurhlx8Kepn1xit2uBpKuCuvAkY2vA4MmucohJQUSVebP','wKWYibvFPeNqvKKzfhz2WDZxwP92');
/*!40000 ALTER TABLE `user_mst` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `user_mst_BEFORE_DELETE` BEFORE DELETE ON `user_mst` FOR EACH ROW BEGIN
	DELETE FROM user_dtl ud WHERE ud.user_id = OLD.user_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `user_prj`
--

DROP TABLE IF EXISTS `user_prj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_prj` (
  `user_prj_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `prj_id` int NOT NULL,
  PRIMARY KEY (`user_prj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_prj`
--

LOCK TABLES `user_prj` WRITE;
/*!40000 ALTER TABLE `user_prj` DISABLE KEYS */;
INSERT INTO `user_prj` VALUES (1,8,11),(2,8,12),(3,8,13),(4,8,14),(5,8,15),(6,8,16),(7,8,17),(8,8,18),(9,8,19),(10,8,20),(11,8,21),(12,8,22),(13,8,23),(14,8,24),(15,8,25),(16,8,26),(17,8,27),(18,8,28),(19,8,29),(20,8,30),(21,8,31),(22,8,32),(23,8,33);
/*!40000 ALTER TABLE `user_prj` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_task`
--

DROP TABLE IF EXISTS `user_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_task` (
  `user_task_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `task_id` int NOT NULL,
  PRIMARY KEY (`user_task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_task`
--

LOCK TABLES `user_task` WRITE;
/*!40000 ALTER TABLE `user_task` DISABLE KEYS */;
INSERT INTO `user_task` VALUES (1,7,10),(2,8,10);
/*!40000 ALTER TABLE `user_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'appdatabase'
--

--
-- Dumping routines for database 'appdatabase'
--
/*!50003 DROP PROCEDURE IF EXISTS `assignTask` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `assignTask`(
  IN p_prj_id INT,
  IN p_task_id INT,
  IN p_task_users JSON
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred. Changes have been rolled back.' AS message;
  END;
  
  START TRANSACTION;
 
  SET @task_users_json = p_task_users;
  
  INSERT INTO task_user (task_id, user_id, task_user_att_id, task_pnt, task_cmt, task_state, start_date, end_date)
  SELECT task_id, user_id, task_user_att_id, task_pnt, task_cmt, task_state, start_date, end_date
  FROM JSON_TABLE(@task_users_json, '$[*]'
    COLUMNS(
      user_id INT PATH '$.user_id',
      task_user_att_id INT PATH '$.task_user_att_id',
      task_pnt TEXT PATH '$.task_pnt',
      task_cmt TEXT PATH '$.task_cmt',
      task_state INT PATH '$.task_state',
      start_date TIMESTAMP PATH '$.start_date',
      end_date TIMESTAMP PATH '$.end_date'
    )
  ) AS task_users;
  
    INSERT INTO user_task (user_id, task_id)
  SELECT user_id, task_id
  FROM JSON_TABLE(@task_users_json, '$[*]'
	COLUMNS(
      user_id INT PATH '$.user_id'
    )
  ) AS task_users;
  
  COMMIT;

  SELECT task_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `createPrj` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `createPrj`(IN title VARCHAR(255), IN category VARCHAR(255), IN uid INT, IN prj_desc VARCHAR(255), IN goal VARCHAR(255), IN start_on DATE, IN expire_on DATE, IN pvt TINYINT)
BEGIN
  DECLARE prj_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 0;
  END;
  
  START TRANSACTION;
  
  INSERT INTO project_mst (title, category, mst_id, prj_desc, goal, start_on, expire_on, pvt) 
  VALUES (title, category, uid, prj_desc, goal, start_on, expire_on, pvt);
  
  SET prj_id = LAST_INSERT_ID();
  
  INSERT INTO project_mbr (prj_id, user_id, role) 
  VALUES (prj_id, uid, 0);
  
  INSERT INTO user_prj (user_id, prj_id) 
  VALUES (uid, prj_id);
  
  COMMIT;
  
  SELECT prj_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `createTask` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `createTask`(
  IN p_pub_id INT,
  IN p_task_mgr_id INT,
  IN p_task_sub TEXT,
  IN p_lbl_clr VARCHAR(6),
  IN p_priority INT,
  IN p_task_att_id INT,
  IN p_task_dtl_desc TEXT,
  IN p_task_pe TINYINT,
  IN p_task_period TEXT,
  IN p_start_date TIMESTAMP,
  IN p_end_date TIMESTAMP,
  IN p_task_freq INT,
  IN p_task_users JSON,
  IN p_prj_id INT
)
BEGIN
  DECLARE task_id INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred. Changes have been rolled back.' AS message;
  END;
  
  START TRANSACTION;
  
  INSERT INTO task_mst (prj_id, pub_id, task_mgr_id, task_sub, lbl_clr, priority)
  VALUES (p_prj_id, p_pub_id, p_task_mgr_id, p_task_sub, p_lbl_clr, p_priority);

  SET task_id = LAST_INSERT_ID();

  INSERT INTO task_dtl (task_id, task_att_id, task_dtl_desc, task_pe, task_period, start_date, end_date, task_freq)
  VALUES (task_id, p_task_att_id, p_task_dtl_desc, p_task_pe, p_task_period, p_start_date, p_end_date, p_task_freq);

  SET @task_users_json = p_task_users;
  
  INSERT INTO task_assigned (task_id, user_id, task_asgd_att_id, task_pnt, task_cmt, task_state, start_date, end_date)
  SELECT task_id, user_id, task_asgd_att_id, task_pnt, task_cmt, task_state, start_date, end_date
  FROM JSON_TABLE(@task_users_json, '$[*]'
    COLUMNS(
      user_id INT PATH '$.user_id',
      task_asgd_att_id INT PATH '$.task_user_att_id',
      task_pnt TEXT PATH '$.task_pnt',
      task_cmt TEXT PATH '$.task_cmt',
      task_state INT PATH '$.task_state',
      start_date TIMESTAMP PATH '$.start_date',
      end_date TIMESTAMP PATH '$.end_date'
    )
  ) AS task_users;
  
  INSERT INTO user_task (user_id, task_id)
  SELECT user_id, task_id
  FROM JSON_TABLE(@task_users_json, '$[*]'
	COLUMNS(
      user_id INT PATH '$.user_id'
    )
  ) AS task_users;
  
  COMMIT;

  SELECT task_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getMyPrj` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `getMyPrj`(IN userId INT)
BEGIN
  SELECT 
    p.prj_id, 
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
  FROM user_prj up
  LEFT JOIN project_mst p ON up.prj_id = p.prj_id
  LEFT JOIN project_mbr pm ON p.prj_id = pm.prj_id 
  LEFT JOIN user_dtl u ON p.mst_id = u.user_id
  WHERE up.user_id = userId
  GROUP BY p.prj_id, p.title, p.category, p.prj_desc, p.goal, p.start_on, p.expire_on, p.pvt, u.name, u.introduce, u.image_url;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `prjRemove` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `prjRemove`(IN prjId INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error' AS message;
    END;
    
    START TRANSACTION;
    
    DELETE FROM feed_cmt_reply WHERE feed_cmt_id IN (
        SELECT feed_cmt_id FROM feed_cmt WHERE feed_id IN (
            SELECT feed_id FROM feed WHERE prj_id = prjId
        )
    );
    
    DELETE FROM feed_cmt WHERE feed_id IN (
        SELECT feed_id FROM feed WHERE prj_id = prjId
    );
    
    DELETE FROM user_prj WHERE prj_id = prjId;
    
    DELETE FROM user_task WHERE task_id IN (
        SELECT task_id FROM task WHERE prj_id = prjId
    );
    
    DELETE FROM task_dtl WHERE task_id IN (
        SELECT task_id FROM task WHERE prj_id = prjId
    );
    
    DELETE FROM project_ms WHERE prj_id = prjId;
    
    DELETE FROM task WHERE prj_id = prjId;
    
    DELETE FROM project_rules WHERE prj_id = prjId;
    
    DELETE FROM project_mbr WHERE prj_id = prjId;
    
    DELETE FROM project_mst WHERE prj_id = prjId;
    
    COMMIT;
    SELECT CONCAT('Remove Success.') AS message;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `purgeUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `purgeUser`(
  IN p_user_id INT,
  IN p_prj_id INT
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred. Changes have been rolled back.' AS message;
  END;

  START TRANSACTION;

  DELETE FROM feed_cmt WHERE author_id = p_user_id AND feed_id IN (SELECT feed_id FROM feed WHERE prj_id = p_prj_id);
  DELETE FROM feed WHERE author_id = p_user_id AND prj_id = p_prj_id;
  DELETE FROM user_task WHERE user_id = p_user_id AND task_id IN (SELECT task_id FROM task WHERE prj_id = p_prj_id);
  DELETE FROM task_dtl WHERE pic_id = p_user_id AND task_id IN (SELECT task_id FROM task WHERE prj_id = p_prj_id);
  DELETE FROM user_prj WHERE user_id = p_user_id AND prj_id = p_prj_id;
  DELETE FROM project_mbr WHERE user_id = p_user_id AND prj_id = p_prj_id;
  
  COMMIT;

  SELECT CONCAT('Purging Success.') AS message;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `regUserData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `regUserData`(
  IN p_username VARCHAR(50),
  IN p_user_pw TEXT,
  IN p_name VARCHAR(100),
  IN p_contact VARCHAR(50),
  IN p_device_token VARCHAR(255),
  IN p_fb_uid CHAR(32)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'Error occurred. Changes have been rolled back.' AS message;
  END;

  START TRANSACTION;

  IF p_user_pw IS NOT NULL THEN
    INSERT INTO user_mst (username, user_pw, device_token, fb_uid) 
    VALUES (p_username, p_user_pw, p_device_token, p_fb_uid);
  ELSE
    INSERT INTO user_mst (username, device_token, fb_uid) 
    VALUES (p_username, p_device_token, p_fb_uid);
  END IF;

  SET @last_user_id = LAST_INSERT_ID();

  INSERT INTO user_dtl (user_id, name, contact) 
  VALUES (@last_user_id, p_name, p_contact);

  COMMIT;

  SELECT CONCAT(@last_user_id) AS message;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-28 17:52:27
