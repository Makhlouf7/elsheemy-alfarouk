// Handle date range selection
document.getElementById("date-range").addEventListener("change", function (e) {
  const customDateRange = document.querySelector(".custom-date-range");
  if (e.target.value === "custom") {
    customDateRange.style.display = "grid";
  } else {
    customDateRange.style.display = "none";
  }
});

// Handle report generation
document
  .getElementById("generate-report")
  .addEventListener("click", function () {
    const reportType = document.getElementById("report-type").value;
    const dateRange = document.getElementById("date-range").value;
    const format = document.getElementById("format").value;

    if (!reportType || !dateRange) {
      alert("الرجاء اختيار نوع التقرير والفترة الزمنية");
      return;
    }

    // Get date range
    let startDate, endDate;
    const today = new Date();

    switch (dateRange) {
      case "today":
        startDate = endDate = today;
        break;
      case "week":
        startDate = new Date(today.setDate(today.getDate() - today.getDay()));
        endDate = new Date(today.setDate(today.getDate() + 6));
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "quarter":
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0);
        break;
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      case "custom":
        startDate = new Date(document.getElementById("start-date").value);
        endDate = new Date(document.getElementById("end-date").value);
        break;
    }

    // Generate report based on type and format
    generateReport(reportType, startDate, endDate, format);
  });

// Initialize data variables
let savedInvoices = [];
let incomingData = [];
let cashInData = [];
let cashOutData = [];

// Function to ensure numeric values are properly parsed for invoices
function parseInvoiceData(invoices) {
  return invoices.map(invoice => {
    // Parse items in each invoice
    const items = Array.isArray(invoice.items) ? invoice.items.map(item => {
      return {
        ...item,
        quantity: parseFloat(item.quantity) || 0,
        shakara: parseFloat(item.shakara) || 0,
        price: parseFloat(item.price) || 0,
        total: parseFloat(item.total) || 0
      };
    }) : [];

    // Parse invoice total
    return {
      ...invoice,
      items,
      totalAmount: parseFloat(invoice.totalAmount) || 0
    };
  });
}

// Function to ensure numeric values are properly parsed for incoming data
function parseIncomingData(items) {
  return items.map(item => {
    return {
      ...item,
      quantity: parseFloat(item.quantity) || 0,
      shakara: parseFloat(item.shakara) || 0,
      priceIn: parseFloat(item.priceIn) || 0,
      priceOut: parseFloat(item.priceOut) || 0
    };
  });
}

// Function to ensure numeric values are properly parsed for cash data
function parseCashData(items) {
  return items.map(item => {
    return {
      ...item,
      amount: parseFloat(item.amount) || 0
    };
  });
}

// Load data from localStorage
try {
  const storedInvoices = localStorage.getItem('savedInvoices');
  if (storedInvoices) {
    savedInvoices = parseInvoiceData(JSON.parse(storedInvoices));
  }

  const storedIncoming = localStorage.getItem('incomingData');
  if (storedIncoming) {
    incomingData = parseIncomingData(JSON.parse(storedIncoming));
  }

  const storedCashIn = localStorage.getItem('cashInData');
  if (storedCashIn) {
    cashInData = parseCashData(JSON.parse(storedCashIn));
  }

  const storedCashOut = localStorage.getItem('cashOutData');
  if (storedCashOut) {
    cashOutData = parseCashData(JSON.parse(storedCashOut));
  }
} catch (error) {
  console.error('Error parsing data from localStorage:', error);
  // Reset to empty arrays if there's an error
  savedInvoices = [];
  incomingData = [];
  cashInData = [];
  cashOutData = [];
}

