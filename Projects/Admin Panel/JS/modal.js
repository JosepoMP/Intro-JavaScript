import { createUser, getUsers, updateUser } from "./api.js";
import { loadUsers, showToast } from "./app.js";

const modal = document.getElementById("userModal");
const form = document.getElementById("userForm");
const userIdInput = document.getElementById("userId");

export function openModalForEdit(id) {
  modal.classList.remove("hidden");
  modal.classList.add("visible");
  form.reset();

  getUsers().then((users) => {
    const user = users.find((u) => u.id == id);
    if (user) {
      form.name.value = user.name;
      form.email.value = user.email;
      form.phone.value = user.phone;
      form.enrollNumber.value = user.enrollNumber;
      form.dateOfAdmission.value = user.dateOfAdmission;
      userIdInput.value = user.id;

      localStorage.setItem("lastEditedUser", JSON.stringify(user));
    }
  });
}

document.getElementById("addUserBtn").addEventListener("click", () => {
  form.reset();
  userIdInput.value = "";
  modal.classList.remove("hidden");
  modal.classList.add("visible");
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.classList.remove("visible");
  modal.classList.add("hidden");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    enrollNumber: form.enrollNumber.value.trim(),
    dateOfAdmission: form.dateOfAdmission.value,
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    showToast("Email inválido ❌");
    return;
  }

  if (user.enrollNumber.length !== 6 || !/^\d{6}$/.test(user.enrollNumber)) {
  showToast("La matrícula debe tener exactamente 6 dígitos numéricos ❌");
  return;
}

  try {
    if (userIdInput.value) {
      await updateUser(userIdInput.value, user);
      localStorage.setItem("lastEditedUser", JSON.stringify(user));
      showToast("Usuario actualizado ✅");
    } else {
      await createUser(user);
      showToast("Usuario creado exitosamente ✅");
    }

    modal.classList.remove("visible");
    await loadUsers();
  } catch (error) {
    showToast("Error al guardar el usuario ❌");
    console.error(error);
  }
});
