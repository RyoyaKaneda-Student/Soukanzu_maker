set FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS component;
DROP TABLE IF EXISTS relation;
DROP TABLE IF EXISTS relationship;
set FOREIGN_KEY_CHECKS=1;

CREATE TABLE rooms
(
  room_id    INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_name  VARCHAR(40) NOT NULL    
);

CREATE TABLE components
(
  component_id      INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id           INT(10) NOT NULL,
  component_name    NVARCHAR(40) NOT NULL,
  FOREIGN KEY (`room_id`) REFERENCES rooms(`room_id`)
);

CREATE TABLE relations
(
  relation_id       INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id           INT(10) NOT NULL,
  relation_name     NVARCHAR(40) NOT NULL,
  relation_type     TINYINT UNSIGNED NOT NULL,
  FOREIGN KEY (`room_id`) REFERENCES rooms(`room_id`)
);

CREATE TABLE relations_detail
(
  relation_detail_id     INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  room_id             INT(10) NOT NULL,
  component_id_from   INT(10) NOT NULL,
  component_id_to     INT(10) NOT NULL,
  relation_id         INT(10) NOT NULL,
  relation_detail     NVARCHAR(400) NOT NULL,
  FOREIGN KEY (`room_id`) REFERENCES rooms(`room_id`),
  FOREIGN KEY (`component_id_from`) REFERENCES components(`component_id`),
  FOREIGN KEY (`component_id_to`) REFERENCES components(`component_id`),
  FOREIGN KEY (`relation_id`) REFERENCES relations(`relation_id`)
);

INSERT INTO rooms(room_id, room_name) VALUES (10000, "TEST_ROOM");
INSERT INTO components(room_id, component_name) VALUES (10000, "TEST_COMPONENT");
INSERT INTO components(room_id, component_name) VALUES (10000, "TEST_COMPONENT2");
INSERT INTO relations(room_id, relation_name, relation_type) VALUES (10000, "TEST_RELATHIN_NAME", 1);

INSERT INTO relations_detail(room_id, component_id_from, component_id_to, relation_id, relation_detail) VALUES (10000, 1, 2, 1, "this is test");
INSERT INTO relations_detail(room_id, component_id_from, component_id_to, relation_id, relation_detail) VALUES (10000, 1, 2, 1, N'これはテストです');

