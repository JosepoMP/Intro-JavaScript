```markdown
# 📡 Entregable 03 - Interacción con APIs usando JSON Server

Este proyecto es una práctica de consumo de APIs usando JavaScript puro, `fetch` y un servidor local simulado con **JSON Server**. Se trata de una interfaz sencilla para gestionar usuarios: visualizar, agregar y eliminar registros en tiempo real.

---

## 📁 Estructura del Proyecto

Entregable_03v2/
│
├── index.html         # Interfaz principal de usuario
├── gestionAPI.js      # Lógica JS para llamadas a la API
└── db.json            # Base de datos simulada (usada con JSON Server)
```

---

## 🚀 ¿Cómo Funciona?

Esta aplicación web permite:

✅ Obtener datos de usuarios desde una API local  
✅ Agregar nuevos usuarios al sistema  
✅ Eliminar usuarios directamente desde la interfaz  

Todo esto sin recargar la página, usando peticiones HTTP (`GET`, `POST`, `DELETE`) a través de `fetch`.

---

## 🛠️ Tecnologías Usadas

- HTML5
- JavaScript (fetch API)
- JSON Server (para simular un backend REST)

---

## 🧪 Guía de Instalación y Ejecución

1. Clona o descarga este repositorio.

2. Instala `json-server` globalmente si aún no lo tienes:

```bash
npm install -g json-server
```

3. Inicia el servidor con la base de datos:

```bash
json-server --watch db.json
```

Esto levantará un servidor local en `http://localhost:3000/usuarios`.

4. Abre el archivo `index.html` en tu navegador.

¡Listo! Ahora puedes interactuar con la API desde la interfaz.

---

## 📌 Explicación del Código

### `index.html`

- Contiene un formulario para ingresar un nuevo usuario.
- Muestra una lista dinámica de usuarios existentes.

### `gestionAPI.js`

- **`obtenerUsuarios()`**: Hace un `GET` a `/usuarios` y renderiza los usuarios en la página.
- **`agregarUsuario()`**: Toma los datos del formulario, los envía con un `POST` y actualiza la lista.
- **`eliminarUsuario(id)`**: Elimina el usuario con un `DELETE` y actualiza la vista.

```js
fetch("http://localhost:3000/usuarios") // Ejemplo de petición GET
fetch("http://localhost:3000/usuarios", { method: "POST", body: JSON.stringify(...) }) // POST
fetch("http://localhost:3000/usuarios/id", { method: "DELETE" }) // DELETE
```

El archivo `gestionAPI.js` está vinculado desde el HTML y maneja todos los eventos con `addEventListener`.

---

## 📷 Vista Previa (Estructura Visual)

```
+--------------------------------------+
| Nombre: [__________] [Agregar]       |
+--------------------------------------+
| 📋 Lista de Usuarios:                |
|  - Juan Pérez     [❌ Eliminar]      |
|  - Ana Torres     [❌ Eliminar]      |
+--------------------------------------+
```

---

## ✨ Contribuciones o Créditos

Proyecto realizado como parte del entrenamiento académico en desarrollo web.

Autor: **Jose Patiño**  
Contacto: [LinkedIn](https://www.linkedin.com/in/jose-pati%C3%B1o-77b1892ab/) | [Instagram](https://www.instagram.com/josemig.p/) | Gmail: `josepatinohincapie@gmail.com`

---

## 🧠 Aprendizajes Clave

- Cómo simular un backend real con JSON Server.
- Uso de `fetch` para enviar y recibir datos.
- Manipulación del DOM de forma dinámica.
- Trabajo asincrónico con Promesas en JavaScript.

---

## 🐞 Notas Finales

Asegúrate de que `JSON Server` esté activo **antes** de cargar el archivo `index.html`. De lo contrario, no se podrán hacer peticiones.

---

> _Este proyecto es una excelente base para construir aplicaciones CRUD completas en el futuro._
```
