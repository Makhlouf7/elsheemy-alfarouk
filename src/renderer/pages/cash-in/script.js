"use strict";
const cashInForm = document.getElementById("cash-in-form");
const tableBody = document.getElementById("cash-in-table-body");
const filterDateForm = document.getElementById("filter-date-form");
const totalEl = document.getElementById("total-income");
// Functions =====
const renderCashInTable = (cashIn) => {
  tableBody.innerHTML = "";
  console.log(cashIn);
  cashIn.forEach((doc) => {
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

// Fetch cashIn data and renders it in the table
const fetchAndRenderCashIn = async () => {
  const cashIn = await window.dbAPI.getDocBySearch({
    modelName: "Safe",
    filterOptions: { transactionType: "income" },
  });
  console.log(cashIn);
  const stats = await window.dbAPI.generalStatistics();
  if (!stats.success) {
    viewMessage("حدث خطأ اثناء احصاء الخزنة");
    return;
  }
  renderCashInTable(cashIn.data);
  totalEl.innerText = stats.data.safeTotalIncomes.toLocaleString("en-us", {
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
  fetchAndRenderCashIn();
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
  totalEl.innerText = stats.data.safeTotalIncomes.toLocaleString("en-us", {
    style: "currency",
    currency: "EGP",
  });
  renderCashInTable(res.data);
});

cashInForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = collectFormData(cashInForm);
  console.log(data);
  const res = await window.dbAPI.createDoc({
    modelName: "Safe",
    data,
  });
  console.log(res);
  if (!res.success) {
    viewMessage("حدث خطأ اثناء الاضافة");
    return;
  }

  viewMessage("تم الاضافة بنجاح");

  cashInForm.reset();
  await fetchAndRenderCashIn();
});

// View cashIn data once page is loaded
fetchAndRenderCashIn();
