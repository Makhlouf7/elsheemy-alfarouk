"use strict";
const cashOutForm = document.getElementById("cash-out-form");
const tableBody = document.getElementById("cash-out-table-body");
const filterDateForm = document.getElementById("filter-date-form");
const totalEl = document.getElementById("total-expense");
// Functions =====
const renderCashOutTable = (cashOut) => {
  tableBody.innerHTML = "";
  cashOut.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                <td>${doc.date.toLocaleString("en-gb", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}</td>
                <td>${doc.amount.toLocaleString("en-us")}</td>
                <td>${doc.source}</td>
                <td>${doc.description}</td>
                <td>${doc.reviewer}</td>
                <td>
                    <div class="action-buttons">
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

// Fetch cashOut data and renders it in the table
const fetchAndRenderCashOut = async () => {
  const cashOut = await window.dbAPI.getDocBySearch({
    modelName: "Safe",
    filterOptions: { transactionType: "expense" },
  });
  const stats = await window.dbAPI.generalStatistics();
  if (!stats.success) {
    viewMessage("حدث خطأ اثناء احصاء الخزنة");
    return;
  }
  renderCashOutTable(cashOut.data);
  totalEl.innerText = stats.data.safeTotalExpenses.toLocaleString("en-us", {
    style: "currency",
    currency: "EGP",
  });
};

// Event Handlers =====

const deleteDoc = async function (id) {
  const res = await window.dbAPI.deleteDocById({ modelName: "Safe", id });

  if (!res.success) {
    viewMessage("حدث خطأ أثناء المسح");
    return;
  }
  viewMessage("تم المسح بنجاح");
  fetchAndRenderCashOut();
};

filterDateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const collected = collectFormData(filterDateForm);
  const stats = await window.dbAPI.generalStatistics({ date: collected.date });
  const res = await window.dbAPI.getDocBySearch({
    modelName: "Safe",
    filterOptions: { date: collected.date },
  });

  if (!res.success || !stats.success) {
    viewMessage("حدث خطأ اثناء البحث");
    return;
  }
  totalEl.innerText = stats.data.safeTotalExpenses.toLocaleString("en-us", {
    style: "currency",
    currency: "EGP",
  });
  renderCashOutTable(res.data);
});

cashOutForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = collectFormData(cashOutForm);
  const res = await window.dbAPI.createDoc({
    modelName: "Safe",
    data,
  });
  if (!res.success) {
    viewMessage("حدث خطأ اثناء الاضافة");
    return;
  }

  viewMessage("تم الاضافة بنجاح");

  cashOutForm.reset();
  await fetchAndRenderCashOut();
});

// View cashOut data once page is loaded
fetchAndRenderCashOut();
