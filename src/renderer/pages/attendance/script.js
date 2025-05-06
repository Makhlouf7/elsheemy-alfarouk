// Array to store attendance records
let attendanceRecords = [];

// DOM Elements
const form = document.getElementById("attendance-form");
const dateInput = document.getElementById("date");
const employeeInput = document.getElementById("employee");
const statusInput = document.getElementById("status");
const checkInInput = document.getElementById("check-in");
const checkOutInput = document.getElementById("check-out");
const notesInput = document.getElementById("notes");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-attendance");
const updateButton = document.getElementById("update-attendance");
const searchInput = document.getElementById("search-attendance");
const attendanceTableBody = document.getElementById("attendance-table-body");

// Set today's date as default
dateInput.valueAsDate = new Date();

// Clear form fields
clearButton.addEventListener("click", () => {
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Add new attendance record
addButton.addEventListener("click", () => {
  // Validate form
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  // Validate employee
  if (!employeeInput.value) {
    alert("الرجاء اختيار الموظف/العامل");
    return;
  }

  // Validate status
  if (!statusInput.value) {
    alert("الرجاء اختيار حالة الحضور");
    return;
  }

  // Validate check-in time
  if (!checkInInput.value) {
    alert("الرجاء إدخال وقت الحضور");
    return;
  }

  // Validate check-out time
  if (!checkOutInput.value) {
    alert("الرجاء إدخال وقت الانصراف");
    return;
  }

  // Validate time sequence
  if (checkInInput.value >= checkOutInput.value) {
    alert("وقت الانصراف يجب أن يكون بعد وقت الحضور");
    return;
  }

  // Create new attendance record
  const newRecord = {
    id: Date.now(),
    date: dateInput.value,
    employee: employeeInput.value,
    status: statusInput.value,
    checkIn: checkInInput.value,
    checkOut: checkOutInput.value,
    notes: notesInput.value.trim(),
  };

  // Add to records array
  attendanceRecords.push(newRecord);

  // Update table
  updateAttendanceTable();

  // Reset form
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Update attendance table
function updateAttendanceTable() {
  attendanceTableBody.innerHTML = "";

  attendanceRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${getEmployeeName(record.employee)}</td>
            <td>${getStatusName(record.status)}</td>
            <td>${record.checkIn}</td>
            <td>${record.checkOut}</td>
            <td>${record.notes || "-"}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editRecord(${
                      record.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteRecord(${
                      record.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    attendanceTableBody.appendChild(row);
  });
}

// Edit record
function editRecord(id) {
  const record = attendanceRecords.find((r) => r.id === id);
  if (record) {
    dateInput.value = record.date;
    employeeInput.value = record.employee;
    statusInput.value = record.status;
    checkInInput.value = record.checkIn;
    checkOutInput.value = record.checkOut;
    notesInput.value = record.notes;

    // Remove the record from the list
    attendanceRecords = attendanceRecords.filter((r) => r.id !== id);
    updateAttendanceTable();
  }
}

// Delete record
function deleteRecord(id) {
  if (confirm("هل أنت متأكد من حذف هذا التسجيل؟")) {
    attendanceRecords = attendanceRecords.filter((r) => r.id !== id);
    updateAttendanceTable();
  }
}

// Format date to Gregorian format
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get employee name
function getEmployeeName(employeeId) {
  const employees = {
    employee1: "محمد أحمد",
    employee2: "علي محمود",
    employee3: "أحمد سعيد",
  };
  return employees[employeeId] || employeeId;
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

// Search records
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRecords = attendanceRecords.filter(
    (record) =>
      formatDate(record.date).includes(searchTerm) ||
      getEmployeeName(record.employee).toLowerCase().includes(searchTerm) ||
      getStatusName(record.status).toLowerCase().includes(searchTerm) ||
      record.checkIn.includes(searchTerm) ||
      record.checkOut.includes(searchTerm) ||
      (record.notes && record.notes.toLowerCase().includes(searchTerm))
  );

  attendanceTableBody.innerHTML = "";

  filteredRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${getEmployeeName(record.employee)}</td>
            <td>${getStatusName(record.status)}</td>
            <td>${record.checkIn}</td>
            <td>${record.checkOut}</td>
            <td>${record.notes || "-"}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editRecord(${
                      record.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteRecord(${
                      record.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    attendanceTableBody.appendChild(row);
  });
});

// Update button
updateButton.addEventListener("click", () => {
  updateAttendanceTable();
});

// Initialize the page
updateAttendanceTable();
