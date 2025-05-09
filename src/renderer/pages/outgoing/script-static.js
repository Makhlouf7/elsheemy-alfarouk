// Static script file for outgoing page
// This file contains only the necessary event handlers for buttons
// All data is static and defined in the HTML

// Handle print button click
document.getElementById("print-invoice").addEventListener("click", function () {
  // Open customer invoice new page with auto print parameter
  window.open('./customer-invoice-new.html?autoPrint=true', '_blank');
});

// Handle save button click
document.getElementById("save-invoice").addEventListener("click", function () {
  // Show success message
  alert("تم حفظ الفاتورة بنجاح");
  
  // If print is checked, open print preview
  if (document.getElementById("print").checked) {
    window.open('./print-preview.html?autoPrint=true', '_blank');
  }
});

// Handle add to invoice button click
document.getElementById("add-to-invoice").addEventListener("click", function () {
  // Show success message
  alert("تم إضافة المنتج إلى الفاتورة");
  
  // Reset form
  document.getElementById("product-form").reset();
});

// Handle delete buttons
document.querySelectorAll(".btn-danger").forEach(function(button) {
  button.addEventListener("click", function() {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      alert("تم الحذف بنجاح");
    }
  });
});