// Generate report content
function generateReport(type, startDate, endDate, format) {
  const container = document.getElementById("report-container");

  // Clear previous report
  container.innerHTML = "";

  // Create report content
  const reportContent = document.createElement("div");
  reportContent.className = "report-content";

  // Add report title
  const title = document.createElement("h2");
  title.className = "report-title";
  title.textContent = getReportTitle(type);
  reportContent.appendChild(title);

  // Add report summary
  const summary = document.createElement("div");
  summary.className = "report-summary";
  summary.innerHTML = `
        <p>الفترة: ${formatDate(startDate)} - ${formatDate(endDate)}</p>
        <p>تاريخ الإنشاء: ${formatDate(new Date())}</p>
    `;
  reportContent.appendChild(summary);

  // Add report data based on type
  switch (type) {
    case "financial":
      addFinancialReport(reportContent, startDate, endDate);
      break;
    case "sales":
      addSalesReport(reportContent, startDate, endDate);
      break;
    case "inventory":
      addInventoryReport(reportContent);
      break;
    case "employees":
      addEmployeesReport(reportContent, startDate, endDate);
      break;
    case "attendance":
      addAttendanceReport(reportContent, startDate, endDate);
      break;
    case "reservations":
      addReservationsReport(reportContent, startDate, endDate);
      break;
  }

  // Add to container
  container.appendChild(reportContent);

  // Handle format
  if (format === "pdf") {
    // Here you would typically implement PDF generation
    console.log("Generating PDF report...");
  } else if (format === "excel") {
    // Here you would typically implement Excel generation
    console.log("Generating Excel report...");
  }
}

// Helper function to get report title
function getReportTitle(type) {
  const titles = {
    financial: "التقرير المالي",
    sales: "تقرير المبيعات",
    inventory: "تقرير المخزون",
    employees: "تقرير الموظفين",
    attendance: "تقرير الحضور",
    reservations: "تقرير الحجزات",
  };
  return titles[type] || "تقرير";
}

// Helper function to format date
function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Format as DD/MM/YYYY
  return `${day}/${month}/${year}`;
}

// Handle print button
document.getElementById("print-report").addEventListener("click", function () {
  printReport();
});

function printReport() {
  const reportContainer = document.getElementById("report-container");

  if (!reportContainer.querySelector(".report-content")) {
    alert("لا يوجد تقرير للطباعة. الرجاء إنشاء تقرير أولاً.");
    return;
  }

  window.print();
}

// Handle download button
document
  .getElementById("download-report")
  .addEventListener("click", function () {
    // Here you would typically implement the download functionality
    console.log("Downloading report...");
  });

// Sample report generation functions
function addFinancialReport(container, startDate, endDate) {
  // Filter data by date range
  const filteredInvoices = savedInvoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date);
    return invoiceDate >= startDate && invoiceDate <= endDate;
  });

  const filteredIncoming = incomingData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  const filteredCashIn = cashInData ? cashInData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  }) : [];

  const filteredCashOut = cashOutData ? cashOutData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  }) : [];

  // Calculate totals with safety checks
  const invoicesTotal = filteredInvoices.reduce((sum, invoice) => {
    const amount = typeof invoice.totalAmount === 'number' ? invoice.totalAmount : 0;
    return sum + amount;
  }, 0);

  const incomingTotal = filteredIncoming.reduce((sum, item) => {
    const priceIn = typeof item.priceIn === 'number' ? item.priceIn : parseFloat(item.priceIn) || 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity) || 0;
    return sum + (priceIn * quantity);
  }, 0);

  const cashInTotal = filteredCashIn.reduce((sum, item) => {
    const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);

  const cashOutTotal = filteredCashOut.reduce((sum, item) => {
    const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);

  const totalAmount = cashInTotal + invoicesTotal;
  const totalExpenses = cashOutTotal + incomingTotal;
  const netProfit = totalAmount - totalExpenses;

  // Calculate percentages
  const getPercentage = (value, total) => {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100) + '%';
  };

  // Add financial report content
  const content = document.createElement("div");
  content.innerHTML = `
        <div class="report-chart">
            <p>ملخص المعاملات المالية</p>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>نوع المعاملة</th>
                    <th>المبلغ</th>
                    <th>النسبة</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>إجمالي المبيعات</td>
                    <td>${invoicesTotal.toLocaleString('ar-EG')} جنيه</td>
                    <td>${getPercentage(invoicesTotal, totalAmount)}</td>
                </tr>
                <tr>
                    <td>وارد خزنة</td>
                    <td>${cashInTotal.toLocaleString('ar-EG')} جنيه</td>
                    <td>${getPercentage(cashInTotal, totalAmount)}</td>
                </tr>
                <tr>
                    <td>منصرف خزنة</td>
                    <td>${cashOutTotal.toLocaleString('ar-EG')} جنيه</td>
                    <td>${getPercentage(cashOutTotal, totalExpenses)}</td>
                </tr>
                <tr>
                    <td>تكلفة المشتريات</td>
                    <td>${incomingTotal.toLocaleString('ar-EG')} جنيه</td>
                    <td>${getPercentage(incomingTotal, totalExpenses)}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>صافي الربح</th>
                    <th colspan="2">${netProfit.toLocaleString('ar-EG')} جنيه</th>
                </tr>
            </tfoot>
        </table>
    `;
  container.appendChild(content);
}

