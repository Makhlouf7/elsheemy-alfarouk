// Array to store appointments
let appointments = [];

// Sample data for testing
const sampleAppointments = [
  {
    id: 1,
    customerName: "محمد أحمد",
    date: "2024-03-20",
    time: "14:30",
    notes: "تسليم طلبية خاصة",
  },
  {
    id: 2,
    customerName: "علي محمود",
    date: "2024-03-21",
    time: "10:00",
    notes: "تسليم منتجات جديدة",
  },
];

// Initialize appointments with sample data
appointments = [...sampleAppointments];

// DOM Elements
const form = document.getElementById("delivery-form");
const customerNameInput = document.getElementById("customer-name");
const deliveryDateInput = document.getElementById("delivery-date");
const deliveryTimeInput = document.getElementById("delivery-time");
const notesInput = document.getElementById("notes");
const clearButton = document.getElementById("clear-fields");
const addButton = document.getElementById("add-appointment");
const updateButton = document.getElementById("update-appointments");
const appointmentsTableBody = document.getElementById(
  "appointments-table-body"
);

// Clear form fields
clearButton.addEventListener("click", () => {
  form.reset();
});

// Add new appointment
addButton.addEventListener("click", () => {
  if (!form.checkValidity()) {
    alert("الرجاء ملء جميع الحقول المطلوبة");
    return;
  }

  const newAppointment = {
    id: appointments.length + 1,
    customerName: customerNameInput.value,
    date: deliveryDateInput.value,
    time: deliveryTimeInput.value,
    notes: notesInput.value,
  };

  appointments.push(newAppointment);
  updateAppointmentsTable();
  form.reset();
});

// Update appointments table
function updateAppointmentsTable() {
  appointmentsTableBody.innerHTML = "";

  appointments.forEach((appointment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${appointment.customerName}</td>
            <td>${formatDate(appointment.date)}</td>
            <td>${appointment.time}</td>
            <td>${appointment.notes || "-"}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="editAppointment(${
                      appointment.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteAppointment(${
                      appointment.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    appointmentsTableBody.appendChild(row);
  });
}

// Edit appointment
function editAppointment(id) {
  const appointment = appointments.find((a) => a.id === id);
  if (appointment) {
    customerNameInput.value = appointment.customerName;
    deliveryDateInput.value = appointment.date;
    deliveryTimeInput.value = appointment.time;
    notesInput.value = appointment.notes;

    // Remove the appointment from the list
    appointments = appointments.filter((a) => a.id !== id);
    updateAppointmentsTable();
  }
}

// Delete appointment
function deleteAppointment(id) {
  if (confirm("هل أنت متأكد من حذف هذا الموعد؟")) {
    appointments = appointments.filter((a) => a.id !== id);
    updateAppointmentsTable();
  }
}

// Format date to Arabic format
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Update appointments button
updateButton.addEventListener("click", () => {
  updateAppointmentsTable();
});

// Initialize the page
updateAppointmentsTable();
