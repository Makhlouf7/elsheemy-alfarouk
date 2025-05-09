// Load data from localStorage or initialize empty array
let incomingData = [];

// Function to ensure numeric values are properly parsed
function parseNumericValues(items) {
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

// Load and parse data from localStorage
try {
  const storedData = localStorage.getItem('incomingData');
  if (storedData) {
    incomingData = parseNumericValues(JSON.parse(storedData));
  }
} catch (error) {
  console.error('Error parsing data from localStorage:', error);
  // Reset to empty array if there's an error
  incomingData = [];
}

// Initialize the table with saved data
document.addEventListener('DOMContentLoaded', function () {
  updateTable();
});

// Handle form submission
document.getElementById("incoming-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate form
  const form = document.getElementById("incoming-form");
  if (!form.checkValidity()) {
    alert("الرجاء إدخال جميع البيانات المطلوبة");
    return;
  }

  // Get form values and provide defaults for empty values
  const date = document.getElementById("date").value || '';
  const supplier = document.getElementById("supplier").value || '';
  const type = document.getElementById("type").value || '';
  const quantityStr = document.getElementById("quantity").value || '0';
  const shakaraStr = document.getElementById("shakara").value || '0';
  const carNumber = document.getElementById("car-number").value || '';
  const priceInStr = document.getElementById("price-in").value || '0';
  const priceOutStr = document.getElementById("price-out").value || '0';
  const loadType = document.getElementById("load-type").value || '';
  const category = document.getElementById("category").value || '';

  // Get values directly from the form elements to ensure we get the browser's parsed values
  const quantityInput = document.getElementById("quantity");
  const shakaraInput = document.getElementById("shakara");
  const priceInInput = document.getElementById("price-in");
  const priceOutInput = document.getElementById("price-out");

  // Get values as numbers
  const quantity = quantityInput.valueAsNumber;
  const shakara = shakaraInput.valueAsNumber;
  const priceIn = priceInInput.valueAsNumber;
  const priceOut = priceOutInput.valueAsNumber;

  console.log('Quantity input:', quantityInput.value, 'Parsed quantity:', quantity);
  console.log('Price input:', priceInInput.value, 'Parsed price:', priceIn);

  // Validate numbers
  if (isNaN(quantity) || quantity <= 0) {
    alert("الرجاء إدخال كمية صحيحة");
    return;
  }

  if (isNaN(priceIn) || priceIn <= 0) {
    alert("الرجاء إدخال سعر شراء صحيح");
    return;
  }

  // Create form data object
  const formData = {
    id: Date.now(), // Unique ID based on timestamp
    date,
    supplier,
    type,
    quantity,
    shakara,
    carNumber,
    priceIn,
    priceOut,
    loadType,
    category,
    createdAt: new Date().toISOString()
  };

  // Add to data array
  incomingData.push(formData);

  // Show success message
  alert("تم حفظ البيانات بنجاح");

  // Update table
  updateTable();

  // Check if print is checked
  if (document.getElementById("print").checked) {
    printTable();
  } else {
    e.target.reset();
  }

  // Function to print the table
  function printTable() {
    // Create a print container
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';

    // Add invoice header with company logo and info
    const header = document.createElement('div');
    header.className = 'print-header';
    header.innerHTML = `
      <div class="company-logo-container" style="display: flex; align-items: center; margin-bottom: 10px;">
        <div class="company-logo" style="width: 100px; height: 100px; margin-left: 15px;">
          <div class="logo-oval" style="width: 100%; height: 100%; border: 2px solid #000; border-radius: 50%; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden;">
            <!-- Oval background with text -->
            <div style="position: absolute; width: 90%; height: 60%; top: 20%; left: 5%; border: 2px solid #000; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; transform: rotate(-10deg);">
              <span style="font-weight: bold; font-size: 14px; text-align: center; transform: rotate(10deg);">ELSHEEMY</span>
              <span style="font-weight: bold; font-size: 14px; text-align: center; transform: rotate(10deg);">STEEL</span>
            </div>
            <!-- Top star -->
            <div style="position: absolute; top: 5%; left: 50%; transform: translateX(-50%);">★</div>
            <!-- Bottom text -->
            <div style="position: absolute; bottom: 10%; width: 100%; text-align: center;">
              <span style="font-weight: bold; font-size: 12px;">ALFAROUK</span>
            </div>
            <!-- Left star -->
            <div style="position: absolute; top: 50%; left: 5%; transform: translateY(-50%);">★</div>
            <!-- Right star -->
            <div style="position: absolute; top: 50%; right: 5%; transform: translateY(-50%);">★</div>
          </div>
        </div>
        <div class="company-info" style="flex: 1;">
          <h1 style="font-size: 18px; margin: 0 0 3px 0;">مؤسســة الشيــمي و الفــاروق</h1>
          <p style="margin: 2px 0; font-size: 12px;">لتجــارة وتوزيــع جميــع مــواد البنــاء</p>
          <p style="margin: 2px 0; font-size: 12px;">يسري عرب عبدالرحمن الشيمي وشركاه</p>
          <p style="margin: 2px 0; font-size: 11px;">س.ت: ٦٨٠٠٤ - ب.ض: ٧٨٤-٣٣٣٣-٦٦٢ - م.ض: ٠١-٠٢-٠٠٥-٥٨٢٢-٠</p>
          <p class="note" style="margin: 5px 0; font-size: 12px; font-weight: bold; border: 1px solid #000; padding: 3px; background-color: #f9f9f9; text-align: center;">( الكمية المحجوزة لا ترد ولا تلغى في حالة زيادة أو نقص السعر لأي سبب من الأسباب</p>
          <p class="note" style="margin: 2px 0; font-size: 12px; font-weight: bold; border: 1px solid #000; border-top: none; padding: 3px; background-color: #f9f9f9; text-align: center;">لأن الكمية محجوزة من رغبة العميل )</p>
        </div>
      </div>
      <div class="invoice-details" style="display: flex; justify-content: space-between; margin-top: 5px; border-top: 1px solid #ccc; padding-top: 5px; font-size: 12px;">
        <p style="margin: 2px 0;">سجل الوارد</p>
        <p style="margin: 2px 0;">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p>
      </div>
    `;
    printContainer.appendChild(header);

    // Add report info with better formatting
    const info = document.createElement('div');
    info.className = 'print-info';
    info.style.fontSize = "13px";
    info.style.margin = "15px 0";
    info.style.padding = "15px";
    info.style.border = "1px solid #000";
    info.style.backgroundColor = "#f9f9f9";
    info.style.borderRadius = "5px";
    info.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

    // Get current date and format it
    const currentDate = new Date();
    const formattedCurrentDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    // Get the most recent date from the data
    const lastUpdateDate = incomingData.length > 0 ? formatDate(incomingData[incomingData.length - 1].date) : 'لا يوجد';

    info.innerHTML = `
      <h3 style="font-size: 16px; margin: 0 0 10px 0; border-bottom: 2px solid #007bff; padding-bottom: 5px; color: #007bff;">معلومات سجل الوارد</h3>
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
        <div style="min-width: 200px; margin-left: 20px;">
          <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">إجمالي عدد السجلات:</span> <span style="font-weight: bold; color: #007bff;">${incomingData.length}</span></p>
          <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">تاريخ آخر تحديث:</span> <span style="font-weight: bold; color: #007bff;">${lastUpdateDate}</span></p>
        </div>
        <div style="min-width: 200px;">
          <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">تاريخ الطباعة:</span> <span style="font-weight: bold; color: #007bff;">${formattedCurrentDate}</span></p>
          <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">رقم التقرير:</span> <span style="font-weight: bold; color: #007bff;">${Date.now().toString().slice(-8)}</span></p>
        </div>
      </div>
    `;
    printContainer.appendChild(info);

    // Add report table with better formatting
    const table = document.createElement('table');
    table.className = 'print-table';
    table.style.border = "2px solid #000";
    table.style.width = "95%";
    table.style.margin = "15px auto 20px auto"; // Center the table and adjust margins
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "13px"; // Slightly larger font size for better readability
    table.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

    // Add table header with improved styling
    const thead = document.createElement('thead');
    thead.style.backgroundColor = "#007bff";
    thead.style.color = "white";
    thead.innerHTML = `
      <tr>
        <th style="width: 10%; padding: 8px; font-size: 14px; border: 1px solid #000;">التاريخ</th>
        <th style="width: 12%; padding: 8px; font-size: 14px; border: 1px solid #000;">اسم المورد</th>
        <th style="width: 10%; padding: 8px; font-size: 14px; border: 1px solid #000;">النوع</th>
        <th style="width: 10%; padding: 8px; font-size: 14px; border: 1px solid #000;">الكمية</th>
        <th style="width: 8%; padding: 8px; font-size: 14px; border: 1px solid #000;">شكاره</th>
        <th style="width: 10%; padding: 8px; font-size: 14px; border: 1px solid #000;">رقم السيارة</th>
        <th style="width: 12%; padding: 8px; font-size: 14px; border: 1px solid #000;">سعر الطن</th>
        <th style="width: 10%; padding: 8px; font-size: 14px; border: 1px solid #000;">نوع الحمولة</th>
        <th style="width: 8%; padding: 8px; font-size: 14px; border: 1px solid #000;">الصنف</th>
      </tr>
    `;
    table.appendChild(thead);

    // Add table body
    const tbody = document.createElement('tbody');

    // Sort data by date (newest first)
    const sortedData = [...incomingData].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // Initialize totals
    let totalQuantity = 0;
    let totalShakara = 0;
    let totalPriceValue = 0;

    // Check if there are items in the data
    if (sortedData.length === 0) {
      // Add an empty row with a message if there are no items
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="9" style="padding: 15px; text-align: center; font-size: 16px; border: 1px solid #000; background-color: #f9f9f9;">لا توجد بيانات في السجل</td>
      `;
      tbody.appendChild(emptyRow);
    } else {
      // Add rows for each item in the data
      sortedData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.textAlign = "center";

        // Add alternating row colors for better readability
        if (index % 2 === 0) {
          row.style.backgroundColor = "#f9f9f9";
        }

        // Add to totals
        totalQuantity += parseFloat(item.quantity) || 0;
        totalShakara += parseInt(item.shakara) || 0;
        totalPriceValue += parseFloat(item.priceIn) || 0;

        row.innerHTML = `
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${formatDate(item.date)}</td>
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${item.supplier || '-'}</td>
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${item.type || '-'}</td>
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${item.quantity.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${item.shakara.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${item.carNumber || '-'}</td>
          <td style="padding: 6px; text-align: center; font-weight: bold; font-size: 13px; border: 1px solid #000;">${item.priceIn.toLocaleString('ar-EG')} جنيه</td>
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${item.loadType || '-'}</td>
          <td style="padding: 6px; text-align: center; font-size: 13px; border: 1px solid #000;">${item.category || '-'}</td>
        `;
        tbody.appendChild(row);
      });

      // Add a totals row
      const totalsRow = document.createElement('tr');
      totalsRow.style.backgroundColor = "#e6f7ff";
      totalsRow.style.fontWeight = "bold";
      totalsRow.innerHTML = `
        <td colspan="3" style="padding: 8px; text-align: center; font-size: 14px; border: 1px solid #000; background-color: #007bff; color: white;">الإجمالي</td>
        <td style="padding: 8px; text-align: center; font-size: 14px; border: 1px solid #000;">${totalQuantity.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 8px; text-align: center; font-size: 14px; border: 1px solid #000;">${totalShakara.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
        <td style="padding: 8px; text-align: center; font-size: 14px; border: 1px solid #000;">-</td>
        <td style="padding: 8px; text-align: center; font-size: 14px; border: 1px solid #000; background-color: rgba(11, 161, 49, 0.2);">${(totalPriceValue / sortedData.length).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} جنيه (متوسط)</td>
        <td colspan="2" style="padding: 8px; text-align: center; font-size: 14px; border: 1px solid #000;">-</td>
      `;
      tbody.appendChild(totalsRow);
    }

    table.appendChild(tbody);
    printContainer.appendChild(table);

    // Add summary section with charts or additional information
    if (sortedData.length > 0) {
      const summary = document.createElement('div');
      summary.className = 'print-summary';
      summary.style.margin = "20px auto";
      summary.style.width = "95%";
      summary.style.padding = "15px";
      summary.style.border = "1px solid #000";
      summary.style.borderRadius = "5px";
      summary.style.backgroundColor = "#f9f9f9";

      // Calculate average price
      const avgPrice = totalPriceValue / sortedData.length;

      summary.innerHTML = `
        <h3 style="font-size: 16px; margin: 0 0 10px 0; border-bottom: 2px solid #007bff; padding-bottom: 5px; color: #007bff;">ملخص البيانات</h3>
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div style="min-width: 200px; margin-left: 20px;">
            <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">إجمالي الكمية:</span> <span style="font-weight: bold; color: #007bff;">${totalQuantity.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
            <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">إجمالي الشكاير:</span> <span style="font-weight: bold; color: #007bff;">${totalShakara.toLocaleString('ar-EG')}</span></p>
          </div>
          <div style="min-width: 200px;">
            <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">متوسط السعر:</span> <span style="font-weight: bold; color: #007bff;">${avgPrice.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} جنيه</span></p>
            <p style="margin: 5px 0;"><span style="font-weight: bold; color: #555;">عدد الموردين:</span> <span style="font-weight: bold; color: #007bff;">${new Set(sortedData.map(item => item.supplier)).size}</span></p>
          </div>
        </div>
      `;

      printContainer.appendChild(summary);
    }

    // Add report footer with better formatting
    const footer = document.createElement('div');
    footer.className = 'print-footer';
    footer.style.marginTop = "30px";
    footer.style.textAlign = "center";
    footer.style.borderTop = "2px solid #007bff";
    footer.style.paddingTop = "10px";
    footer.style.fontSize = "12px";
    footer.style.position = "relative";
    footer.style.width = "95%";
    footer.style.margin = "30px auto 0 auto";

    // Get current date and time for the footer
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG');

    footer.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div style="text-align: right; font-size: 12px;">
          <p style="margin: 2px 0; color: #555;">تاريخ الطباعة: ${formattedCurrentDate}</p>
          <p style="margin: 2px 0; color: #555;">وقت الطباعة: ${timeString}</p>
        </div>
        <div style="text-align: center; font-size: 12px;">
          <p style="margin: 2px 0; font-weight: bold; color: #007bff;">مؤسســة الشيــمي و الفــاروق</p>
          <p style="margin: 2px 0; color: #555;">تقرير سجل الوارد</p>
        </div>
        <div style="text-align: left; font-size: 12px;">
          <p style="margin: 2px 0; color: #555;">صفحة 1 من 1</p>
          <p style="margin: 2px 0; color: #555;">للاستفسار: 01234567890</p>
        </div>
      </div>
      <p style="margin: 5px 0; font-size: 11px; color: #777; border-top: 1px dashed #ccc; padding-top: 5px;">تم إنشاء هذا التقرير بواسطة نظام إدارة المخزون - جميع الحقوق محفوظة &copy; ${now.getFullYear()}</p>
    `;
    printContainer.appendChild(footer);

    // Add the print container to the document
    document.body.appendChild(printContainer);

    // Print the document
    window.print();

    // Remove the print container after printing
    setTimeout(() => {
      document.body.removeChild(printContainer);
    }, 1000);
  }
});

// Update table with data
function updateTable() {
  const tbody = document.getElementById("incoming-table-body");
  tbody.innerHTML = "";

  // Sort data by date (newest first)
  const sortedData = [...incomingData].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Check if there are items in the data
  if (sortedData.length === 0) {
    // Add an empty row with a message if there are no items
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
            <td colspan="10" style="padding: 10px; text-align: center; font-size: 14px;">لا توجد بيانات في السجل</td>
        `;
    tbody.appendChild(emptyRow);
  } else {
    // Add rows for each item in the data
    sortedData.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${formatDate(item.date)}</td>
              <td>${item.supplier || '-'}</td>
              <td>${item.type || '-'}</td>
              <td>${item.quantity.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${item.shakara.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              <td>${item.carNumber || '-'}</td>
              <td style="font-weight: bold; font-size: 16px; background-color: #f9f9f9; border: 2px solid #000;">${item.priceIn.toLocaleString('ar-EG')} جنيه</td>
              <td>${item.loadType || '-'}</td>
              <td>${item.category || '-'}</td>
              <td>
                  <button class="btn btn-danger" onclick="deleteItem(${index})">حذف</button>
              </td>
          `;
      tbody.appendChild(row);
    });
  }

  // Save to localStorage
  localStorage.setItem('incomingData', JSON.stringify(incomingData));
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// Function to delete item
function deleteItem(index) {
  if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
    incomingData.splice(index, 1);
    updateTable();
  }
}

// Handle search
document.querySelector(".search-input").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("#incoming-table-body tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
});

// Handle Excel export
document
  .querySelector(".table-actions .btn-primary")
  .addEventListener("click", () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    const headers = [
      "التاريخ",
      "اسم المورد",
      "النوع",
      "الكمية",
      "شكاره",
      "رقم السيارة",
      "سعر الطن",
      "نوع الحمولة",
      "الصنف",
    ];
    csvContent += headers.join(",") + "\n";

    // Add data
    incomingData.forEach((item) => {
      const row = [
        item.date,
        item.supplier,
        item.type,
        item.quantity,
        item.shakara,
        item.carNumber,
        item.priceIn,
        item.loadType,
        item.category,
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "سجل_الوارد.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
