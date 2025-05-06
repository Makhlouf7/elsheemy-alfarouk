// Array to store transactions
let transactions = [];

// DOM Elements
const form = document.getElementById("employees-cash-form");
const dateInput = document.getElementById("date");
const employeeInput = document.getElementById("employee");
const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const referenceInput = document.getElementById("reference");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-transaction");
const updateButton = document.getElementById("update-transactions");
const searchInput = document.getElementById("search-transactions");
const transactionsTableBody = document.getElementById(
  "transactions-table-body"
);
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

// Add new transaction
addButton.addEventListener("click", () => {
  // Validate form
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  // Validate employee
  if (!employeeInput.value) {
    alert("الرجاء اختيار الموظف/العامل");
    return;
  }

  // Validate type
  if (!typeInput.value) {
    alert("الرجاء اختيار نوع المعاملة");
    return;
  }

  // Validate amount
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    alert("الرجاء إدخال مبلغ صحيح أكبر من صفر");
    return;
  }

  // Validate description
  if (!descriptionInput.value.trim()) {
    alert("الرجاء إدخال وصف للمعاملة");
    return;
  }

  // Validate reference
  if (!referenceInput.value.trim()) {
    alert("الرجاء إدخال مرجع للمعاملة");
    return;
  }

  // Create new transaction
  const newTransaction = {
    id: Date.now(),
    date: dateInput.value,
    employee: employeeInput.value,
    type: typeInput.value,
    amount: amount,
    description: descriptionInput.value.trim(),
    reference: referenceInput.value.trim(),
  };

  // Add to transactions array
  transactions.push(newTransaction);

  // Update table
  updateTransactionsTable();

  // Reset form
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Update transactions table
function updateTransactionsTable() {
  transactionsTableBody.innerHTML = "";
  let totalAmount = 0;

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${getEmployeeName(transaction.employee)}</td>
            <td>${getTransactionType(transaction.type)}</td>
            <td>${formatCurrency(transaction.amount)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.reference}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editTransaction(${
                      transaction.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteTransaction(${
                      transaction.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    transactionsTableBody.appendChild(row);
    totalAmount += transaction.amount;
  });

  // Update total amount display
  totalAmountElement.innerHTML = `
        <div class="total-amount-container">
            <span class="total-label">إجمالي المعاملات:</span>
            <span class="total-value">${formatCurrency(totalAmount)}</span>
        </div>
    `;
}

// Edit transaction
function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (transaction) {
    dateInput.value = transaction.date;
    employeeInput.value = transaction.employee;
    typeInput.value = transaction.type;
    amountInput.value = transaction.amount;
    descriptionInput.value = transaction.description;
    referenceInput.value = transaction.reference;

    // Remove the transaction from the list
    transactions = transactions.filter((t) => t.id !== id);
    updateTransactionsTable();
  }
}

// Delete transaction
function deleteTransaction(id) {
  if (confirm("هل أنت متأكد من حذف هذه المعاملة؟")) {
    transactions = transactions.filter((t) => t.id !== id);
    updateTransactionsTable();
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

// Get employee name
function getEmployeeName(employeeId) {
  const employees = {
    employee1: "محمد أحمد",
    employee2: "علي محمود",
    employee3: "أحمد سعيد",
  };
  return employees[employeeId] || employeeId;
}

// Get transaction type in Arabic
function getTransactionType(type) {
  const types = {
    salary: "راتب",
    advance: "سلفة",
    bonus: "مكافأة",
    deduction: "خصم",
  };
  return types[type] || type;
}

// Search transactions
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredTransactions = transactions.filter(
    (transaction) =>
      formatDate(transaction.date).includes(searchTerm) ||
      getEmployeeName(transaction.employee)
        .toLowerCase()
        .includes(searchTerm) ||
      getTransactionType(transaction.type).toLowerCase().includes(searchTerm) ||
      formatCurrency(transaction.amount).includes(searchTerm) ||
      transaction.description.toLowerCase().includes(searchTerm) ||
      transaction.reference.toLowerCase().includes(searchTerm)
  );

  transactionsTableBody.innerHTML = "";
  let totalAmount = 0;

  filteredTransactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${getEmployeeName(transaction.employee)}</td>
            <td>${getTransactionType(transaction.type)}</td>
            <td>${formatCurrency(transaction.amount)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.reference}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editTransaction(${
                      transaction.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteTransaction(${
                      transaction.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    transactionsTableBody.appendChild(row);
    totalAmount += transaction.amount;
  });

  // Update total amount display
  totalAmountElement.innerHTML = `
        <div class="total-amount-container">
            <span class="total-label">إجمالي المعاملات:</span>
            <span class="total-value">${formatCurrency(totalAmount)}</span>
        </div>
    `;
});

// Update button
updateButton.addEventListener("click", () => {
  updateTransactionsTable();
});
// Initialize the page
updateTransactionsTable();
