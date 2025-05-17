"use strict";
const employeeNameEl = document.getElementById("employee-name");
const employeePhoneEl = document.getElementById("employee-phone");
const employeeAddressEl = document.getElementById("employee-address");
const employeeDepartmentEl = document.getElementById("employee-department");
const employeeSalaryEl = document.getElementById("employee-salary");
const employeeHireDateEl = document.getElementById("employee-hire-date");
const employeeNotesEl = document.getElementById("employee-notes");
const tableBody = document.getElementById("attendance-table-body");
const deleteBtn = document.getElementById("delete-records");
// Defining Variables =====
const params = new URLSearchParams(location.search);
const employeeId = params.get("id");

// Functions =====
const fillData = (async () => {
  const res = await window.dbAPI.getDocById({
    modelName: "Employee",
    id: employeeId,
  });
  if (!res.success) {
    viewMessage("حدث خطأ في احضار البيانات");
    return;
  }

  employeeNameEl.textContent = res.data.name;
  employeePhoneEl.textContent = res.data.phone;
  employeeAddressEl.textContent = res.data.address;
  employeeDepartmentEl.textContent = res.data.department;
  employeeSalaryEl.textContent = res.data.salary.toLocaleString("en-us");
  employeeHireDateEl.textContent = res.data.hireDate.toLocaleString("en-gb", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  employeeNotesEl.textContent = res.data.notes;
})();

const renderAttendancesTable = (attendances) => {
  tableBody.innerHTML = "";
  attendances.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                    <td><input type="date" value="${
                      new Date().toISOString().split("T")[0]
                    }" readonly /></td>
                    <td>${doc.status}</td>
                    <td>${doc.checkIn}</td>
                    <td>${doc.checkOut}</td>
                    
                  </tr>`
    );
  });
};

// Fetch attendances data and renders it in the table
const fetchAndRenderAttendances = async () => {
  const attendances = await window.dbAPI.getDocBySearch({
    modelName: "Attendance",
    filterOptions: { employeeId },
  });
  console.log("Attendances", attendances);
  renderAttendancesTable(attendances.data);
};

fetchAndRenderAttendances();

// Event Handlers =====
deleteBtn.addEventListener("click", async () => {
  const res = await window.dbAPI.deleteAllDocs({
    modelName: "Attendance",
    filterOptions: { employeeId },
  });
  if (!res.success) {
    viewMessage("حدث خطأ في حذف السجلات");
    return;
  }
  viewMessage("تم حذف السجلات بنجاح");
  fetchAndRenderAttendances();
});
