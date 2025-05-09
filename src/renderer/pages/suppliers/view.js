// Defining Elements =====
const supplierNameEl = document.getElementById("supplier-name-display");
const contactPersonEl = document.getElementById(
  "supplier-contact-person-display"
);
const supplierPhoneEl = document.getElementById("supplier-phone-display");
const supplierAddressEl = document.getElementById("supplier-address-display");
const supplierBalanceEl = document.getElementById("supplier-balance-display");
const supplierNotesEl = document.getElementById("supplier-notes-display");

// Defining Variables =====
const params = new URLSearchParams(location.search);
const supplierId = params.get("id");

// Functions =====
const fillData = async () => {
  const res = await window.dbAPI.getDocById({
    modelName: "Supplier",
    id: supplierId,
  });

  if (!res.success) {
    viewMessage("حدث خطأ في احضار البيانات");
    return;
  }

  supplierNameEl.textContent = res.data.name;
  contactPersonEl.textContent = res.data.contactPerson;
  supplierPhoneEl.textContent = res.data.phone;
  supplierAddressEl.textContent = res.data.address;
  supplierBalanceEl.textContent =
    res.data.openingBalance.toLocaleString("en-us");
  supplierNotesEl.textContent = res.data.notes;
};

fillData();
