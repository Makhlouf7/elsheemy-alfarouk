// Sample data array to store invoice items
let invoiceItems = [];

// Handle form submission
document
  .getElementById("add-to-invoice")
  .addEventListener("click", function () {
    const productForm = document.getElementById("product-form");
    const formData = new FormData(productForm);

    // Create new invoice item
    const newItem = {
      loadType: formData.get("load-type"),
      category: formData.get("category"),
      quantity: parseInt(formData.get("quantity")),
      shakara: parseInt(formData.get("shakara")),
      price: parseFloat(formData.get("price")),
      total:
        parseInt(formData.get("quantity")) * parseFloat(formData.get("price")),
    };

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

  invoiceItems.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.loadType}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.shakara}</td>
            <td>${item.price}</td>
            <td>${item.total}</td>
            <td>
                <button class="btn btn-danger" onclick="removeItem(${index})">حذف</button>
            </td>
        `;
    tableBody.appendChild(row);
    totalAmount += item.total;
  });

  // Update total amount
  document.getElementById("total-amount").textContent = totalAmount;
}

// Remove item from invoice
function removeItem(index) {
  invoiceItems.splice(index, 1);
  updateInvoiceTable();
}

// Handle save invoice
document.getElementById("save-invoice").addEventListener("click", function () {
  const invoiceForm = document.getElementById("invoice-form");
  const formData = new FormData(invoiceForm);

  const invoiceData = {
    customerName: formData.get("customer-name"),
    country: formData.get("country"),
    date: formData.get("date"),
    driverName: formData.get("driver-name"),
    items: invoiceItems,
    totalAmount: invoiceItems.reduce((sum, item) => sum + item.total, 0),
  };

  // Here you would typically send the data to your backend
  console.log("Invoice data:", invoiceData);

  // If print is checked, trigger print
  if (document.getElementById("print").checked) {
    window.print();
  }

  // Reset forms and clear items
  invoiceForm.reset();
  document.getElementById("product-form").reset();
  invoiceItems = [];
  updateInvoiceTable();
});
