DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(10, 2) NULL,
    department_id INT NULL,
    PRIMARY KEY(id),
    index (department_id),
    FOREIGN KEY (department_id) REFERENCES department (id)

);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id),
    index (role_id),
    index (manager_id),
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);


INSERT INTO department (name)
VALUES ("Engineering"), ("Legal"), ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUE ("CFP", 10, (SELECT id FROM department WHERE name="Legal"));

INSERT INTO role (title, salary, department_id)
VALUE ("Legal", 20, (SELECT id FROM department WHERE name="Legal"));

INSERT INTO role (title, salary, department_id)
VALUE ("Senior Engineer", 40, (SELECT id FROM department WHERE name="Engineering"));

INSERT INTO role (title, salary, department_id)
VALUE ("Engineer", 10, (SELECT id FROM department WHERE name="Engineering"));

INSERT INTO role (title, salary, department_id)
VALUE ("Coder", 20, (SELECT id FROM department WHERE name="Marketing"));

INSERT INTO role (title, salary, department_id)
VALUE ("SEO Intern", 30, (SELECT id FROM department WHERE name="Marketing"));

SELECT * FROM role;

