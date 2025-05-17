const employeeNameEl = document.getElementById("employee-name");
const employeePhoneEl = document.getElementById("employee-phone");
const employeeAddressEl = document.getElementById("employee-address");
const employeeDepartmentEl = document.getElementById("employee-department");
const employeeSalaryEl = document.getElementById("employee-salary");
const employeeHireDateEl = document.getElementById("employee-hire-date");
const employeeNotesEl = document.getElementById("employee-notes");

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
