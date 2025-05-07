// Array to store suppliers
let suppliers = [];

// Sample data for testing
const sampleSuppliers = [
  {
    id: 1,
    name: "شركة الأمل للتوريدات",
    phone: "0123456789",
    address: "شارع النصر - القاهرة",
    balance: 5000,
    notes: "مورد رئيسي للمواد الخام",
  },
  {
    id: 2,
    name: "مؤسسة النجاح للتجارة",
    phone: "0112345678",
    address: "شارع الحرية - الإسكندرية",
    balance: 3000,
    notes: "مورد للمواد المكتبية",
  },
];

// Initialize suppliers with sample data
suppliers = [...sampleSuppliers];

// DOM Elements
const form = document.getElementById("supplier-form");
const supplierNameInput = document.getElementById("supplier-name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const balanceInput = document.getElementById("balance");
const notesInput = document.getElementById("notes");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-supplier");
const updateButton = document.getElementById("update-suppliers");
const searchInput = document.getElementById("search-supplier");
const suppliersTableBody = document.getElementById("suppliers-table-body");

// Clear form fields
clearButton.addEventListener("click", () => {
  form.reset();
});

// Add new supplier
addButton.addEventListener("click", () => {
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  const newSupplier = {
    id: suppliers.length + 1,
    name: supplierNameInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    balance: parseFloat(balanceInput.value),
    notes: notesInput.value,
  };

  suppliers.push(newSupplier);
  updateSuppliersTable();
  form.reset();
});

// Update suppliers table
function updateSuppliersTable() {
  suppliersTableBody.innerHTML = "";

  suppliers.forEach((supplier) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.address}</td>
            <td>${formatCurrency(supplier.balance)}</td>
            <td>${supplier.notes || "-"}</td>
            <td>
                <div class="action-buttons">
                    <a href="../supplier-profile/index.html?id=${supplier.id}" class="btn btn-info">
                        <span class="icon icon-eye"></span>
                    </a>
                    <button class="btn btn-primary" onclick="editSupplier(${supplier.id
      })">
                        <span class="icon icon-edit"></span>
                    </button>
                    <button class="btn btn-danger" onclick="deleteSupplier(${supplier.id
      })">
                        <span class="icon icon-trash"></span>
                    </button>
                </div>
            </td>
        `;
    suppliersTableBody.appendChild(row);
  });
}

// Edit supplier - redirect to edit page
function editSupplier(id) {
  // Redirect to the edit supplier page with the supplier ID
  window.location.href = `../edit-supplier/index.html?id=${id}`;
}

// Delete supplier
function deleteSupplier(id) {
  if (confirm("هل أنت متأكد من حذف هذا المورد؟")) {
    suppliers = suppliers.filter((s) => s.id !== id);
    updateSuppliersTable();
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(amount);
}

// Search suppliers
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.phone.includes(searchTerm) ||
      supplier.address.toLowerCase().includes(searchTerm)
  );

  suppliersTableBody.innerHTML = "";
  filteredSuppliers.forEach((supplier) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.address}</td>
            <td>${formatCurrency(supplier.balance)}</td>
            <td>${supplier.notes || "-"}</td>
            <td>
                <div class="action-buttons">
                    <a href="../supplier-profile/index.html?id=${supplier.id}" class="btn btn-info">
                        <span class="icon icon-eye"></span>
                    </a>
                    <button class="btn btn-primary" onclick="editSupplier(${supplier.id
      })">
                        <span class="icon icon-edit"></span>
                    </button>
                    <button class="btn btn-danger" onclick="deleteSupplier(${supplier.id
      })">
                        <span class="icon icon-trash"></span>
                    </button>
                </div>
            </td>
        `;
    suppliersTableBody.appendChild(row);
  });
});

// Update suppliers button
updateButton.addEventListener("click", () => {
  updateSuppliersTable();
});
// Initialize the page
updateSuppliersTable();
