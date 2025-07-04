// gestion_api.js

const apiUrl = 'http://localhost:3000/productos';

// Validar producto
function validarProducto(producto) {
  if (!producto.nombre || !producto.precio) {
    console.error('Todos los campos son requeridos.');
    return false;
  }
  if (isNaN(producto.precio)) {
    console.error('El precio debe ser un número válido.');
    return false;
  }
  return true;
}

// Obtener productos (GET)
function obtenerProductos() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => console.log('Productos:', data))
    .catch(error => console.error('Error al obtener productos:', error));
}

// Crear producto (POST)
function crearProducto(producto) {
  if (!validarProducto(producto)) return;

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  })
    .then(res => res.json())
    .then(data => console.log('Producto creado:', data))
    .catch(error => console.error('Error al crear producto:', error));
}

// Actualizar producto (PUT)
function actualizarProducto(id, productoActualizado) {
  if (!validarProducto(productoActualizado)) return;

  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productoActualizado)
  })
    .then(res => res.json())
    .then(data => console.log('Producto actualizado:', data))
    .catch(error => console.error('Error al actualizar producto:', error));
}

// Eliminar producto (DELETE)
function eliminarProducto() {
  fetch(`${apiUrl}/${id}`,  {
    method: 'DELETE'
  })
    .then(() => console.log(`Producto con ID ${id} eliminado.`))
    .catch(error => console.error('Error al eliminar producto:', error));
}

// Pruebas
obtenerProductos();

crearProducto({ nombre: 'Laptop', precio: 4500 });
actualizarProducto({ nombre: 'Laptop Pro', precio: 6000 });
eliminarProducto(id);
