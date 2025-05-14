// DOM Elements
const customerInfoElement = document.getElementById("customer-info");
const transactionsTableBody = document.getElementById("transactions-table-body");
const totalAmountElement = document.getElementById("total-amount");

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

// Sample transactions data (in a real app, this would come from a database)
const transactions = [
  {
    id: 1,
    customerId: 1,
    date: "2023-05-15",
    type: "payment",
    amount: 2000,
    description: "دفعة مقدمة",
    reference: "INV-001",
  },
  {
    id: 2,
    customerId: 1,
    date: "2023-05-20",
    type: "purchase",
    amount: -1500,
    description: "شراء منتجات",
    reference: "PO-001",
  },
  {
    id: 3,
    customerId: 2,
    date: "2023-05-18",
    type: "payment",
    amount: 1000,
    description: "دفعة مقدمة",
    reference: "INV-002",
  },
];

// Load customer info
function loadCustomerInfo() {
  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    customerInfoElement.innerHTML = "<p>لم يتم العثور على العميل</p>";
    return;
  }

  // Update page title
  document.title = `بروفايل العميل - ${customer.name}`;

  // Display customer info
  customerInfoElement.innerHTML = `
    <div class="info-item">
      <span class="info-label">اسم العميل:</span>
      <span class="info-value">${customer.name}</span>
    </div>
    <div class="info-item">
      <span class="info-label">رقم الهاتف:</span>
      <span class="info-value">${customer.phone}</span>
    </div>
    <div class="info-item">
      <span class="info-label">العنوان:</span>
      <span class="info-value">${customer.address}</span>
    </div>
    <div class="info-item">
      <span class="info-label">الرصيد:</span>
      <span class="info-value">${formatCurrency(customer.balance)}</span>
    </div>
    <div class="info-item">
      <span class="info-label">ملاحظات:</span>
      <span class="info-value">${customer.notes || "-"}</span>
    </div>
  `;
}

// Load customer transactions
function loadCustomerTransactions() {
  const customerTransactions = transactions.filter(
    (t) => t.customerId === customerId
  );

  if (customerTransactions.length === 0) {
    transactionsTableBody.innerHTML =
      "<tr><td colspan='5'>لا توجد معاملات لهذا العميل</td></tr>";
    totalAmountElement.innerHTML = "";
    return;
  }

  transactionsTableBody.innerHTML = "";
  let totalAmount = 0;

  customerTransactions.forEach((transaction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDate(transaction.date)}</td>
      <td>${getTransactionType(transaction.type)}</td>
      <td class="${
        transaction.amount >= 0 ? "positive-amount" : "negative-amount"
      }">${formatCurrency(transaction.amount)}</td>
      <td>${transaction.description}</td>
      <td>${transaction.reference}</td>
    `;
    transactionsTableBody.appendChild(row);
    totalAmount += transaction.amount;
  });

  // Update total amount display
  totalAmountElement.innerHTML = `
    <div class="total-amount-container">
      <span class="total-label">إجمالي المعاملات:</span>
      <span class="total-value ${
        totalAmount >= 0 ? "positive-amount" : "negative-amount"
      }">${formatCurrency(totalAmount)}</span>
    </div>
  `;
}

// Format date (Gregorian calendar)
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

// Get transaction type in Arabic
function getTransactionType(type) {
  const types = {
    payment: "دفعة",
    purchase: "مشتريات",
    refund: "استرداد",
    credit: "رصيد دائن",
    debit: "رصيد مدين",
  };
  return types[type] || type;
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  if (!customerId) {
    customerInfoElement.innerHTML =
      "<p>خطأ: لم يتم تحديد معرف العميل</p>";
    return;
  }

  loadCustomerInfo();
  loadCustomerTransactions();
});
