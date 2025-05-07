// DOM Elements
const form = document.getElementById("edit-supplier-form");
const supplierIdInput = document.getElementById("supplier-id");
const supplierNameInput = document.getElementById("supplier-name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const balanceInput = document.getElementById("balance");
const typeInput = document.getElementById("type");
const contactPersonInput = document.getElementById("contact-person");
const emailInput = document.getElementById("email");
const notesInput = document.getElementById("notes");
const clearButton = document.getElementById("clear-fields");
const saveButton = document.getElementById("save-supplier");

// Sample data - in a real app, this would come from a database
const suppliers = [
  {
    id: 1,
    name: "شركة الأمل للتوريدات",
    phone: "0123456789",
    address: "شارع النصر - القاهرة",
    balance: 5000,
    notes: "مورد رئيسي للمواد الخام",
    type: "مواد خام",
    contactPerson: "أحمد محمد",
    email: "info@alamal.com",
  },
  {
    id: 2,
    name: "مؤسسة النجاح للتجارة",
    phone: "0112345678",
    address: "شارع الحرية - الإسكندرية",
    balance: 3000,
    notes: "مورد للمواد المكتبية",
    type: "مواد مكتبية",
    contactPerson: "محمود علي",
    email: "info@alnagah.com",
  },
];

// Get supplier ID from URL
const urlParams = new URLSearchParams(window.location.search);
const supplierId = parseInt(urlParams.get("id"));

// Load supplier data
function loadSupplierData() {
  const supplier = suppliers.find((s) => s.id === supplierId);

  if (!supplier) {
    alert("لم يتم العثور على المورد");
    window.location.href = "../suppliers/index.html";
    return;
  }

  // Fill form with supplier data
  supplierIdInput.value = supplier.id;
  supplierNameInput.value = supplier.name;
  phoneInput.value = supplier.phone;
  addressInput.value = supplier.address;
  balanceInput.value = supplier.balance;
  typeInput.value = supplier.type || "";
  contactPersonInput.value = supplier.contactPerson || "";
  emailInput.value = supplier.email || "";
  notesInput.value = supplier.notes || "";
}

// Clear form fields
clearButton.addEventListener("click", () => {
  // Reload the original data instead of clearing completely
  loadSupplierData();
});

// Save supplier changes
saveButton.addEventListener("click", () => {
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  // In a real app, this would update the database
  // For now, we'll just show an alert and redirect back to the suppliers page
  alert("تم حفظ التغييرات بنجاح");
  window.location.href = "../suppliers/index.html";
});

// Initialize the page
loadSupplierData();
