// DOM Elements
const employeeForm = document.getElementById("employee-form");
const employeeNameInput = document.getElementById("employee-name");
const jobTitleInput = document.getElementById("job-title");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const salaryInput = document.getElementById("salary");
const hireDateInput = document.getElementById("hire-date");
const departmentInput = document.getElementById("department");
const notesInput = document.getElementById("notes");
const clearFieldsButton = document.getElementById("clear-fields");
const addEmployeeButton = document.getElementById("add-employee");
const searchInput = document.getElementById("search-employee");
const updateButton = document.getElementById("update-employees");
const employeesTableBody = document.getElementById("employees-table-body");

// Sample data - in a real app, this would come from a database
let employees = [
  {
    id: 1,
    name: "محمد أحمد",
    jobTitle: "مدير إنتاج",
    phone: "01012345678",
    address: "القاهرة، مصر",
    salary: 5000,
    hireDate: "2022-01-15",
    department: "production",
    notes: "موظف مثالي",
  },
  {
    id: 2,
    name: "علي محمود",
    jobTitle: "محاسب",
    phone: "01123456789",
    address: "الإسكندرية، مصر",
    salary: 4000,
    hireDate: "2022-03-10",
    department: "accounting",
    notes: "",
  },
  {
    id: 3,
    name: "أحمد سعيد",
    jobTitle: "مندوب مبيعات",
    phone: "01234567890",
    address: "الجيزة، مصر",
    salary: 3500,
    hireDate: "2022-05-20",
    department: "sales",
    notes: "يحتاج إلى تدريب إضافي",
  },
];

// Set current date as default for hire date
hireDateInput.valueAsDate = new Date();

// Clear fields button
clearFieldsButton.addEventListener("click", () => {
  employeeForm.reset();
  hireDateInput.valueAsDate = new Date();
});

// Add employee button
addEmployeeButton.addEventListener("click", () => {
  // Validate form
  if (!employeeNameInput.value.trim()) {
    alert("الرجاء إدخال اسم الموظف");
    return;
  }

  if (!jobTitleInput.value.trim()) {
    alert("الرجاء إدخال المسمى الوظيفي");
    return;
  }

  if (!phoneInput.value.trim()) {
    alert("الرجاء إدخال رقم الهاتف");
    return;
  }

  if (!addressInput.value.trim()) {
    alert("الرجاء إدخال العنوان");
    return;
  }

  if (!salaryInput.value || salaryInput.value <= 0) {
    alert("الرجاء إدخال راتب صحيح");
    return;
  }

  if (!hireDateInput.value) {
    alert("الرجاء إدخال تاريخ التعيين");
    return;
  }

  if (!departmentInput.value) {
    alert("الرجاء اختيار القسم");
    return;
  }

  // Create new employee
  const newEmployee = {
    id: Date.now(),
    name: employeeNameInput.value.trim(),
    jobTitle: jobTitleInput.value.trim(),
    phone: phoneInput.value.trim(),
    address: addressInput.value.trim(),
    salary: parseFloat(salaryInput.value),
    hireDate: hireDateInput.value,
    department: departmentInput.value,
    notes: notesInput.value.trim(),
  };

  // Add to employees array
  employees.push(newEmployee);

  // Update table
  updateEmployeesTable();

  // Reset form
  employeeForm.reset();
  hireDateInput.valueAsDate = new Date();
});

// Update employees table
function updateEmployeesTable() {
  employeesTableBody.innerHTML = "";

  employees.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.jobTitle}</td>
            <td>${employee.phone}</td>
            <td>${getDepartmentName(employee.department)}</td>
            <td>${formatCurrency(employee.salary)}</td>
            <td>${formatDate(employee.hireDate)}</td>
            <td>
                <div class="action-buttons">
                    <a href="../employee-profile/index.html?id=${
                      employee.id
                    }" class="btn btn-info">
                        <span class="icon icon-eye"></span>
                    </a>
                    <button class="btn btn-primary" onclick="editEmployee(${
                      employee.id
                    })">
                        <span class="icon icon-edit"></span>
                    </button>
                    <button class="btn btn-danger" onclick="deleteEmployee(${
                      employee.id
                    })">
                        <span class="icon icon-trash"></span>
                    </button>
                </div>
            </td>
        `;
    employeesTableBody.appendChild(row);
  });
}

// Edit employee
function editEmployee(id) {
  const employee = employees.find((e) => e.id === id);
  if (employee) {
    employeeNameInput.value = employee.name;
    jobTitleInput.value = employee.jobTitle;
    phoneInput.value = employee.phone;
    addressInput.value = employee.address;
    salaryInput.value = employee.salary;
    hireDateInput.value = employee.hireDate;
    departmentInput.value = employee.department;
    notesInput.value = employee.notes;

    // Remove the employee from the list
    employees = employees.filter((e) => e.id !== id);
    updateEmployeesTable();
  }
}

// Delete employee
function deleteEmployee(id) {
  if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
    employees = employees.filter((e) => e.id !== id);
    updateEmployeesTable();
  }
}

// Format date to Gregorian format
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Format as DD/MM/YYYY
  return `${day}/${month}/${year}`;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}

// Get department name in Arabic
function getDepartmentName(department) {
  const departments = {
    production: "الإنتاج",
    sales: "المبيعات",
    accounting: "المحاسبة",
    management: "الإدارة",
    other: "أخرى",
  };
  return departments[department] || department;
}

// Search employees
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm) ||
      employee.jobTitle.toLowerCase().includes(searchTerm) ||
      employee.phone.includes(searchTerm) ||
      getDepartmentName(employee.department).toLowerCase().includes(searchTerm)
  );

  employeesTableBody.innerHTML = "";
  filteredEmployees.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.jobTitle}</td>
            <td>${employee.phone}</td>
            <td>${getDepartmentName(employee.department)}</td>
            <td>${formatCurrency(employee.salary)}</td>
            <td>${formatDate(employee.hireDate)}</td>
            <td>
                <div class="action-buttons">
                    <a href="../employee-profile/index.html?id=${
                      employee.id
                    }" class="btn btn-info">
                        <span class="icon icon-eye"></span>
                    </a>
                    <button class="btn btn-primary" onclick="editEmployee(${
                      employee.id
                    })">
                        <span class="icon icon-edit"></span>
                    </button>
                    <button class="btn btn-danger" onclick="deleteEmployee(${
                      employee.id
                    })">
                        <span class="icon icon-trash"></span>
                    </button>
                </div>
            </td>
        `;
    employeesTableBody.appendChild(row);
  });
});

// Update employees button
updateButton.addEventListener("click", () => {
  updateEmployeesTable();
});

// Initialize the page
updateEmployeesTable();
