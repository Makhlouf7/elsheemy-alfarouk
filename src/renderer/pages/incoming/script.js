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
    // Open print preview with auto print parameter
    window.open('./print-preview.html?autoPrint=true', '_blank');
  }

  // Reset the form
  e.target.reset();
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
