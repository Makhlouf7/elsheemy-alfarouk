// Load invoice items from localStorage or initialize empty array
let invoiceItems = [];
let savedInvoices = [];

// Function to ensure numeric values are properly parsed
function parseNumericValues(items) {
  return items.map(item => {
    // Log the item for debugging
    console.log('Parsing item:', item);

    return {
      ...item,
      loadType: item.loadType || 'az', // Default to 'az' if not present
      category: item.category || '16', // Default to '16' if not present
      quantity: parseFloat(item.quantity) || 0,
      shakara: parseFloat(item.shakara) || 0,
      price: parseFloat(item.price) || 0,
      total: parseFloat(item.total) || 0
    };
  });
}

// Load and parse data from localStorage
try {
  const storedItems = localStorage.getItem('outgoingInvoiceItems');
  if (storedItems) {
    invoiceItems = parseNumericValues(JSON.parse(storedItems));
  }

  const storedInvoices = localStorage.getItem('savedInvoices');
  if (storedInvoices) {
    savedInvoices = JSON.parse(storedInvoices).map(invoice => {
      return {
        ...invoice,
        items: parseNumericValues(invoice.items || []),
        totalAmount: parseFloat(invoice.totalAmount) || 0
      };
    });
  }
} catch (error) {
  console.error('Error parsing data from localStorage:', error);
  // Reset to empty arrays if there's an error
  invoiceItems = [];
  savedInvoices = [];
}

// Initialize the tables with saved data
document.addEventListener('DOMContentLoaded', function () {
  updateInvoiceTable();
  updateSavedInvoicesTable();
});

