"use strict";
const supplierForm = document.getElementById("supplier-form");
const tableBody = document.getElementById("suppliers-table-body");
const searchNumberForm = document.getElementById("search-number-form");
console.log(viewMessage);
// Functions =====
const renderSuppliersTable = (suppliers) => {
  tableBody.innerHTML = "";
  console.log(suppliers);
  suppliers.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                <td>${doc.name}</td>
                <td>${doc.phone}</td>
                <td>${doc.openingBalance}</td>
                <td>${doc.contactPerson}</td>
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

// Fetch suppliers data and renders it in the table
const fetchAndRenderSuppliers = async () => {
  const suppliers = await window.dbAPI.getAllData("Supplier");
  renderSuppliersTable(suppliers);
};

// Event Handlers =====

const deleteDoc = async function (id) {
  const res = await window.dbAPI.deleteDocById({ modelName: "Supplier", id });

  if (!res.success) {
    viewMessage("حدث خطأ أثناء المسح");
    return;
  }
  viewMessage("تم المسح بنجاح");
  fetchAndRenderSuppliers();
};

searchNumberForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const collected = collectFormData(searchNumberForm);
  console.log(collected);
  const res = await window.dbAPI.getDocBySearch({
    modelName: "Supplier",
    filterOptions: { phone: collected.phone },
  });

  if (!res.success) {
    viewMessage("حدث خطأ اثناء البحث");
    return;
  }
  renderSuppliersTable(res.data);
});

supplierForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = collectFormData(supplierForm);
  const res = await window.dbAPI.createDoc({
    modelName: "Supplier",
    data,
  });

  if (!res.success) {
    viewMessage("حدث خطأ اثناء الاضافة");
    return;
  }

  viewMessage("تم الاضافة بنجاح");

  supplierForm.reset();
  await fetchAndRenderSuppliers();
});

// View suppliers data once page is loaded
fetchAndRenderSuppliers();
