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
  window.print();
});

// Handle download button
document
  .getElementById("download-report")
  .addEventListener("click", function () {
    // Here you would typically implement the download functionality
    console.log("Downloading report...");
  });

// Sample report generation functions
function addFinancialReport(container, startDate, endDate) {
  // Add financial report content
  const content = document.createElement("div");
  content.innerHTML = `
        <div class="report-chart">
            <!-- Chart would be added here -->
            <p>رسم بياني للمعاملات المالية</p>
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
                    <td>وارد خزنة</td>
                    <td>10000</td>
                    <td>60%</td>
                </tr>
                <tr>
                    <td>منصرف خزنة</td>
                    <td>5000</td>
                    <td>30%</td>
                </tr>
                <tr>
                    <td>خزنة عمال</td>
                    <td>2000</td>
                    <td>10%</td>
                </tr>
            </tbody>
        </table>
    `;
  container.appendChild(content);
}

function addSalesReport(container, startDate, endDate) {
  // Add sales report content
  const content = document.createElement("div");
  content.innerHTML = `
        <div class="report-chart">
            <!-- Chart would be added here -->
            <p>رسم بياني للمبيعات</p>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>المبلغ</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>منتج 1</td>
                    <td>50</td>
                    <td>5000</td>
                </tr>
                <tr>
                    <td>منتج 2</td>
                    <td>30</td>
                    <td>3000</td>
                </tr>
            </tbody>
        </table>
    `;
  container.appendChild(content);
}

function addInventoryReport(container) {
  // Add inventory report content
  const content = document.createElement("div");
  content.innerHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>المنتج</th>
                    <th>الكمية المتاحة</th>
                    <th>سعر الشراء</th>
                    <th>سعر البيع</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>منتج 1</td>
                    <td>100</td>
                    <td>50</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td>منتج 2</td>
                    <td>200</td>
                    <td>30</td>
                    <td>60</td>
                </tr>
            </tbody>
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
