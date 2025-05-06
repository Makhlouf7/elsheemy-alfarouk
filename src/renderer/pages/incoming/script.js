// Sample data for testing
let incomingData = [];

// Handle form submission
document.getElementById("incoming-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form data
  const formData = {
    date: document.getElementById("date").value,
    supplier: document.getElementById("supplier").value,
    type: document.getElementById("type").value,
    quantity: document.getElementById("quantity").value,
    shakara: document.getElementById("shakara").value,
    carNumber: document.getElementById("car-number").value,
    priceIn: document.getElementById("price-in").value,
    priceOut: document.getElementById("price-out").value,
    loadType: document.getElementById("load-type").value,
    category: document.getElementById("category").value,
  };

  // Add to data array
  incomingData.push(formData);

  // Update table
  updateTable();

  // Clear form if print is not checked
  if (!document.getElementById("print").checked) {
    e.target.reset();
  }
});

// Update table with data
function updateTable() {
  const tbody = document.getElementById("incoming-table-body");
  tbody.innerHTML = "";

  incomingData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.supplier}</td>
            <td>${item.type}</td>
            <td>${item.quantity}</td>
            <td>${item.shakara}</td>
            <td>${item.carNumber}</td>
            <td>${item.priceIn}</td>
            <td>${item.loadType}</td>
            <td>${item.category}</td>
        `;
    tbody.appendChild(row);
  });
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
