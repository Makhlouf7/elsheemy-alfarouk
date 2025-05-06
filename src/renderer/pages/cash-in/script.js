// Array to store cash-in records
let cashInRecords = [];

// DOM Elements
const form = document.getElementById("cash-in-form");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const sourceInput = document.getElementById("source");
const descriptionInput = document.getElementById("description");
const referenceInput = document.getElementById("reference");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-cash-in");
const updateButton = document.getElementById("update-cash-in");
const searchInput = document.getElementById("search-cash-in");
const cashInTableBody = document.getElementById("cash-in-table-body");
const totalAmountElement = document.createElement("div");
totalAmountElement.className = "total-amount";
document.querySelector(".table-section").appendChild(totalAmountElement);

// Set today's date as default
dateInput.valueAsDate = new Date();

// Clear form fields
clearButton.addEventListener("click", () => {
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Add new cash-in record
addButton.addEventListener("click", () => {
  // Validate form
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  // Validate amount
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    alert("الرجاء إدخال مبلغ صحيح أكبر من صفر");
    return;
  }

  // Create new record
  const newRecord = {
    id: Date.now(),
    date: dateInput.value,
    amount: amount,
    source: sourceInput.value,
    description: descriptionInput.value,
    reference: referenceInput.value,
  };

  // Add to records array
  cashInRecords.push(newRecord);

  // Update table
  updateCashInTable();

  // Reset form
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Update cash-in table
function updateCashInTable() {
  cashInTableBody.innerHTML = "";
  let totalAmount = 0;

  cashInRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${formatCurrency(record.amount)}</td>
            <td>${getSourceName(record.source)}</td>
            <td>${record.description}</td>
            <td>${record.reference}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editRecord(${
                      record.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteRecord(${
                      record.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    cashInTableBody.appendChild(row);
    totalAmount += record.amount;
  });

  // Update total amount display
  totalAmountElement.innerHTML = `
        <div class="total-amount-container">
            <span class="total-label">إجمالي الوارد:</span>
            <span class="total-value">${formatCurrency(totalAmount)}</span>
        </div>
    `;
}

// Edit record
function editRecord(id) {
  const record = cashInRecords.find((r) => r.id === id);
  if (record) {
    dateInput.value = record.date;
    amountInput.value = record.amount;
    sourceInput.value = record.source;
    descriptionInput.value = record.description;
    referenceInput.value = record.reference;

    // Remove the record from the list
    cashInRecords = cashInRecords.filter((r) => r.id !== id);
    updateCashInTable();
  }
}

// Delete record
function deleteRecord(id) {
  if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
    cashInRecords = cashInRecords.filter((r) => r.id !== id);
    updateCashInTable();
  }
}

// Format date to Gregorian format
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}

// Get source name in Arabic
function getSourceName(source) {
  const sources = {
    sales: "مبيعات",
    customers: "عملاء",
    other: "أخرى",
  };
  return sources[source] || source;
}

// Search records
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRecords = cashInRecords.filter(
    (record) =>
      formatDate(record.date).includes(searchTerm) ||
      formatCurrency(record.amount).includes(searchTerm) ||
      getSourceName(record.source).toLowerCase().includes(searchTerm) ||
      record.description.toLowerCase().includes(searchTerm) ||
      record.reference.toLowerCase().includes(searchTerm)
  );

  cashInTableBody.innerHTML = "";
  filteredRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${formatCurrency(record.amount)}</td>
            <td>${getSourceName(record.source)}</td>
            <td>${record.description}</td>
            <td>${record.reference}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editRecord(${
                      record.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteRecord(${
                      record.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    cashInTableBody.appendChild(row);
  });
});

// Update button
updateButton.addEventListener("click", () => {
  updateCashInTable();
});

// Initialize the page
updateCashInTable();
