
import { deleteUser } from "./api.js";
import { openModalForEdit } from "./modal.js";
import { loadUsers, showToast, showLoader, hideLoader } from "./app.js";

export function renderUsers(users) {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.enrollNumber}</td>
      <td>${user.dateOfAdmission}</td>
      <td>
        <button class="edit-btn" data-id="${user.id}">Editar</button>
        <button class="delete-btn" data-id="${user.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", () => openModalForEdit(btn.dataset.id))
  );

  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", async () => {
      if (confirm("¿Eliminar este usuario?")) {
        showLoader();
        await deleteUser(btn.dataset.id);
        showToast("Usuario eliminado 🗑️");
        await loadUsers();
        hideLoader();
      }
    })
  );
}