function addSalesReport(container, startDate, endDate) {
  // Filter invoices by date range
  const filteredInvoices = savedInvoices.filter(invoice => {
    const invoiceDate = new Date(invoice.date);
    return invoiceDate >= startDate && invoiceDate <= endDate;
  });

  // Group items by category
  const itemsByCategory = {};
  let totalSales = 0;

  filteredInvoices.forEach(invoice => {
    if (Array.isArray(invoice.items)) {
      invoice.items.forEach(item => {
        const category = item.category || 'غير محدد';
        if (!itemsByCategory[category]) {
          itemsByCategory[category] = {
            quantity: 0,
            total: 0
          };
        }

        // Safely convert values to numbers
        const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity) || 0;
        const total = typeof item.total === 'number' ? item.total : parseFloat(item.total) || 0;

        itemsByCategory[category].quantity += quantity;
        itemsByCategory[category].total += total;
        totalSales += total;
      });
    }
  });

  // Create table rows
  let tableRows = '';
  Object.keys(itemsByCategory).forEach(category => {
    const item = itemsByCategory[category];
    const percentage = totalSales > 0 ? Math.round((item.total / totalSales) * 100) : 0;

    tableRows += `
      <tr>
        <td>${category}</td>
        <td>${item.quantity}</td>
        <td>${item.total.toLocaleString('ar-EG')} جنيه</td>
        <td>${percentage}%</td>
      </tr>
    `;
  });

  // If no sales data
  if (tableRows === '') {
    tableRows = `
      <tr>
        <td colspan="4">لا توجد مبيعات في هذه الفترة</td>
      </tr>
    `;
  }

  // Add sales report content
  const content = document.createElement("div");
  content.innerHTML = `
        <div class="report-chart">
            <p>ملخص المبيعات</p>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>الصنف</th>
                    <th>الكمية</th>
                    <th>المبلغ</th>
                    <th>النسبة</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="2">إجمالي المبيعات</th>
                    <th colspan="2">${totalSales.toLocaleString('ar-EG')} جنيه</th>
                </tr>
            </tfoot>
        </table>
    `;
  container.appendChild(content);
}

