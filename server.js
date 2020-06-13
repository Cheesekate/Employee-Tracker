const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");



const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_trackerDB",
});


connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    frontAction();
});

function frontAction() {
    inquirer.prompt(frontPrompt)
        .then(function (answer) {
            executeFunctions(answer.action);
        });
}

const frontPrompt = {
    type: 'list',
    name: 'action',
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        // "View All Employees By Department",
        // "View All Employees By Manager",
        "Add Employee",
        // "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Add Department",
        // "Remove Department",
        "Add Role",
        // "Remove Role"
    ]
};

function executeFunctions(action) {
    switch (action) {
        case "View All Employees":
            viewTable("employee");
            break;

        case "View All Departments":
            viewTable("department");
            break;

        case "View All Roles":
            viewTable("role");
            break;

        case "Add Employee":
            addEmployee();
            break;

        case "Update Employee Role":
            updateEmployeeRole();
            break;

        case "Update Employee Manager":
            updateEmployeeManager();
            break;

        case "Add Department":
            addDepartment();
            break;

        case "Add Role":
            addRole();
            break;
    }
}

function viewTable(name) {
    let queryEmployee = "select e.id, e.first_name, e.last_name, role.title, department.name as \"department\", role.salary, concat(m.first_name,\" \",m.last_name) as \"manager\" from employee as e left join employee as m on m.id=e.manager_id inner join role on e.role_id=role.id inner join department on role.department_id=department.id";
    let queryDepartment = "select * from department";
    let queryRole = "select role.id, role.title, role.salary, department.name from role inner join department on role.department_id=department.id";
    let query = "";
    switch (name) {
        case "employee":
            query = queryEmployee;
            break;
        case "department":
            query = queryDepartment;
            break;
        case "role":
            query = queryRole;
            break;
    }
    connection.query(query, function (err, res) {
        console.table(res);
        frontAction();
    });
};

function addEmployee() {
    let roleList = [];
    let managerList = ["None"];

    connection.query("select title from role", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title);
        }
    });
    connection.query("select first_name, last_name from employee", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            managerList.push(res[i].first_name + " " + res[i].last_name);
        }
        addEmployeeSupp(roleList, managerList);
    });
};

async function addEmployeeSupp(roleList, managerList) {
    const answer = await inquirer.prompt([{
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
    },
    {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
    },
    {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleList
    },
    {
        name: "manager",
        type: "list",
        message: "Who is this employee's manager?",
        choices: managerList
    },
    ]);
    if (answer.manager == "None") {
        const manager = null;
        let query = "insert into employee (first_name, last_name, role_id, manager_id) values (?,?,(select id from role where title =?), null)";
        connection.query(query, [answer.firstName, answer.lastName, answer.role], function (err, res) {
            if (err) throw err;
            frontAction();
        });
    } else {
        const manager = answer.manager.split(" ");
        let query = "insert into employee (first_name, last_name, role_id, manager_id) values (?,?,(select id from role where title=?), (select id from ( select * from employee) as t where first_name = ? and last_name = ? ))";
        connection.query(query, [answer.firstName, answer.lastName, answer.role, manager[0], manager[1]], function (err, res) {
            if (err) throw err;
            frontAction();
        });
    }
}


function updateEmployeeManager() {
    const employeeList = [];
    connection.query("select first_name, last_name from employee", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            employeeList.push(res[i].first_name + " " + res[i].last_name);
        }
        updateEmployeeManagerSupp(employeeList);
    });
};

async function updateEmployeeManagerSupp(employeeList) {
    let answer = await inquirer.prompt([{
        name: "employee",
        type: "list",
        message: "Which employee do you want to update?",
        choices: employeeList
    },
    {
        name: "manager",
        type: "list",
        message: "Who is this employee's manager?",
        choices: employeeList
    }
    ]);
    const employee = answer.employee.split(" ");
    const manager = answer.manager.split(" ");

    let query = "update employee set manager_id = (select id from ( select * from employee) as t where first_name =? and last_name=?) where first_name=? and last_name=?"
    connection.query(query, [manager[0], manager[1], employee[0], employee[1]], function (err, res) {
        if (err) throw err;
        frontAction();
    });
};

