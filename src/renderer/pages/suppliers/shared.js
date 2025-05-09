// Helper Functions =====
const collectFormData = (formEl) => {
  const formData = new FormData(formEl);
  const dataObj = {};
  formData.forEach((value, key) => (dataObj[key] = value));
  return dataObj;
};
