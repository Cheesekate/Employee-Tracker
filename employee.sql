DROP DATABASE IF EXISTS employee_hwDB;
CREATE database employee_hwDB;

USE employee_hwDB;

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
VALUES ('Engineering'), ('Legal'), ('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES 
('Senior Engineer', 40, 1),
('Engineer', 10, 1),
('CFP', 10, 2),
('Legal Manager', 20, 2),
('Code Manager', 20, 3),
('SEO Intern', 30, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Kate', 'Wade', 1, NULL),
    ('Jake', 'Smith', 3, 2),
    ('Tracy', 'Smalls', 4, 2),
    ('Amanda', 'Jacobson', 5, 1),
    ('Taylor', 'Willson', 6, 3);