function updateEmployeeRole() {
    let employeeList = [];
    let roleList = [];
    connection.query("select title from role", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title);
        }
    });
    connection.query("select first_name, last_name from employee", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            employeeList.push(res[i].first_name + " " + res[i].last_name);
        }
        updateEmployeeRoleSupp(employeeList, roleList);
    });
}

async function updateEmployeeRoleSupp(employeeList, roleList) {
    let answer = await inquirer.prompt([{
        name: "employee",
        type: "list",
        message: "Which employee do you want to update?",
        choices: employeeList
    },
    {
        name: "role",
        type: "list",
        message: "What is this employee's role?",
        choices: roleList
    }
    ]);
    let employee = answer.employee.split(" ");
    let query = "update employee set role_id = (select id from role where title =?)  where first_name=? and last_name=?";
    connection.query(query, [answer.role, employee[0], employee[1]], function (err, res) {
        frontAction();
    })
}

function addDepartment() {
    inquirer.prompt({
        name: "name",
        type: "input",
        message: "What is the department you would like to add?"
    })
        .then(function (answer) {
            let value = [
                [answer.name]
            ];
            connection.query("insert into department (name) values ?", [value], function (err, res) {
                frontAction();
            });
        });
};

function addRole() {
    let departmentList = [];
    connection.query("select name from department", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            departmentList.push(res[i].name);
        }
        addRoleSupp(departmentList);
    })
};

async function addRoleSupp(departmentList) {
    const answer = await inquirer.prompt([{
        name: "department",
        type: "list",
        message: "Which department is this role under?",
        choices: departmentList
    },
    {
        name: "title",
        type: "input",
        message: "What is the title of this role?"
    },
    {
        name: "salary",
        type: "input",
        message: "What is the salary of this role?"
    }
    ]);
    let finalQuery = "insert into role (title,salary,department_id) value (?,?, (select id from department where name=?))";
    connection.query(finalQuery, [answer.title, parseInt(answer.salary), answer.department], function (err, res) {
        if (err) throw err;
        frontAction();
    });
}

// connection.connect();
// connection.query = util.promisify(connection.query);
// module.exports = connection;

// class Queries {
//     addDepartment(name) {
//         return connection.query("INSERT INTO department SET name=?", [name])
//     }
//     async addRole(title, salary, department) {
//         const departmentID = await connection.query("SELECT id FROM department WHERE name=?", [department]);
//         return connection.query("INSERT INTO role SET ?", {
//             title: title,
//             salary: salary,
//             department_id: departmentID[0].id
//         });
//     }
//     async addEmployee(firstName, lastName, role, manager) {
//         const roleID = await connection.query("SELECT id FROM role WHERE title=?", [role]);
//         if (manager != "None") {
//             const firstName = manager.split(/\s(.+)/)[0];
//             const lastName = manager.split(/\s(.+)/)[1];
//             const managerID = await connection.query("SELECT id FROM employee WHERE ?",
//                 [{
//                     first_name: firstName
//                 },
//                 {
//                     last_name: lastName
//                 }]);
//             return connection.query("INSERT INTO employee SET ?",
//                 {
//                     first_name: firstName,
//                     last_name: lastName,
//                     role_id: roleID[0].id,
//                     manager_id: managerID[0].id
//                 });
//         } else {
//             return connection.query("INSERT INTO employee SET ?",
//                 {
//                     first_name: firstName,
//                     last_name: lastName,
//                     role_id: roleID[0].id,
//                 });
//         };
//     };

