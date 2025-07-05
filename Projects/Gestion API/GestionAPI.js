const baseUrl = 'http://localhost:3000/productos';

// Validar que el producto tenga nombre y precio válido
function validarProducto(producto) {
  if (!producto.nombre || typeof producto.precio !== 'number' || isNaN(producto.precio)) {
    console.error('❌ Producto no válido:', producto);
    return false;
  }
  return true;
}

// Renderizar productos en el HTML
function renderizarProductos(productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';
  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `<strong>${producto.nombre}</strong> — 💲${producto.precio} <br/><em>ID: ${producto.id}</em>`;
    contenedor.appendChild(div);
  });
}

// Obtener productos (GET)
function obtenerProductos() {
  fetch(baseUrl)
    .then(response => response.json())
    .then(data => {
      console.log('📦 Productos:', data);
      renderizarProductos(data);
    })
    .catch(error => console.error('⚠️ Error al obtener productos:', error));
}

// Agregar producto (POST con ID manual persistente)
function agregarProducto() {
  const nombre = document.getElementById('nombre').value.trim();
  const precio = Number(document.getElementById('precio').value);

  if (!nombre || isNaN(precio)) {
    alert('❌ Ingresa un nombre y precio válidos.');
    return;
  }

  fetch(baseUrl)
    .then(response => response.json())
    .then(productos => {
      const existe = productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
      if (existe) {
        alert('⚠️ Ya existe un producto con ese nombre.');
        return;
      }

      const nuevoId = productos.length > 0
        ? Math.max(...productos.map(p => typeof p.id === 'number' ? p.id : 0)) + 1
        : 1;

      const nuevoProducto = { id: nuevoId, nombre, precio };

      fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      })
        .then(response => response.json())
        .then(data => {
          console.log('✅ Producto agregado:', data);
          obtenerProductos();
        })
        .catch(error => console.error('⚠️ Error al agregar producto:', error));
    });
}

// Actualizar producto (PUT con validación)
function actualizarProducto() {
  const id = Number(document.getElementById('actualizarId').value);
  const nombre = document.getElementById('nuevoNombre').value.trim();
  const precio = Number(document.getElementById('nuevoPrecio').value);

  if (!id || !nombre || isNaN(precio)) {
    alert('❌ Ingresa datos válidos para actualizar.');
    return;
  }

  fetch(`${baseUrl}/${id}`)
    .then(response => {
      if (!response.ok) throw new Error('Producto no existe');
      return response.json();
    })
    .then(() => {
      const actualizado = { id, nombre, precio };
      if (!validarProducto(actualizado)) return;

      fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      })
        .then(response => response.json())
        .then(data => {
          console.log('🔄 Producto actualizado:', data);
          obtenerProductos();
        })
        .catch(error => console.error('⚠️ Error al actualizar producto:', error));
    })
    .catch(error => {
      alert('⚠️ No se encontró producto con ese ID.');
      console.error('⚠️ Error al buscar producto:', error);
    });
}

// Eliminar producto (DELETE)
function eliminarProducto() {
  const id = Number(document.getElementById('eliminarId').value);

  if (!id) {
    alert('❌ Ingresa un ID válido.');
    return;
  }

  fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) throw new Error('Producto no existe');
      console.log(`🗑️ Producto con ID ${id} eliminado.`);
      obtenerProductos();
    })
    .catch(error => {
      alert('⚠️ No se encontró producto con ese ID.');
      console.error('⚠️ Error al eliminar producto:', error);
    });
}
