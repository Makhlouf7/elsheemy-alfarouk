"use strict";
const tableBody = document.getElementById("attendance-table-body");

const upsertAttendance = async (data) => {
  const res = await window.dbAPI.upsertAttendance(data);
  if (!res.success) {
    viewMessage("حدث خطأ أثناء الحفظ");
    return;
  }
  viewMessage("تم الحفظ بنجاح");
};

const collectEmployeeData = function (employeeId) {
  const btn = document.querySelector(`.save-btn[data-id="${employeeId}"]`);
  const row = btn.closest("tr");
  const date = row.querySelector("input[type='date']").value;
  const status = row.querySelector(".status-select").value;
  const checkIn = row.querySelector(".check-in").value;
  const checkOut = row.querySelector(".check-out").value;
  const data = {
    employeeId,
    date,
    status,
    checkIn,
    checkOut,
  };
  console.log("Data", data);
  upsertAttendance(data);
};

const renderEmployeesTable = (employees) => {
  tableBody.innerHTML = "";
  employees.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                    <td><input type="date" value="${
                      new Date().toISOString().split("T")[0]
                    }" readonly />
</td>
                    <td>${doc.name}</td>
                    <td>
                      <select class="status-select">
                        <option value="حضور">حضور</option>
                        <option value="غياب">غياب</option>
                        <option value="تأخير">تأخير</option>
                        <option value="إجازة">إجازة</option>
                      </select>

                    </td>
                    <td><input type="time" value="08:00" class="check-in" /></td>
                    <td><input type="time" value="14:00" class="check-out" /></td>
                    <td>
                      <button onClick = collectEmployeeData('${
                        doc._id
                      }') class="btn btn-primary save-btn" data-id="${
        doc._id
      }">حفظ</button>
                    </td>
                  </tr>`
    );
  });
};

// Fetch employees data and renders it in the table
const fetchAndRenderEmployees = async () => {
  const employees = await window.dbAPI.getAllData("Employee");
  renderEmployeesTable(employees);
};

fetchAndRenderEmployees();
