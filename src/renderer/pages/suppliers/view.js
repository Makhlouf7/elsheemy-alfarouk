// Defining Elements =====
const supplierNameEl = document.getElementById("supplier-name-display");
const contactPersonEl = document.getElementById(
  "supplier-contact-person-display"
);
const supplierPhoneEl = document.getElementById("supplier-phone-display");
const supplierAddressEl = document.getElementById("supplier-address-display");
const supplierBalanceEl = document.getElementById("supplier-balance-paid");
const supplierTotalInvoicesEl = document.getElementById(
  "supplier-invoice-display"
);
const supplierNotesEl = document.getElementById("supplier-notes-display");
const incomingTableBody = document.getElementById("incoming-table-body");

// Defining Variables =====
const params = new URLSearchParams(location.search);
const supplierId = params.get("id");

// Functions =====
const fillData = (async () => {
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
  supplierTotalInvoicesEl.textContent =
    res.data.totalInvoices.toLocaleString("en-us");
})();

const renderIncomingTable = (incomings) => {
  incomingTableBody.innerHTML = "";
  incomings.forEach((doc) => {
    incomingTableBody.insertAdjacentHTML(
      "beforeend",
      `<tr>
                    <td>${doc.date.toLocaleString("en-gb", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}</td>
                    <td>${doc.type}</td>
                    <td>${doc.quantity}</td>
                    <td>${doc.carNumber}</td>
                    <td>${doc.price.toLocaleString("en-us")}</td>
                    <td>${doc.loadType || "-"}</td>
                    <td>${doc.category || "-"}</td>
                    <td>${(doc.price * doc.quantity).toLocaleString(
                      "en-us"
                    )}</td>
                    
                  </tr>`
    );
  });
};

const fetchAndRenderIncoming = (async () => {
  const res = await window.dbAPI.getDocBySearch({
    modelName: "Incoming",
    filterOptions: { supplier: supplierId },
  });

  if (!res.success) {
    viewMessage("حدث خطأ في احضار البيانات");
    return;
  }
  renderIncomingTable(res.data);
})();
