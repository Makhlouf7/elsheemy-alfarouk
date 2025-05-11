// Defining Elements
const supplierSelect = document.getElementById("supplier-select");
const incomingForm = document.getElementById("incoming-form");
const tableBody = document.getElementById("incoming-table-body");
const searchDateForm = document.getElementById("search-date-form");

// Functions =====
const loadSuppliers = (async () => {
  const suppliers = await window.dbAPI.getAllData("Supplier");
  const supplierOptions = suppliers.map((supplier) => {
    return `<option value="" hidden>اختر المورد</option><option value="${supplier._id}">${supplier.name}</option>`;
  });
  supplierSelect.innerHTML = supplierOptions.join("");
})();

const renderIncomingTable = (incomings) => {
  tableBody.innerHTML = "";
  console.log(incomings);
  incomings.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                    <td>${doc.date.toLocaleString("en-gb", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}</td>
                    <td>${doc.supplier.name}</td>
                    <td>${doc.type}</td>
                    <td>${doc.quantity}</td>
                    <td>${doc.shakara}</td>
                    <td>${doc.carNumber}</td>
                    <td>${doc.tonPrice.toLocaleString("en-us")}</td>
                    <td>${doc.loadType}</td>
                    <td>${doc.category}</td>
                    <td>
                      <div class="action-buttons">
                        <a
                          href="./supplier-invoice-static.html?autoPrint=true"
                          target="_blank"
                          class="btn btn-primary btn-icon"
                          ><span class="icon icon-printer"></span
                        ></a>
                        <button data-id="${doc._id}"
                          onclick="deleteDoc('${
                            doc._id
                          }')" class="btn btn-danger">
                          <span class="icon icon-trash"></span>
                        </button>
                      </div>
                    </td>
                  </tr>`
    );
  });
};

// Fetch incomings data and renders it in the table
const fetchAndRenderIncomings = async () => {
  const incomings = await window.dbAPI.getAllData("Incoming");
  console.log(incomings);
  renderIncomingTable(incomings);
};

// Event Handlers =====

const deleteDoc = async function (id) {
  const res = await window.dbAPI.deleteDocById({ modelName: "Incoming", id });

  if (!res.success) {
    viewMessage("حدث خطأ أثناء المسح");
    return;
  }
  viewMessage("تم المسح بنجاح");
  fetchAndRenderIncomings();
};

incomingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = collectFormData(incomingForm);

  console.log(data);
  const res = await window.dbAPI.createDoc({ modelName: "Incoming", data });
  if (res.success) {
    viewMessage("تمت الإضافة بنجاح");
    incomingForm.reset();
    fetchAndRenderIncomings();
  } else {
    viewMessage("حدث خطأ أثناء الإضافة");
  }
});

searchDateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = collectFormData(searchDateForm);
  const res = await window.dbAPI.getDocBySearch({
    modelName: "Incoming",
    filterOptions: data,
  });
  renderIncomingTable(res.data);
});

// View Previous Incomings
fetchAndRenderIncomings();
