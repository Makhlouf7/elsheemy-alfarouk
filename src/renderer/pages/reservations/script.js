// Array to store reservations records
let reservationsRecords = [];

// DOM Elements
const form = document.getElementById("reservations-form");
const dateInput = document.getElementById("date");
const customerInput = document.getElementById("customer");
const productInput = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const totalInput = document.getElementById("total");
const advanceInput = document.getElementById("advance");
const remainingInput = document.getElementById("remaining");
const notesInput = document.getElementById("notes");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-reservation");
const updateButton = document.getElementById("update-reservations");
const searchInput = document.getElementById("search-reservations");
const reservationsTableBody = document.getElementById(
  "reservations-table-body"
);

// Set today's date as default
dateInput.valueAsDate = new Date();

// Calculate total and remaining amount
function calculateAmounts() {
  const quantity = parseFloat(quantityInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const advance = parseFloat(advanceInput.value) || 0;

  const total = quantity * price;
  const remaining = total - advance;

  totalInput.value = total.toFixed(2);
  remainingInput.value = remaining.toFixed(2);
}

// Add event listeners for calculations
quantityInput.addEventListener("input", calculateAmounts);
priceInput.addEventListener("input", calculateAmounts);
advanceInput.addEventListener("input", calculateAmounts);

// Clear form fields
clearButton.addEventListener("click", () => {
  form.reset();
  dateInput.valueAsDate = new Date();
  totalInput.value = "";
  remainingInput.value = "";
});

// Add new reservation
addButton.addEventListener("click", () => {
  // Validate form
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  // Validate customer
  if (!customerInput.value) {
    alert("الرجاء اختيار العميل");
    return;
  }

  // Validate product
  if (!productInput.value) {
    alert("الرجاء اختيار المنتج");
    return;
  }

  // Validate quantity
  if (quantityInput.value <= 0) {
    alert("الكمية يجب أن تكون أكبر من صفر");
    return;
  }

  // Validate price
  if (priceInput.value <= 0) {
    alert("السعر يجب أن يكون أكبر من صفر");
    return;
  }

  // Validate advance
  if (advanceInput.value < 0) {
    alert("المبلغ المقدم يجب أن يكون صفر أو أكبر");
    return;
  }

  // Create new reservation record
  const newRecord = {
    id: Date.now(),
    date: dateInput.value,
    customer: customerInput.value,
    product: productInput.value,
    quantity: parseFloat(quantityInput.value),
    price: parseFloat(priceInput.value),
    total: parseFloat(totalInput.value),
    advance: parseFloat(advanceInput.value),
    remaining: parseFloat(remainingInput.value),
    notes: notesInput.value.trim(),
  };

  // Add to records array
  reservationsRecords.push(newRecord);

  // Update table
  updateReservationsTable();

  // Reset form
  form.reset();
  dateInput.valueAsDate = new Date();
  totalInput.value = "";
  remainingInput.value = "";
});

// Update reservations table
function updateReservationsTable() {
  reservationsTableBody.innerHTML = "";

  reservationsRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${getCustomerName(record.customer)}</td>
            <td>${getProductName(record.product)}</td>
            <td>${record.quantity}</td>
            <td>${formatCurrency(record.price)}</td>
            <td>${formatCurrency(record.total)}</td>
            <td>${formatCurrency(record.advance)}</td>
            <td>${formatCurrency(record.remaining)}</td>
            <td>${record.notes || "-"}</td>
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
    reservationsTableBody.appendChild(row);
  });
}

// Edit record
function editRecord(id) {
  const record = reservationsRecords.find((r) => r.id === id);
  if (record) {
    dateInput.value = record.date;
    customerInput.value = record.customer;
    productInput.value = record.product;
    quantityInput.value = record.quantity;
    priceInput.value = record.price;
    advanceInput.value = record.advance;
    notesInput.value = record.notes;

    // Calculate total and remaining
    calculateAmounts();

    // Remove the record from the list
    reservationsRecords = reservationsRecords.filter((r) => r.id !== id);
    updateReservationsTable();
  }
}

// Delete record
function deleteRecord(id) {
  if (confirm("هل أنت متأكد من حذف هذا الحجز؟")) {
    reservationsRecords = reservationsRecords.filter((r) => r.id !== id);
    updateReservationsTable();
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

// Get customer name
function getCustomerName(customerId) {
  const customers = {
    customer1: "أحمد محمد",
    customer2: "علي محمود",
    customer3: "سارة أحمد",
  };
  return customers[customerId] || customerId;
}

// Get product name
function getProductName(productId) {
  const products = {
    product1: "منتج 1",
    product2: "منتج 2",
    product3: "منتج 3",
  };
  return products[productId] || productId;
}

// Search records
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRecords = reservationsRecords.filter(
    (record) =>
      formatDate(record.date).includes(searchTerm) ||
      getCustomerName(record.customer).toLowerCase().includes(searchTerm) ||
      getProductName(record.product).toLowerCase().includes(searchTerm) ||
      record.quantity.toString().includes(searchTerm) ||
      record.price.toString().includes(searchTerm) ||
      record.total.toString().includes(searchTerm) ||
      record.advance.toString().includes(searchTerm) ||
      record.remaining.toString().includes(searchTerm) ||
      (record.notes && record.notes.toLowerCase().includes(searchTerm))
  );

  reservationsTableBody.innerHTML = "";

  filteredRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${getCustomerName(record.customer)}</td>
            <td>${getProductName(record.product)}</td>
            <td>${record.quantity}</td>
            <td>${formatCurrency(record.price)}</td>
            <td>${formatCurrency(record.total)}</td>
            <td>${formatCurrency(record.advance)}</td>
            <td>${formatCurrency(record.remaining)}</td>
            <td>${record.notes || "-"}</td>
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
    reservationsTableBody.appendChild(row);
  });
});

// Update button
updateButton.addEventListener("click", () => {
  updateReservationsTable();
});
// Initialize the page
updateReservationsTable();
