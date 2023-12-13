CREATE DATABASE myForums;
USE myForums;
CREATE TABLE forums (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,description VARCHAR(50),rating DECIMAL(2,1),PRIMARY KEY(id));
INSERT INTO forums (name, price, description, rating)VALUES('Fortnite', 10.25, 'Fun shooter based game for 2 year olds',9.8),('Batman', 25.00, 'Become a superhero and save Gotham',9.6), ('Smite', 5.00,'Good game for people who are bored', 8.7) ;
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myForums.* TO 'appuser'@'localhost';
DROP USER 'appuser'@'localhost';
CREATE TABLE userlogin (username VARCHAR(50), firstname VARCHAR(50) NOT NULL, lastname VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, hashedPassword VARCHAR(255) NOT NULL, PRIMARY KEY (username));
SELECT * FROM userlogin;