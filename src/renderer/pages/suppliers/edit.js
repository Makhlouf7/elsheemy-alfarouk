// Defining Elements
const editSupplierForm = document.getElementById("edit-supplier-form");

// Variables
const params = new URLSearchParams(location.search);
const supplierId = params.get("id");

editSupplierForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = collectFormData(editSupplierForm);
  console.log(data);
  const res = await window.dbAPI.updateDoc({
    modelName: "Supplier",
    id: supplierId,
    data,
  });
  if (!res.success) {
    alert("حدث خطأ في التحديث");
    return;
  }
  alert("تم التحديث بنجاح");
});
