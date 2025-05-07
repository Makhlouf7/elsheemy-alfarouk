// Array to store cash-out records
let cashOutRecords = [];

// DOM Elements
const form = document.getElementById("cash-out-form");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const referenceInput = document.getElementById("reference");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-cash-out");
const updateButton = document.getElementById("update-cash-out");
const searchInput = document.getElementById("search-cash-out");
const cashOutTableBody = document.getElementById("cash-out-table-body");
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

// Add new cash-out record
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

  // Validate category
  if (!categoryInput.value) {
    alert("الرجاء اختيار فئة المنصرف");
    return;
  }

  // Validate description
  if (!descriptionInput.value.trim()) {
    alert("الرجاء إدخال وصف للمنصرف");
    return;
  }

  // Validate reference
  if (!referenceInput.value.trim()) {
    alert("الرجاء إدخال مرجع للمنصرف");
    return;
  }

  // Create new record
  const newRecord = {
    id: Date.now(),
    date: dateInput.value,
    amount: amount,
    category: categoryInput.value,
    description: descriptionInput.value.trim(),
    reference: referenceInput.value.trim(),
  };

  // Add to records array
  cashOutRecords.push(newRecord);

  // Update table
  updateCashOutTable();

  // Reset form
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Update cash-out table
function updateCashOutTable() {
  cashOutTableBody.innerHTML = "";
  let totalAmount = 0;

  cashOutRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${formatCurrency(record.amount)}</td>
            <td>${getCategoryName(record.category)}</td>
            <td>${record.description}</td>
            <td>${record.reference}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editRecord(${record.id
      })">
                        <span class="icon icon-edit"></span>
                    </button>
                    <button class="btn btn-danger" onclick="deleteRecord(${record.id
      })">
                        <span class="icon icon-trash"></span>
                    </button>
                </div>
            </td>
        `;
    cashOutTableBody.appendChild(row);
    totalAmount += record.amount;
  });

  // Update total amount display
  totalAmountElement.innerHTML = `
        <div class="total-amount-container">
            <span class="total-label">إجمالي المنصرف:</span>
            <span class="total-value">${formatCurrency(totalAmount)}</span>
        </div>
    `;
}

// Edit record
function editRecord(id) {
  const record = cashOutRecords.find((r) => r.id === id);
  if (record) {
    dateInput.value = record.date;
    amountInput.value = record.amount;
    categoryInput.value = record.category;
    descriptionInput.value = record.description;
    referenceInput.value = record.reference;

    // Remove the record from the list
    cashOutRecords = cashOutRecords.filter((r) => r.id !== id);
    updateCashOutTable();
  }
}

// Delete record
function deleteRecord(id) {
  if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
    cashOutRecords = cashOutRecords.filter((r) => r.id !== id);
    updateCashOutTable();
  }
}

// Format date to Gregorian format
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Format as DD/MM/YYYY
  return `${day}/${month}/${year}`;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}

// Get category name in Arabic
function getCategoryName(category) {
  const categories = {
    suppliers: "موردين",
    employees: "عمال وموظفين",
    expenses: "مصروفات",
    other: "أخرى",
  };
  return categories[category] || category;
}

// Search records
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRecords = cashOutRecords.filter(
    (record) =>
      formatDate(record.date).includes(searchTerm) ||
      formatCurrency(record.amount).includes(searchTerm) ||
      getCategoryName(record.category).toLowerCase().includes(searchTerm) ||
      record.description.toLowerCase().includes(searchTerm) ||
      record.reference.toLowerCase().includes(searchTerm)
  );

  cashOutTableBody.innerHTML = "";
  let totalAmount = 0;

  filteredRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${formatCurrency(record.amount)}</td>
            <td>${getCategoryName(record.category)}</td>
            <td>${record.description}</td>
            <td>${record.reference}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editRecord(${record.id
      })">
                        <span class="icon icon-edit"></span>
                    </button>
                    <button class="btn btn-danger" onclick="deleteRecord(${record.id
      })">
                        <span class="icon icon-trash"></span>
                    </button>
                </div>
            </td>
        `;
    cashOutTableBody.appendChild(row);
    totalAmount += record.amount;
  });

  // Update total amount display
  totalAmountElement.innerHTML = `
        <div class="total-amount-container">
            <span class="total-label">إجمالي المنصرف:</span>
            <span class="total-value">${formatCurrency(totalAmount)}</span>
        </div>
    `;
});

// Update button
updateButton.addEventListener("click", () => {
  updateCashOutTable();
});

// Initialize the page
updateCashOutTable();