// Function to print invoice
function printInvoice() {
  if (invoiceItems.length === 0) {
    alert("لا توجد منتجات في الفاتورة للطباعة");
    return;
  }

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
      <p style="margin: 2px 0;">رقم الفاتورة: ${Date.now()}</p>
      <p style="margin: 2px 0;">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}</p>
    </div>
  `;
  printContainer.appendChild(header);

  // Add invoice info
  const info = document.createElement('div');
  info.className = 'print-info';

  const customerInfo = document.createElement('div');
  customerInfo.style.fontSize = "12px";
  customerInfo.style.width = "45%";
  customerInfo.innerHTML = `
    <h3 style="font-size: 14px; margin: 5px 0; border-bottom: 1px solid #ccc; padding-bottom: 3px;">بيانات العميل</h3>
    <p style="margin: 3px 0;">الاسم: ${document.getElementById('customer-name').value || 'غير محدد'}</p>
    <p style="margin: 3px 0;">البلد: ${document.getElementById('country').value || 'غير محدد'}</p>
  `;

  const driverInfo = document.createElement('div');
  driverInfo.style.fontSize = "12px";
  driverInfo.style.width = "45%";
  driverInfo.innerHTML = `
    <h3 style="font-size: 14px; margin: 5px 0; border-bottom: 1px solid #ccc; padding-bottom: 3px;">بيانات السائق</h3>
    <p style="margin: 3px 0;">الاسم: ${document.getElementById('driver-name').value || 'غير محدد'}</p>
    <p style="margin: 3px 0;">التاريخ: ${document.getElementById('date').value || new Date().toLocaleDateString('ar-EG')}</p>
  `;

  info.appendChild(customerInfo);
  info.appendChild(driverInfo);
  printContainer.appendChild(info);

  // Add invoice table with better formatting - smaller size for printing
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
      <th style="width: 15%; padding: 6px; font-size: 13px;">نوع الحمولة</th>
      <th style="width: 10%; padding: 6px; font-size: 13px;">الصنف</th>
      <th style="width: 15%; padding: 6px; font-size: 13px;">الكمية</th>
      <th style="width: 10%; padding: 6px; font-size: 13px;">شكاره</th>
      <th style="width: 20%; padding: 6px; font-size: 13px;">السعر</th>
      <th style="width: 30%; padding: 6px; font-size: 14px; background-color: #e6e6e6; border: 1px solid #000;">الإجمالي</th>
    </tr>
  `;
  table.appendChild(thead);

  // Add table body
  const tbody = document.createElement('tbody');
  let totalAmount = 0;

  // Check if there are items in the invoice
  if (invoiceItems.length === 0) {
    // Add an empty row with a message if there are no items
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="6" style="padding: 10px; text-align: center; font-size: 14px;">لا توجد منتجات في الفاتورة</td>
    `;
    tbody.appendChild(emptyRow);
  } else {
    // Add rows for each item in the invoice
    invoiceItems.forEach(item => {
      const row = document.createElement('tr');

      // Get readable load type name and ensure it's not undefined
      const loadType = item.loadType || 'az';
      let loadTypeName = getLoadTypeName(loadType);

      // Ensure category is not undefined
      const category = item.category || '16';

      console.log('Print item:', item, 'Load type:', loadType, 'Category:', category);

      // Add styling to the row
      row.style.textAlign = "center";

      row.innerHTML = `
        <td style="padding: 4px; text-align: center; font-size: 12px;">${loadTypeName}</td>
        <td style="padding: 4px; text-align: center; font-size: 12px;">${category}</td>
        <td style="padding: 4px; text-align: center; font-size: 12px;">${item.quantity.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 4px; text-align: center; font-size: 12px;">${item.shakara.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
        <td style="padding: 4px; text-align: center; font-size: 12px;">${item.price.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} جنيه</td>
        <td style="padding: 4px; text-align: center; font-weight: bold; font-size: 13px; background-color:rgba(11, 161, 49, 0.4); border: 1px solid #000;">${item.total.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} جنيه</td>
      `;

      tbody.appendChild(row);
      totalAmount += item.total;
    });
  }

  table.appendChild(tbody);
  printContainer.appendChild(table);

  // Add invoice total with better formatting
  const total = document.createElement('div');
  total.className = 'print-total';

  // Convert total to words in Arabic
  const totalInWords = convertNumberToArabicWords(totalAmount);

  total.innerHTML = `
    <div class="total-container" style="border: 1px solid #000; padding: 10px; margin-bottom: 15px; background-color: #f9f9f9; width: 90%; margin-left: auto; margin-right: auto;">
      <div class="total-line" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; font-size: 14px;">
        <span class="total-label" style="font-size: 15px; color: #000;">إجمالي الفاتورة:</span>
        <span class="total-value" style="font-size: 15px; color: #000; background-color: #fff; padding: 3px 10px; border: 1px solid #000; border-radius: 3px;">${totalAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} جنيه</span>
      </div>
      <div class="total-in-words" style="display: flex; justify-content: space-between; border-top: 1px solid #ccc; padding-top: 10px; font-size: 12px;">
        <span class="total-label" style="font-weight: bold;">المبلغ بالحروف:</span>
        <span class="total-value" style="font-weight: bold; text-decoration: underline;">${totalInWords} جنيه مصري فقط لا غير</span>
      </div>
    </div>
    <!-- توقيعات تمت إزالتها بناءً على طلب المستخدم -->
  `;
  printContainer.appendChild(total);

  // Add invoice footer
  const footer = document.createElement('div');
  footer.className = 'print-footer';
  footer.style.marginTop = "15px";
  footer.style.textAlign = "center";
  footer.style.borderTop = "1px solid #ccc";
  footer.style.paddingTop = "5px";
  footer.style.fontSize = "10px";
  footer.innerHTML = `
    <p style="margin: 2px 0;">شكراً لتعاملكم معنا</p>
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

// Handle print button click
document.getElementById("print-invoice").addEventListener("click", function () {
  printInvoice();
});

// Handle form submission
document
  .getElementById("add-to-invoice")
  .addEventListener("click", function () {
    const productForm = document.getElementById("product-form");
    const formData = new FormData(productForm);

    // Validate form
    if (!productForm.checkValidity()) {
      alert("الرجاء إدخال جميع بيانات المنتج المطلوبة");
      return;
    }

    // No need to get form values here as we're using the select elements directly

    // Log form values for debugging
    console.log('Form values:', {
      loadType: formData.get("load-type"),
      category: formData.get("category"),
      quantity: formData.get("quantity"),
      shakara: formData.get("shakara"),
      price: formData.get("price")
    });

    // Get direct references to the select elements
    const loadTypeSelect = document.getElementById("load-type");
    const categorySelect = document.getElementById("category");

    // Log select values for debugging
    console.log('Select values:', {
      loadType: loadTypeSelect.value,
      category: categorySelect.value
    });

    // Get values directly from the form elements to ensure we get the browser's parsed values
    const quantityInput = document.getElementById("quantity");
    const shakaraInput = document.getElementById("shakara");
    const priceInput = document.getElementById("price");

    // Get values as numbers
    const quantity = quantityInput.valueAsNumber;
    const shakara = shakaraInput.valueAsNumber;
    const price = priceInput.valueAsNumber;

    console.log('Quantity input:', quantityInput.value, 'Parsed quantity:', quantity);
    console.log('Price input:', priceInput.value, 'Parsed price:', price);

    // Calculate total
    const total = quantity * price;

    // Validate numbers
    if (isNaN(quantity) || quantity <= 0) {
      alert("الرجاء إدخال كمية صحيحة");
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert("الرجاء إدخال سعر صحيح");
      return;
    }

    // Create new invoice item using values directly from select elements
    const newItem = {
      loadType: loadTypeSelect.value || 'az',
      category: categorySelect.value || '16',
      quantity,
      shakara,
      price,
      total
    };

    // Log the new item for debugging
    console.log('New item created:', newItem);

    // Add to invoice items array
    invoiceItems.push(newItem);

    // Update table
    updateInvoiceTable();

    // Reset form
    productForm.reset();
  });

// Update invoice table
function updateInvoiceTable() {
  const tableBody = document.getElementById("invoice-table-body");
  tableBody.innerHTML = "";

  let totalAmount = 0;

  // Log all invoice items for debugging
  console.log('All invoice items:', JSON.stringify(invoiceItems));

  // Check if there are items in the invoice
  if (invoiceItems.length === 0) {
    // Add an empty row with a message if there are no items
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
            <td colspan="7" style="padding: 10px; text-align: center; font-size: 14px;">لا توجد منتجات في الفاتورة</td>
        `;
    tableBody.appendChild(emptyRow);
  } else {
    // Add rows for each item in the invoice
    invoiceItems.forEach((item, index) => {
      const row = document.createElement("tr");

      // Get readable load type name and ensure it's not undefined
      const loadType = item.loadType || 'az';
      let loadTypeName = getLoadTypeName(loadType);

      // Ensure category is not undefined
      const category = item.category || '16';

      console.log('Table item:', item, 'Load type:', loadType, 'Category:', category);

      row.innerHTML = `
              <td>${loadTypeName}</td>
              <td>${category}</td>
              <td>${item.quantity.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${item.shakara.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
              <td>${formatCurrency(item.price)}</td>
              <td style="font-weight: bold; font-size: 16px; background-color: #f9f9f9; border: 2px solid #000;">${formatCurrency(item.total)}</td>
              <td>
                  <button class="btn btn-danger" onclick="removeItem(${index})">حذف</button>
              </td>
          `;
      tableBody.appendChild(row);
      totalAmount += item.total;
    });
  }

  // Update total amount
  document.getElementById("total-amount").textContent = formatCurrency(totalAmount);

  // Save to localStorage with explicit values
  const itemsToSave = invoiceItems.map(item => ({
    loadType: item.loadType || 'az',
    category: item.category || '16',
    quantity: item.quantity,
    shakara: item.shakara,
    price: item.price,
    total: item.total
  }));

  console.log('Saving items to localStorage:', JSON.stringify(itemsToSave));
  localStorage.setItem('outgoingInvoiceItems', JSON.stringify(itemsToSave));
}

// Helper function to get load type name
function getLoadTypeName(type) {
  const types = {
    'az': 'عز',
    'estithmari': 'استثماري',
    'komy': 'كومي'
  };
  return types[type] || type;
}

// Helper function to format currency
function formatCurrency(amount) {
  return amount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' جنيه';
}

// Remove item from invoice
function removeItem(index) {
  invoiceItems.splice(index, 1);
  updateInvoiceTable();

  // Save to localStorage with explicit values
  const itemsToSave = invoiceItems.map(item => ({
    loadType: item.loadType || 'az',
    category: item.category || '16',
    quantity: item.quantity,
    shakara: item.shakara,
    price: item.price,
    total: item.total
  }));

  localStorage.setItem('outgoingInvoiceItems', JSON.stringify(itemsToSave));
}

// Handle save invoice
document.getElementById("save-invoice").addEventListener("click", function () {
  const invoiceForm = document.getElementById("invoice-form");

  // Validate form
  if (!invoiceForm.checkValidity()) {
    alert("الرجاء إدخال جميع بيانات الفاتورة المطلوبة");
    return;
  }

  // Validate items
  if (invoiceItems.length === 0) {
    alert("الرجاء إضافة منتج واحد على الأقل إلى الفاتورة");
    return;
  }

  const formData = new FormData(invoiceForm);

  // Create a copy of items with explicit values
  const itemsWithExplicitValues = invoiceItems.map(item => ({
    loadType: item.loadType || 'az',
    category: item.category || '16',
    quantity: item.quantity,
    shakara: item.shakara,
    price: item.price,
    total: item.total
  }));

  console.log('Items with explicit values:', JSON.stringify(itemsWithExplicitValues));

  const invoiceData = {
    id: Date.now(), // Unique ID based on timestamp
    customerName: formData.get("customer-name"),
    country: formData.get("country"),
    date: formData.get("date"),
    driverName: formData.get("driver-name"),
    items: itemsWithExplicitValues, // Use items with explicit values
    totalAmount: invoiceItems.reduce((sum, item) => sum + item.total, 0),
    createdAt: new Date().toISOString()
  };

  // Add to saved invoices
  savedInvoices.push(invoiceData);

  // Save to localStorage
  localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));

  // Show success message
  alert(`تم حفظ الفاتورة بنجاح للعميل: ${invoiceData.customerName}`);

  // If print is checked, trigger print
  if (document.getElementById("print").checked) {
    printInvoice();
  }

  // Reset forms and clear items
  invoiceForm.reset();
  document.getElementById("product-form").reset();
  invoiceItems = [];
  updateInvoiceTable();

  // Clear localStorage for current invoice items
  localStorage.removeItem('outgoingInvoiceItems');

  // Update saved invoices table
  updateSavedInvoicesTable();
});

// Function to update saved invoices table
function updateSavedInvoicesTable() {
  const tableBody = document.getElementById("saved-invoices-table-body");
  tableBody.innerHTML = "";

  // Sort invoices by date (newest first)
  const sortedInvoices = [...savedInvoices].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  sortedInvoices.forEach((invoice, index) => {
    const row = document.createElement("tr");

    // Format date
    const date = new Date(invoice.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    row.innerHTML = `
      <td>${invoice.id}</td>
      <td>${invoice.customerName}</td>
      <td>${formattedDate}</td>
      <td>${formatCurrency(invoice.totalAmount)}</td>
      <td>
        <button class="btn btn-primary" onclick="viewInvoice(${index})">عرض</button>
        <button class="btn btn-danger" onclick="deleteInvoice(${index})">حذف</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to view saved invoice
function viewInvoice(index) {
  const invoice = savedInvoices[index];

  console.log('Viewing invoice:', invoice);

  // Load invoice data into form
  document.getElementById("customer-name").value = invoice.customerName;
  document.getElementById("country").value = invoice.country;
  document.getElementById("date").value = invoice.date;
  document.getElementById("driver-name").value = invoice.driverName;

  // Load invoice items with proper parsing
  invoiceItems = invoice.items.map(item => {
    return {
      loadType: item.loadType || 'az',
      category: item.category || '16',
      quantity: parseFloat(item.quantity) || 0,
      shakara: parseFloat(item.shakara) || 0,
      price: parseFloat(item.price) || 0,
      total: parseFloat(item.total) || 0
    };
  });

  console.log('Loaded items:', invoiceItems);

  // Update table
  updateInvoiceTable();

  // Scroll to top
  window.scrollTo(0, 0);
}

// Function to delete saved invoice
function deleteInvoice(index) {
  if (confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
    savedInvoices.splice(index, 1);
    localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
    updateSavedInvoicesTable();
  }
}

// Function to convert number to Arabic words
function convertNumberToArabicWords(number) {
  const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const teens = ['', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  const thousands = ['', 'ألف', 'ألفان', 'آلاف', 'آلاف', 'آلاف', 'آلاف', 'آلاف', 'آلاف', 'آلاف', 'آلاف'];
  const millions = ['', 'مليون', 'مليونان', 'ملايين', 'ملايين', 'ملايين', 'ملايين', 'ملايين', 'ملايين', 'ملايين', 'ملايين'];

  // Round to 2 decimal places
  number = Math.round(number * 100) / 100;

  // Split into integer and decimal parts
  const parts = number.toString().split('.');
  const integerPart = parseInt(parts[0]);
  const decimalPart = parts.length > 1 ? parseInt(parts[1].padEnd(2, '0')) : 0;

  // Convert integer part
  let result = '';

  if (integerPart === 0) {
    result = 'صفر';
  } else if (integerPart < 11) {
    result = units[integerPart];
  } else if (integerPart < 20) {
    result = teens[integerPart - 10];
  } else if (integerPart < 100) {
    const unit = integerPart % 10;
    const ten = Math.floor(integerPart / 10);
    if (unit === 0) {
      result = tens[ten];
    } else {
      result = units[unit] + ' و' + tens[ten];
    }
  } else if (integerPart < 1000) {
    const hundred = Math.floor(integerPart / 100);
    const remainder = integerPart % 100;

    result = hundreds[hundred];

    if (remainder > 0) {
      if (remainder < 11) {
        result += ' و' + units[remainder];
      } else if (remainder < 20) {
        result += ' و' + teens[remainder - 10];
      } else {
        const unit = remainder % 10;
        const ten = Math.floor(remainder / 10);
        if (unit === 0) {
          result += ' و' + tens[ten];
        } else {
          result += ' و' + units[unit] + ' و' + tens[ten];
        }
      }
    }
  } else if (integerPart < 1000000) {
    const thousand = Math.floor(integerPart / 1000);
    const remainder = integerPart % 1000;

    if (thousand === 1) {
      result = 'ألف';
    } else if (thousand === 2) {
      result = 'ألفان';
    } else if (thousand < 11) {
      result = units[thousand] + ' ' + thousands[3];
    } else {
      // For larger thousands, recursively convert
      result = convertNumberToArabicWords(thousand) + ' ' + 'ألف';
    }

    if (remainder > 0) {
      result += ' و' + convertNumberToArabicWords(remainder);
    }
  } else {
    // For millions and larger, recursively convert
    const million = Math.floor(integerPart / 1000000);
    const remainder = integerPart % 1000000;

    if (million === 1) {
      result = 'مليون';
    } else if (million === 2) {
      result = 'مليونان';
    } else if (million < 11) {
      result = units[million] + ' ' + millions[3];
    } else {
      result = convertNumberToArabicWords(million) + ' ' + 'مليون';
    }

    if (remainder > 0) {
      result += ' و' + convertNumberToArabicWords(remainder);
    }
  }

  // Add decimal part if exists
  if (decimalPart > 0) {
    result += ' و' + convertNumberToArabicWords(decimalPart) + ' قرش';
  }

  return result;
}
