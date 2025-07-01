// gestión de datos con Objetos, Sets y Maps

// Paso 1: Creación del objeto con 3 productos únicos
const productos = {
  producto1: { id: 1, nombre: "Laptop", precio: 3500 },
  producto2: { id: 2, nombre: "Teclado", precio: 120 },
  producto3: { id: 3, nombre: "Audífonos", precio: 250 }
};

// Validación: Asegurar que todos los productos tengan datos completos
for (let key in productos) {
  const prod = productos[key];
  if (!prod.id || !prod.nombre || !prod.precio) {
    console.error(`El producto ${key} tiene datos incompletos.`);
  }
}

// Paso 2: Conversión a Set (productos únicos)
const setProductos = new Set();

// Añadir los productos al set (convirtiendo los objetos a JSON para evitar duplicados)
for (let key in productos) {
  const prod = productos[key];
  const prodStr = JSON.stringify(prod); // Convertimos a string para comparar
  let duplicado = false;
  for (let p of setProductos) {
    if (JSON.stringify(p) === prodStr) {
      duplicado = true;
      break;
    }
  }
  if (!duplicado) {
    setProductos.add(prod);
  }
}

// Paso 3: Crear un Map para asociar categorías con productos
const categoriasMap = new Map();
categoriasMap.set("Electrónica", "Laptop");
categoriasMap.set("Accesorios", "Teclado");
categoriasMap.set("Audio", "Audífonos");

// Paso 4: Recorrer e imprimir los datos

// 4.1 Recorrer el objeto con for...in
console.log("🔹 Productos (objeto):");
for (let key in productos) {
  const { id, nombre, precio } = productos[key];
  console.log(`ID: ${id}, Nombre: ${nombre}, Precio: $${precio}`);
}

// 4.2 Recorrer el Set con for...of
console.log("\n🔹 Productos únicos (Set):");
for (let prod of setProductos) {
  console.log(`ID: ${prod.id}, Nombre: ${prod.nombre}, Precio: $${prod.precio}`);
}

// 4.3 Recorrer el Map con forEach
console.log("\n🔹 Categorías (Map):");
categoriasMap.forEach((producto, categoria) => {
  console.log(`Categoría: ${categoria}, Producto: ${producto}`);
});

// Paso 5: Pruebas finales
console.log("\n✅ Pruebas completadas:");
console.log("- Lista completa de productos (objeto):", Object.values(productos));
console.log("- Lista de productos únicos (Set):", [...setProductos]);
console.log("- Categorías y productos (Map):", Array.from(categoriasMap.entries()));
