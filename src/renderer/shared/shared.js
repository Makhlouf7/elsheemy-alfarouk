// Helper Functions =====
const collectFormData = (formEl) => {
  const formData = new FormData(formEl);
  const dataObj = {};
  formData.forEach((value, key) => value && (dataObj[key] = value));
  return dataObj;
};

const viewMessage = (message) => {
  const card = document.createElement("div");
  card.className = "alert-card";
  card.innerHTML = `
        <div class="alert-card-body">
            <p>${message}</p>
        </div>
    `;
  console.log("Terrible");
  document.body.appendChild(card);

  // Optional: auto-remove after 5 seconds
  setTimeout(() => {
    card.remove();
  }, 5000);
};
