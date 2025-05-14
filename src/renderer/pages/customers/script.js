const customerForm = document.getElementById("customer-form");
const tableBody = document.getElementById("customers-table-body");

// Functions =====
const renderCustomersTable = (customers) => {
  tableBody.innerHTML = "";
  customers.forEach((doc) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                <td>${doc.name}</td>
                <td>${doc.phone}</td>
                <td>${doc.address}</td>
                <td>${doc.balance}</td>
                <td>${doc.notes}</td>
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

// Fetch customers data and renders it in the table
const fetchAndRenderCustomers = async () => {
  const customers = await window.dbAPI.getAllData("Customer");
  renderCustomersTable(customers);
};

// Event Handlers =====

customerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = collectFormData(customerForm);
  console.log(data);
  const res = await window.dbAPI.createDoc({
    modelName: "Customer",
    data,
  });
  if (!res.success) {
    viewMessage("حدث خطأ أثناء الاضافة");
  }
  customerForm.reset();
  viewMessage("تمت الاضافة بنجاح");
  fetchAndRenderCustomers();
});

fetchAndRenderCustomers();
