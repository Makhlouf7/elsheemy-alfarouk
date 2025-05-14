// Defining Elements
const supplierSelect = document.getElementById("supplier-select");
const incomingForm = document.getElementById("incoming-form");
const tableBody = document.getElementById("incoming-table-body");
const searchDateForm = document.getElementById("search-date-form");
const selectType = document.getElementById("type");
const optionsBasedOnType = document.getElementById("options-based-type");

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
                    <td>${doc.carNumber}</td>
                    <td>${doc.price.toLocaleString("en-us")}</td>
                    <td>${doc.loadType || "-"}</td>
                    <td>${doc.category || "-"}</td>
                    <td>${(doc.quantity * doc.price).toLocaleString(
                      "en-us"
                    )}</td>
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

selectType.addEventListener("change", async (event) => {
  const type = selectType.options[selectType.selectedIndex].dataset.type;
  const ironOptions = `<div class="form-group">
                  <label for="quantity">الكمية بالطن</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="الكمية"
                    step="any"
                    min="0"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="price">سعر الطن</label>
                  <input
                    type="number"
                    id="price"
                    placeholder="السعر"
                    name="price"
                    min="0"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="load-type">نوع الحمولة</label>
                  <select id="load-type" name="loadType" required>
                    <option value="" hidden>اختر نوع الحمولة</option>
                    <option value="عز">عز</option>
                    <option value="استثماري">استثماري</option>
                    <option value="كومي">كومي</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="category">الصنف</label>
                  <select id="category" name="category" required>
                    <option value="" hidden>اختر الصنف</option>
                    <option value="16">16</option>
                    <option value="12">12</option>
                    <option value="10">10</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                  </select>
                </div>`;
  const cementOptions = `<div class="form-group">
                  <label for="quantity">عدد الشكارة</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    placeholder="الكمية"
                    required
                  />
                  </div>
                  <div class="form-group">
                  <label for="price">سعر الشكارة</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    placeholder="السعر"
                    required
                  />
                  </div>`;

  optionsBasedOnType.innerHTML = type === "iron" ? ironOptions : cementOptions;
});
fetchAndRenderIncomings();