function addInventoryReport(container) {
  // Group incoming items by category and type
  const inventory = {};
  let totalValue = 0;

  incomingData.forEach(item => {
    // Safely get values with defaults
    const category = item.category || 'غير محدد';
    const type = item.type || 'غير محدد';
    const key = `${category}-${type}`;

    // Safely convert values to numbers
    const priceIn = typeof item.priceIn === 'number' ? item.priceIn : parseFloat(item.priceIn) || 0;
    const priceOut = typeof item.priceOut === 'number' ? item.priceOut : parseFloat(item.priceOut) || 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity) || 0;

    if (!inventory[key]) {
      inventory[key] = {
        category,
        type,
        quantity: 0,
        priceIn,
        priceOut,
        totalValue: 0
      };
    }

    inventory[key].quantity += quantity;
    inventory[key].totalValue += priceIn * quantity;
    totalValue += priceIn * quantity;
  });

  // Create table rows
  let tableRows = '';
  Object.values(inventory).forEach(item => {
    const profit = item.priceOut > 0 ? ((item.priceOut - item.priceIn) / item.priceIn * 100).toFixed(1) : 'غير محدد';

    tableRows += `
      <tr>
        <td>${item.category}</td>
        <td>${item.type}</td>
        <td>${item.quantity}</td>
        <td>${item.priceIn.toLocaleString('ar-EG')} جنيه</td>
        <td>${item.priceOut > 0 ? item.priceOut.toLocaleString('ar-EG') + ' جنيه' : 'غير محدد'}</td>
        <td>${profit !== 'غير محدد' ? profit + '%' : 'غير محدد'}</td>
        <td>${item.totalValue.toLocaleString('ar-EG')} جنيه</td>
      </tr>
    `;
  });

  // If no inventory data
  if (tableRows === '') {
    tableRows = `
      <tr>
        <td colspan="7">لا توجد بيانات مخزون</td>
      </tr>
    `;
  }

  // Add inventory report content
  const content = document.createElement("div");
  content.innerHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>الصنف</th>
                    <th>النوع</th>
                    <th>الكمية المتاحة</th>
                    <th>سعر الشراء</th>
                    <th>سعر البيع</th>
                    <th>نسبة الربح</th>
                    <th>القيمة الإجمالية</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="6">إجمالي قيمة المخزون</th>
                    <th>${totalValue.toLocaleString('ar-EG')} جنيه</th>
                </tr>
            </tfoot>
        </table>
    `;
  container.appendChild(content);
}

function addEmployeesReport(container, startDate, endDate) {
  // Add employees report content
  const content = document.createElement("div");
  content.innerHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>الموظف</th>
                    <th>الراتب</th>
                    <th>السلف</th>
                    <th>المكافآت</th>
                    <th>الخصومات</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>محمد أحمد</td>
                    <td>5000</td>
                    <td>1000</td>
                    <td>500</td>
                    <td>200</td>
                </tr>
                <tr>
                    <td>علي محمود</td>
                    <td>4000</td>
                    <td>800</td>
                    <td>400</td>
                    <td>100</td>
                </tr>
            </tbody>
        </table>
    `;
  container.appendChild(content);
}

function addAttendanceReport(container, startDate, endDate) {
  // Add attendance report content
  const content = document.createElement("div");
  content.innerHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>الموظف</th>
                    <th>أيام الحضور</th>
                    <th>أيام الغياب</th>
                    <th>التأخير</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>محمد أحمد</td>
                    <td>20</td>
                    <td>2</td>
                    <td>3</td>
                </tr>
                <tr>
                    <td>علي محمود</td>
                    <td>18</td>
                    <td>4</td>
                    <td>5</td>
                </tr>
            </tbody>
        </table>
    `;
  container.appendChild(content);
}

function addReservationsReport(container, startDate, endDate) {
  // Add reservations report content
  const content = document.createElement("div");
  content.innerHTML = `
        <div class="report-chart">
            <!-- Chart would be added here -->
            <p>رسم بياني للحجزات</p>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>العميل</th>
                    <th>عدد الحجزات</th>
                    <th>إجمالي المبلغ</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>محمد أحمد</td>
                    <td>5</td>
                    <td>5000</td>
                </tr>
                <tr>
                    <td>علي محمود</td>
                    <td>3</td>
                    <td>3000</td>
                </tr>
            </tbody>
        </table>
    `;
  container.appendChild(content);
}
