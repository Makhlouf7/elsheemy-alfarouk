// DOM Elements
const customerIdInput = document.getElementById("customer-id");
const customerNameInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const balanceInput = document.getElementById("balance");
const notesInput = document.getElementById("notes");
const cancelButton = document.getElementById("cancel-edit");
const saveButton = document.getElementById("save-customer");

// Get customer ID from URL
const urlParams = new URLSearchParams(window.location.search);
const customerId = parseInt(urlParams.get("id"));

// Sample customer data (in a real app, this would come from a database)
const customers = [
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

// Load customer data
function loadCustomerData() {
  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    alert("لم يتم العثور على العميل");
    window.location.href = "../customers/index.html";
    return;
  }

  // Update page title
  document.title = `تعديل بيانات العميل - ${customer.name}`;

  // Fill form with customer data
  customerIdInput.value = customer.id;
  customerNameInput.value = customer.name;
  phoneInput.value = customer.phone;
  addressInput.value = customer.address;
  balanceInput.value = customer.balance;
  notesInput.value = customer.notes || "";
}

// Save customer data
function saveCustomerData() {
  // Validate form
  if (!customerNameInput.value.trim()) {
    alert("الرجاء إدخال اسم العميل");
    customerNameInput.focus();
    return;
  }

  if (!phoneInput.value.trim()) {
    alert("الرجاء إدخال رقم الهاتف");
    phoneInput.focus();
    return;
  }

  if (!addressInput.value.trim()) {
    alert("الرجاء إدخال العنوان");
    addressInput.focus();
    return;
  }

  if (!balanceInput.value || isNaN(parseFloat(balanceInput.value))) {
    alert("الرجاء إدخال رصيد صحيح");
    balanceInput.focus();
    return;
  }

  // In a real app, this would update the database
  // For this demo, we'll just show a success message and redirect
  alert("تم حفظ بيانات العميل بنجاح");
  window.location.href = "../customers/index.html";
}

// Cancel edit and return to customers list
function cancelEdit() {
  if (confirm("هل أنت متأكد من إلغاء التعديلات؟")) {
    window.location.href = "../customers/index.html";
  }
}

// Event listeners
saveButton.addEventListener("click", saveCustomerData);
cancelButton.addEventListener("click", cancelEdit);

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  if (!customerId) {
    alert("خطأ: لم يتم تحديد معرف العميل");
    window.location.href = "../customers/index.html";
    return;
  }

  loadCustomerData();
});
