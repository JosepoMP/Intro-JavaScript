const apiUrl = 'http://localhost:3000/productos';

    const productoForm = document.getElementById('productoForm');
    const productosDiv = document.getElementById('productos');

    // Mostrar productos
    async function obtenerProductos() {
      try {
        const res = await fetch(apiUrl);
        const productos = await res.json();
        productosDiv.innerHTML = '';
        productos.forEach(producto => {
          const div = document.createElement('div');
          div.className = 'producto';
          div.innerHTML = `
            <span><strong>${producto.nombre}</strong> - $${producto.precio}</span>
            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
          `;
          productosDiv.appendChild(div);
        });
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    }

    // Crear producto
    productoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const precio = parseFloat(document.getElementById('precio').value);

      if (!nombre || isNaN(precio)) {
        alert('Por favor completa correctamente los campos.');
        return;
      }

      const nuevoProducto = { nombre, precio };

      try {
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoProducto)
        });
        productoForm.reset();
        obtenerProductos();
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    });

    // Eliminar producto
    async function eliminarProducto(id) {
      try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        obtenerProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }

    // Inicial
    obtenerProductos();
