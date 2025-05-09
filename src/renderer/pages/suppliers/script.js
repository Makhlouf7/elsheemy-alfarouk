const supplierForm = document.getElementById("supplier-form");
const tableBody = document.getElementById("suppliers-table-body");

// Helper Functions =====
// const collectFormData = (formEl) => {
//   const formData = new FormData(formEl);
//   const dataObj = {};
//   formData.forEach((value, key) => (dataObj[key] = value));
//   return dataObj;
// };

const renderSuppliersTable = (suppliers) => {
  tableBody.innerHTML = "";
  suppliers.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                <td>${doc.name}</td>
                <td>${doc.phone}</td>
                <td>${doc.address}</td>
                <td>${doc.openingBalance}</td>
                <td>${doc.notes}</td>
                <td>
                    <div class="action-buttons">
                        <a href="./view.html?id=${doc._id}" class="btn btn-info">
                            <span class="icon icon-eye"></span>
                        </a>
                        <a href="./edit.html?id=${doc._id}" class="btn btn-primary">
                            <span class="icon icon-edit"></span>
                        </a>
                        <a class="btn btn-danger">
                            <span class="icon icon-trash"></span>
                        </a>
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

supplierForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = collectFormData(supplierForm);
  const res = await window.dbAPI.createDoc({
    modelName: "Supplier",
    data,
  });

  if (!res.success) {
    alert("Couldn't add data");
    return;
  }

  alert("Added successfully");
  supplierForm.reset();
  await fetchAndRenderSuppliers();
});

// View suppliers data once page is loaded
fetchAndRenderSuppliers();
