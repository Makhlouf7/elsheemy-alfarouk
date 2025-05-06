// Array to store customers
let customers = [];

// Sample data for testing
const sampleCustomers = [
  {
    id: 1,
    name: "أحمد محمد",
    phone: "0123456789",
    address: "شارع النصر - القاهرة",
    balance: 5000,
    notes: "عميل دائم",
  },
  {
    id: 2,
    name: "محمد علي",
    phone: "0112345678",
    address: "شارع الحرية - الإسكندرية",
    balance: 3000,
    notes: "عميل جديد",
  },
];

// Initialize customers with sample data
customers = [...sampleCustomers];

// DOM Elements
const form = document.getElementById("customer-form");
const customerNameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const balanceInput = document.getElementById("balance");
const notesInput = document.getElementById("notes");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-customer");
const updateButton = document.getElementById("update-customers");
const searchInput = document.getElementById("search-customer");
const customersTableBody = document.getElementById("customers-table-body");

// Clear form fields
clearButton.addEventListener("click", () => {
  form.reset();
});

// Add new customer
addButton.addEventListener("click", () => {
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  const newCustomer = {
    id: customers.length + 1,
    name: customerNameInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    balance: parseFloat(balanceInput.value),
    notes: notesInput.value,
  };

  customers.push(newCustomer);
  updateCustomersTable();
  form.reset();
});

// Update customers table
function updateCustomersTable() {
  customersTableBody.innerHTML = "";

  customers.forEach((customer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${formatCurrency(customer.balance)}</td>
            <td>${customer.notes || "-"}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editCustomer(${
                      customer.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteCustomer(${
                      customer.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    customersTableBody.appendChild(row);
  });
}

// Edit customer
function editCustomer(id) {
  const customer = customers.find((c) => c.id === id);
  if (customer) {
    customerNameInput.value = customer.name;
    phoneInput.value = customer.phone;
    addressInput.value = customer.address;
    balanceInput.value = customer.balance;
    notesInput.value = customer.notes;

    // Remove the customer from the list
    customers = customers.filter((c) => c.id !== id);
    updateCustomersTable();
  }
}

// Delete customer
function deleteCustomer(id) {
  if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
    customers = customers.filter((c) => c.id !== id);
    updateCustomersTable();
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount);
}

// Search customers
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm)
  );

  customersTableBody.innerHTML = "";
  filteredCustomers.forEach((customer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${formatCurrency(customer.balance)}</td>
            <td>${customer.notes || "-"}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editCustomer(${
                      customer.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteCustomer(${
                      customer.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    customersTableBody.appendChild(row);
  });
});

// Update customers button
updateButton.addEventListener("click", () => {
  updateCustomersTable();
});

// Initialize the page
updateCustomersTable();
