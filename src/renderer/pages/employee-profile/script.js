// DOM Elements
const employeeInfoContainer = document.getElementById("employee-info");
const transactionsTableBody = document.getElementById("transactions-table-body");
const attendanceTableBody = document.getElementById("attendance-table-body");
const totalAmountElement = document.getElementById("total-amount");

// Get employee ID from URL
const urlParams = new URLSearchParams(window.location.search);
const employeeId = parseInt(urlParams.get("id"));

// Sample data - in a real app, this would come from a database
const employees = [
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

// Sample transactions data
const transactions = [
  {
    id: 1,
    employeeId: 1,
    date: "2023-01-10",
    type: "salary",
    amount: 5000,
    description: "راتب شهر يناير",
    reference: "SAL-2023-01",
  },
  {
    id: 2,
    employeeId: 1,
    date: "2023-01-15",
    type: "advance",
    amount: -1000,
    description: "سلفة",
    reference: "ADV-2023-01",
  },
  {
    id: 3,
    employeeId: 1,
    date: "2023-02-10",
    type: "salary",
    amount: 5000,
    description: "راتب شهر فبراير",
    reference: "SAL-2023-02",
  },
  {
    id: 4,
    employeeId: 2,
    date: "2023-01-10",
    type: "salary",
    amount: 4000,
    description: "راتب شهر يناير",
    reference: "SAL-2023-01",
  },
  {
    id: 5,
    employeeId: 3,
    date: "2023-01-10",
    type: "salary",
    amount: 3500,
    description: "راتب شهر يناير",
    reference: "SAL-2023-01",
  },
];

// Sample attendance data
const attendance = [
  {
    id: 1,
    employeeId: 1,
    date: "2023-01-02",
    status: "present",
    checkIn: "08:00",
    checkOut: "16:00",
    notes: "",
  },
  {
    id: 2,
    employeeId: 1,
    date: "2023-01-03",
    status: "present",
    checkIn: "08:15",
    checkOut: "16:00",
    notes: "",
  },
  {
    id: 3,
    employeeId: 1,
    date: "2023-01-04",
    status: "late",
    checkIn: "09:30",
    checkOut: "16:00",
    notes: "تأخر بسبب المواصلات",
  },
  {
    id: 4,
    employeeId: 1,
    date: "2023-01-05",
    status: "absent",
    checkIn: "",
    checkOut: "",
    notes: "إجازة مرضية",
  },
  {
    id: 5,
    employeeId: 2,
    date: "2023-01-02",
    status: "present",
    checkIn: "08:00",
    checkOut: "16:00",
    notes: "",
  },
];

// Load employee data
function loadEmployeeData() {
  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    employeeInfoContainer.innerHTML = `
            <div class="error-message">
                <p>لم يتم العثور على الموظف</p>
                <a href="../employees/index.html" class="btn btn-primary">العودة لقائمة الموظفين</a>
            </div>
        `;
    return;
  }

  // Update page title
  document.title = `بروفايل الموظف - ${employee.name}`;

  // Display employee info
  employeeInfoContainer.innerHTML = `
        <div class="employee-header">
            <div class="employee-avatar">
                <span class="icon icon-user"></span>
            </div>
            <div>
                <h1 class="employee-name">${employee.name}</h1>
                <p class="employee-job-title">${employee.jobTitle}</p>
            </div>
        </div>
        <div class="employee-info-item">
            <h3>رقم الهاتف</h3>
            <p>${employee.phone}</p>
        </div>
        <div class="employee-info-item">
            <h3>العنوان</h3>
            <p>${employee.address}</p>
        </div>
        <div class="employee-info-item">
            <h3>القسم</h3>
            <p>${getDepartmentName(employee.department)}</p>
        </div>
        <div class="employee-info-item">
            <h3>الراتب الشهري</h3>
            <p>${formatCurrency(employee.salary)}</p>
        </div>
        <div class="employee-info-item">
            <h3>تاريخ التعيين</h3>
            <p>${formatDate(employee.hireDate)}</p>
        </div>
        <div class="employee-info-item">
            <h3>ملاحظات</h3>
            <p>${employee.notes || "لا توجد ملاحظات"}</p>
        </div>
    `;

  // Load transactions
  loadTransactions();

  // Load attendance
  loadAttendance();
}

// Load transactions
function loadTransactions() {
  const employeeTransactions = transactions.filter(
    (t) => t.employeeId === employeeId
  );

  if (employeeTransactions.length === 0) {
    transactionsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">لا توجد معاملات</td>
            </tr>
        `;
    totalAmountElement.textContent = "";
    return;
  }

  transactionsTableBody.innerHTML = "";
  let totalAmount = 0;

  employeeTransactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${getTransactionTypeName(transaction.type)}</td>
            <td class="${
              transaction.amount < 0 ? "negative-amount" : "positive-amount"
            }">${formatCurrency(transaction.amount)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.reference}</td>
        `;
    transactionsTableBody.appendChild(row);
    totalAmount += transaction.amount;
  });

  totalAmountElement.innerHTML = `
        <div class="total-amount-container">
            <span class="total-label">إجمالي المعاملات:</span>
            <span class="total-value">${formatCurrency(totalAmount)}</span>
        </div>
    `;
}

// Load attendance
function loadAttendance() {
  const employeeAttendance = attendance.filter(
    (a) => a.employeeId === employeeId
  );

  if (employeeAttendance.length === 0) {
    attendanceTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">لا توجد سجلات حضور</td>
            </tr>
        `;
    return;
  }

  attendanceTableBody.innerHTML = "";

  employeeAttendance.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${getStatusName(record.status)}</td>
            <td>${record.checkIn || "-"}</td>
            <td>${record.checkOut || "-"}</td>
            <td>${record.notes || "-"}</td>
        `;
    attendanceTableBody.appendChild(row);
  });
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

// Get transaction type name in Arabic
function getTransactionTypeName(type) {
  const types = {
    salary: "راتب",
    advance: "سلفة",
    bonus: "مكافأة",
    deduction: "خصم",
  };
  return types[type] || type;
}

// Get status name in Arabic
function getStatusName(status) {
  const statuses = {
    present: "حضور",
    absent: "غياب",
    late: "تأخير",
    leave: "إجازة",
  };
  return statuses[status] || status;
}

// Initialize the page
loadEmployeeData();
