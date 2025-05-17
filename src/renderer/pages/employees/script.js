"use strict";
const employeeForm = document.getElementById("employee-form");
const tableBody = document.getElementById("employees-table-body");
const searchNumberForm = document.getElementById("search-number-form");
// Functions =====
const renderEmployeesTable = (employees) => {
  tableBody.innerHTML = "";
  console.log(employees);
  employees.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                <td>${doc.name}</td>
                <td>${doc.phone}</td>
                <td>${doc.department}</td>
                <td>${doc.salary}</td>
                <td>${doc.hireDate}</td>
                <td>
                    <div class="action-buttons">
                        <a href="./view.html?id=${doc._id}" class="btn btn-info">
                            <span class="icon icon-eye"></span>
                        </a>
                        <a href="./edit.html?id=${doc._id}" class="btn btn-primary">
                            <span class="icon icon-edit"></span>
                        </a>
                        <button
                          data-id="${doc._id}"
                          onclick="deleteDoc('${doc._id}')"
                          class="btn btn-danger"
                      >
                          <span class="icon icon-trash"></span>
                      </button>
                    </div>
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

// Event Handlers =====

const deleteDoc = async function (id) {
  const res = await window.dbAPI.deleteDocById({ modelName: "Employee", id });

  if (!res.success) {
    viewMessage("حدث خطأ أثناء المسح");
    return;
  }
  viewMessage("تم المسح بنجاح");
  fetchAndRenderEmployees();
};

searchNumberForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const collected = collectFormData(searchNumberForm);
  const res = await window.dbAPI.getDocBySearch({
    modelName: "Employee",
    filterOptions: { phone: collected.phone },
  });

  if (!res.success) {
    viewMessage("حدث خطأ اثناء البحث");
    return;
  }
  renderEmployeesTable(res.data);
});

employeeForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = collectFormData(employeeForm);
  console.log(data);
  const res = await window.dbAPI.createDoc({
    modelName: "Employee",
    data,
  });

  if (!res.success) {
    viewMessage("حدث خطأ اثناء الاضافة");
    return;
  }

  viewMessage("تم الاضافة بنجاح");

  employeeForm.reset();
  await fetchAndRenderEmployees();
});

// View employees data once page is loaded
fetchAndRenderEmployees();
