import { getUsers } from "./api.js";
import { renderUsers } from "./ui.js";

export async function loadUsers() {
  showLoader();
  const users = await getUsers();
  renderUsers(users);
  hideLoader();
}

export function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

export function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

export function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", loadUsers);
