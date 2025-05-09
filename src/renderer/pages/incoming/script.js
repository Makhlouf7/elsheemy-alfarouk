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
    info.style.fontSize = "12px";
    info.style.margin = "10px 0";
    info.style.padding = "10px";
    info.style.border = "1px solid #ccc";
    info.style.backgroundColor = "#f9f9f9";
    info.innerHTML = `
      <h3 style="font-size: 14px; margin: 0 0 5px 0; border-bottom: 1px solid #ccc; padding-bottom: 3px;">معلومات السجل</h3>
      <p style="margin: 3px 0;">إجمالي عدد السجلات: <strong>${incomingData.length}</strong></p>
      <p style="margin: 3px 0;">تاريخ آخر تحديث: <strong>${incomingData.length > 0 ? formatDate(incomingData[incomingData.length - 1].date) : 'لا يوجد'}</strong></p>
    `;
    printContainer.appendChild(info);

    // Add report table with better formatting
    const table = document.createElement('table');
    table.className = 'print-table';
    table.style.border = "1px solid #000";
    table.style.width = "90%";
    table.style.margin = "0 auto 15px auto"; // Center the table and reduce bottom margin
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "12px"; // Smaller font size for the table

    // Add table header with styling
    const thead = document.createElement('thead');
    thead.style.backgroundColor = "#f2f2f2";
    thead.innerHTML = `
      <tr>
        <th style="width: 10%; padding: 6px; font-size: 13px; border: 1px solid #000;">التاريخ</th>
        <th style="width: 12%; padding: 6px; font-size: 13px; border: 1px solid #000;">اسم المورد</th>
        <th style="width: 10%; padding: 6px; font-size: 13px; border: 1px solid #000;">النوع</th>
        <th style="width: 10%; padding: 6px; font-size: 13px; border: 1px solid #000;">الكمية</th>
        <th style="width: 8%; padding: 6px; font-size: 13px; border: 1px solid #000;">شكاره</th>
        <th style="width: 10%; padding: 6px; font-size: 13px; border: 1px solid #000;">رقم السيارة</th>
        <th style="width: 12%; padding: 6px; font-size: 14px; background-color: #e6e6e6; border: 1px solid #000;">سعر الطن</th>
        <th style="width: 10%; padding: 6px; font-size: 13px; border: 1px solid #000;">نوع الحمولة</th>
        <th style="width: 8%; padding: 6px; font-size: 13px; border: 1px solid #000;">الصنف</th>
      </tr>
    `;
    table.appendChild(thead);

    // Add table body
    const tbody = document.createElement('tbody');

    // Sort data by date (newest first)
    const sortedData = [...incomingData].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // Check if there are items in the data
    if (sortedData.length === 0) {
      // Add an empty row with a message if there are no items
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="9" style="padding: 10px; text-align: center; font-size: 14px; border: 1px solid #000;">لا توجد بيانات في السجل</td>
      `;
      tbody.appendChild(emptyRow);
    } else {
      // Add rows for each item in the data
      sortedData.forEach(item => {
        const row = document.createElement('tr');
        row.style.textAlign = "center";

        row.innerHTML = `
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${formatDate(item.date)}</td>
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${item.supplier || '-'}</td>
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${item.type || '-'}</td>
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${item.quantity.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${item.shakara.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${item.carNumber || '-'}</td>
          <td style="padding: 4px; text-align: center; font-weight: bold; font-size: 13px; background-color: #f9f9f9; border: 1px solid #000;">${item.priceIn.toLocaleString('ar-EG')} جنيه</td>
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${item.loadType || '-'}</td>
          <td style="padding: 4px; text-align: center; font-size: 12px; border: 1px solid #000;">${item.category || '-'}</td>
        `;
        tbody.appendChild(row);
      });
    }

    table.appendChild(tbody);
    printContainer.appendChild(table);

    // Add report footer with better formatting
    const footer = document.createElement('div');
    footer.className = 'print-footer';
    footer.style.marginTop = "15px";
    footer.style.textAlign = "center";
    footer.style.borderTop = "1px solid #ccc";
    footer.style.paddingTop = "5px";
    footer.style.fontSize = "10px";
    footer.innerHTML = `
      <p style="margin: 2px 0;">تم إنشاء هذا التقرير بواسطة نظام إدارة المخزون</p>
      <p style="margin: 2px 0;">للاستفسار: 01234567890</p>
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
