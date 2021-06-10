const express = require('express');
const db = require('./db/connection');
require("console.table");
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
});

// I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
function appStart() {
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'allThings',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            }
        )
        .then(response => {
            const { allThings } = response;
            console.log(allThings);

            if (allThings === 'view all departments') {
                viewDepartments()
            } else if (allThings === 'view all roles') {
                viewRoles()
            } else if (allThings === 'view all employees') {
                viewEmployees()
            } else if (allThings === 'add a department') {
                addDepartment()
            } else if (allThings === 'add a role') {
                addRole()
            } else if (allThings === 'add an employee') {
                addEmployee()
            } else { updateEmployee() }
        })
}

function viewDepartments() {
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.table(result)
        appStart()
    });
}

function viewRoles() {
    db.query(`SELECT * FROM role`, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.table(result)
        appStart()
    });
}

function viewEmployees() {
    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.table(result)
        appStart()
    });
}

function addDepartment() {
    inquirer.prompt(
        {
            type: 'input',
            name: 'department',
            message: 'What department would you like to add?'
        }
    ).then(({ department }) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, department, (err) => {
            if (err) {
                console.log(err)
            }
            appStart()
        });
    })
}

function addRole() {
    const depChoices = [];
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) {
            console.log(err)
        }
        for (let i = 0; i < result.length; i++) {
            depChoices.push({
                name: result[i].name,
                value: result[i].id
            })
        }
    });
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What role would you like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department does this role belong to?',
            choices: depChoices
        }

    ]).then(({ department, title, salary }) => {
        db.query(`INSERT INTO role SET ?`, { title, salary, department_id: department }, (err) => {
            if (err) {
                console.log(err)
            }
            appStart()
        });
    })
}

function addEmployee() {
    const roleChoice = [];
    db.query(`SELECT * FROM role`, (err, result) => {
        if (err) {
            console.log(err)
        }
        for (let i = 0; i < result.length; i++) {
            roleChoice.push({
                name: result[i].title,
                value: result[i].id
            })
        }
    });
    const employeeChoice = [];
    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
            console.log(err)
        }
        for (let i = 0; i < result.length; i++) {
            employeeChoice.push({
                name: result[i].first,
                value: result[i].id
            })
        }
    });
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'last',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: 'What role does this employee belong to?',
            choices: roleChoice
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: employeeChoice
        }
    ]).then(({ first, last, role, manager }) => {
        db.query(`INSERT INTO employee SET ?`, { first_name: first, last_name: last, role_id: role, manager_id: manager }, (err) => {
            if (err) {
                console.log(err)
            }
            appStart()
        });
    })
}

function updateEmployee() {
    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
            console.log(err)
        }
        inquirer.prompt(
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to update?",
                choices() {
                    const employeeChoice = [];
                    result.forEach(({ first_name }) => {
                        employeeChoice.push(first_name)
                    });
                    return employeeChoice
                }
            }
        )
    })
}

appStart();