const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_trackerDB"
});

connection.connect((function (err) {
    if (err) {
        console.error("Error" + err.stack);
        return;
    }
    functionAction();
}));

function functionAction() {
    inquirer.prompt(frontPrompt)
        .then(function (answer) {
            executeFunctions(answers.action)
        });
}

const frontPrompt = {
    type: 'list',
    name: 'action',
    message: 'What what would you like to do?',
    choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Employee",
        "Update Employee Role",
        "Add Department",
        "Add Role"
    ]
};

function executeFunction(action) {
    switch (action) {
        case "View Employee":
            viewTable("employee");
            break;
        case "View Department":
            viewTable("department");
            break;
        case "View Role":
            viewTable("roles");
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Add Role":
            addRole();
            break;
    }
}

function viewTables(name) {
    let queryEmployee = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS "department", role.salary, CONCAT(m.first_name,"",m.last_name) AS "manager" FROM employee AS e LEFT JOIN employee AS m ON m.id = e.manager_id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id';
    let queryDepartment = "SELECT * FROM department";
    let queryRole = "SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id"

    let query = "";

    switch (name) {
        case "employee":
            query = queryEmployee;
            break;
        case "Department":
            query = queryDepartment;
            break;
        case "Role":
            query = queryRole;
            break;
    }

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