//     viewDepartment() {
//         return connection.query("SELECT * FROM department");
//     };
//     viewEmployee() {
//         return connection.query("SELECT employee.id, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manger_id");
//     };
//     viewRole() {
//         return connection.query("SELECT * FROM role");
//     };
//     async updateEmployee(name, role) {
//         const roleID = await connection.query("SELECT id FROM role WHERE title=?", [role]);
//         const firstName = manager.split(/\s(.+)/)[0];
//         const lastName = manager.split(/\s(.+)/)[1];
//         return connection.query("UPDATE employee SET ? WHERE ?", [
//             { role_id: roleID[0].id },
//             { first_name: firstName },
//             { last_name: lastName },
//         ]);
//     }

// }

// dbQueries = new Queries;
// // const ques1 =
// // {
// //     name: "action",
// //     type: "list",
// //     message: "Choose:",
// //     choices: ["Add Department", "Add Role", "Add Employee", "View Department", "View Role", "View Employee", "Update Employee Role"],
// // };
// const departQ =
// {
//     name: "name",
//     type: "input",
//     message: "New Department Name:"
// };

// const roleQ =
//     [{
//         name: "name",
//         type: "input",
//         message: "New Role Name:"
//     },
//     {
//         name: "salary",
//         type: "input",
//         message: "Role Salary:"
//     },
//     {
//         name: "department",
//         type: "list",
//         message: "Department Role:",
//         choices: departmentArray
//     }
//     ];
// const empQ = [
//     {
//         name: "firstName",
//         type: "input",
//         message: "Employee First Name:"
//     },
//     {
//         name: "lastName",
//         type: "input",
//         message: "Employee Family Name:"
//     },
//     {
//         name: "manager",
//         type: "list",
//         message: "Provide Manager:",
//         choices: managerArray
//     },
//     {
//         name: "role",
//         type: "list",
//         message: "Provide Role:",
//         choices: roleArray
//     },
// ];
// const empRoleQ = [
//     {
//         name: "employee",
//         type: "list",
//         message: "Select Employee to Change Role:",
//         choices: employeeArray
//     },
//     {
//         name: "role",
//         type: "list",
//         message: "Select Role to Change:",
//         choices: roleArray
//     }];

// async function roleArray() {
//     const roles = await dbQueries.viewRole();
//     const roleArrays = roles.map(item => item.title);
//     return roleArrays;
// };

// async function departmentArray() {
//     const departments = await dbQueries.viewDepartment();
//     const departmentArrays = departments.map(item => item.name);
//     return departmentArrays;
// };

// async function managerArray() {
//     const managers = await dbQueries.viewEmployee();
//     const tempManagerArray = managers.map(item => item.manager);
//     const managerArrays = tempManagerArray.filter(item => {
//         if (item) {
//             return item
//         }
//     })
//     const uniqueMngArray = [...new SET(managerArray)];
//     uniqueMngArray.push("None");
//     return uniqueMngArray;
// };

// async function employeeArray() {
//     const employees = await dbQueries.viewEmployee();
//     const employeeArrays = employees.map(item => item.first_name + " " + item.last_name);
//     return employeeArrays;
// };

// async function init() {
//     const frontPrompt = await inquirer.prompt(frontPrompt);
//     switch (frontPrompt.action) {
//         case "Add Department":
//             const addDep = await inquirer.prompt(departQ);
//             await dbQueries.addDepartment(addDep.name);
//             init();
//             break;
//         case "Add Role":
//             const addRoles = await inquirer.prompt(roleQ);
//             await dbQueries.addRole(addRoles.name, addRoles.salary, addRoles.department);
//             init();
//             break;


//             case "Add Employee":
//                 const addEmp = await inquirer.prompt(empQ);
//                 await dbQueries.addEmployee(addEmp.firstName, addEmp.lastName, addEmp.role, addEmp.manager);
//                 init();
//                 break;

//         case "Update Employee Role":
//             const updateRole = await inquirer.prompt(employeeRoleQ);
//             await dbQueries.updateEmployee(updateRole.employee, updateRole.role);
//             init();
//             break;
//     }
// }

// init();

