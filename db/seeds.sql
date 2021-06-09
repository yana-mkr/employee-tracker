USE tracker_db;

INSERT INTO department (name)
VALUES ("HR"),
("IT"),
("Marketing"),
("Support");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 80000.00, 2),
("Intern", 36000.00, 4),
("Customer Support", 50000.00, 3),
("Director", 90000.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Smith", 1, NULL),
("Stan", "Smith", 2, NULL),
("Francine", "Smith", 3, NULL),
("Haley", "Smith", 4, NULL),
("Roger", "the Alien", 1, NULL);

-- Setting Roger to be under Steve
UPDATE employee SET manager_id = 1 WHERE id = 5; 
-- Setting Haley under Steve
UPDATE employee SET manager_id = 1 WHERE id = 4;
-- Setting Francine under Steve
UPDATE employee SET manager_id = 1 WHERE id = 3;
-- Setting Stan under Steve
UPDATE employee SET manager_id = 1 WHERE id = 2;
