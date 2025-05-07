// DOM Elements
const supplierInfoContainer = document.getElementById("supplier-info");
const transactionsTableBody = document.getElementById("transactions-table-body");
const productsTableBody = document.getElementById("products-table-body");
const totalAmountElement = document.getElementById("total-amount");

// Get supplier ID from URL
const urlParams = new URLSearchParams(window.location.search);
const supplierId = parseInt(urlParams.get("id"));

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

// Sample transactions data
const transactions = [
  {
    id: 1,
    supplierId: 1,
    date: "2023-01-10",
    type: "purchase",
    amount: -5000,
    description: "شراء مواد خام",
    reference: "PUR-2023-01",
  },
  {
    id: 2,
    supplierId: 1,
    date: "2023-01-15",
    type: "payment",
    amount: 3000,
    description: "دفعة جزئية",
    reference: "PAY-2023-01",
  },
  {
    id: 3,
    supplierId: 1,
    date: "2023-02-05",
    type: "purchase",
    amount: -2500,
    description: "شراء مواد خام إضافية",
    reference: "PUR-2023-02",
  },
  {
    id: 4,
    supplierId: 2,
    date: "2023-01-12",
    type: "purchase",
    amount: -3000,
    description: "شراء مواد مكتبية",
    reference: "PUR-2023-03",
  },
  {
    id: 5,
    supplierId: 2,
    date: "2023-01-20",
    type: "payment",
    amount: 1500,
    description: "دفعة جزئية",
    reference: "PAY-2023-02",
  },
];

// Sample products data
const products = [
  {
    id: 1,
    supplierId: 1,
    name: "خامة قطن",
    quantity: 500,
    price: 50,
    date: "2023-01-10",
    notes: "جودة ممتازة",
  },
  {
    id: 2,
    supplierId: 1,
    name: "خامة بوليستر",
    quantity: 300,
    price: 40,
    date: "2023-01-10",
    notes: "",
  },
  {
    id: 3,
    supplierId: 1,
    name: "خامة قطن",
    quantity: 200,
    price: 50,
    date: "2023-02-05",
    notes: "طلبية إضافية",
  },
  {
    id: 4,
    supplierId: 2,
    name: "أقلام",
    quantity: 100,
    price: 5,
    date: "2023-01-12",
    notes: "",
  },
  {
    id: 5,
    supplierId: 2,
    name: "دفاتر",
    quantity: 50,
    price: 10,
    date: "2023-01-12",
    notes: "",
  },
];

// Load supplier data
function loadSupplierData() {
  const supplier = suppliers.find((s) => s.id === supplierId);

  if (!supplier) {
    supplierInfoContainer.innerHTML = `
            <div class="error-message">
                <p>لم يتم العثور على المورد</p>
                <a href="../suppliers/index.html" class="btn btn-primary">العودة لقائمة الموردين</a>
            </div>
        `;
    return;
  }

  // Update page title
  document.title = `بروفايل المورد - ${supplier.name}`;

  // Display supplier info
  supplierInfoContainer.innerHTML = `
        <div class="supplier-header">
            <div class="supplier-avatar">
                <span class="icon icon-truck"></span>
            </div>
            <div>
                <h1 class="supplier-name">${supplier.name}</h1>
                <p class="supplier-type">${supplier.type}</p>
            </div>
        </div>
        <div class="supplier-info-item">
            <h3>رقم الهاتف</h3>
            <p>${supplier.phone}</p>
        </div>
        <div class="supplier-info-item">
            <h3>العنوان</h3>
            <p>${supplier.address}</p>
        </div>
        <div class="supplier-info-item">
            <h3>الشخص المسؤول</h3>
            <p>${supplier.contactPerson}</p>
        </div>
        <div class="supplier-info-item">
            <h3>البريد الإلكتروني</h3>
            <p>${supplier.email}</p>
        </div>
        <div class="supplier-info-item">
            <h3>الرصيد</h3>
            <p>${formatCurrency(supplier.balance)}</p>
        </div>
        <div class="supplier-info-item">
            <h3>ملاحظات</h3>
            <p>${supplier.notes || "لا توجد ملاحظات"}</p>
        </div>
    `;

  // Load transactions
  loadTransactions();

  // Load products
  loadProducts();
}

// Load transactions
function loadTransactions() {
  const supplierTransactions = transactions.filter(
    (t) => t.supplierId === supplierId
  );

  if (supplierTransactions.length === 0) {
    transactionsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">لا توجد معاملات</td>
            </tr>
        `;
    totalAmountElement.textContent = "";
    return;
  }

  transactionsTableBody.innerHTML = "";
  let totalAmount = 0;

  supplierTransactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${getTransactionTypeName(transaction.type)}</td>
            <td class="${
              transaction.amount < 0 ? "negative-amount" : "positive-amount"
            }">${formatCurrency(transaction.amount)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.reference}</td>
        `;
    transactionsTableBody.appendChild(row);
    totalAmount += transaction.amount;
  });

  totalAmountElement.innerHTML = `
        <div class="total-amount-container">
            <span class="total-label">إجمالي المعاملات:</span>
            <span class="total-value">${formatCurrency(totalAmount)}</span>
        </div>
    `;
}

// Load products
function loadProducts() {
  const supplierProducts = products.filter((p) => p.supplierId === supplierId);

  if (supplierProducts.length === 0) {
    productsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">لا توجد منتجات</td>
            </tr>
        `;
    return;
  }

  productsTableBody.innerHTML = "";

  supplierProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatDate(product.date)}</td>
            <td>${product.notes || "-"}</td>
        `;
    productsTableBody.appendChild(row);
  });
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

// Get transaction type name in Arabic
function getTransactionTypeName(type) {
  const types = {
    purchase: "شراء",
    payment: "دفع",
    return: "مرتجع",
    discount: "خصم",
  };
  return types[type] || type;
}

// Initialize the page
loadSupplierData();
