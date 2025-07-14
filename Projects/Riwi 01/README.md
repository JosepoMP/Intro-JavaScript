# Sistema de Gestión de Eventos - SPA

Una aplicación web de página única (SPA) para la gestión de eventos desarrollada con HTML5, CSS3 y JavaScript Vanilla.

## 🚀 Características

- **Autenticación de usuarios** (Login/Registro)
- **Gestión de eventos** (Crear, editar, eliminar, ver)
- **Sistema de registros** (Inscribirse/cancelar inscripción)
- **Panel de administración** (Solo para administradores)
- **Interfaz responsive** (Compatible con móviles)
- **Persistencia de datos** (LocalStorage + db.json)

## 📁 Estructura del Proyecto

\`\`\`
event-management-spa/
├── index.html          # Página principal
├── style.css           # Estilos CSS
├── script.js           # Lógica JavaScript
├── db.json            # Base de datos simulada
└── README.md          # Documentación
\`\`\`

## 🛠️ Instalación y Uso

### Opción 1: Servidor Local Simple
\`\`\`bash
# Clonar o descargar el proyecto
# Abrir index.html directamente en el navegador
\`\`\`

### Opción 2: Con json-server (Recomendado)
\`\`\`bash
# Instalar json-server globalmente
npm install -g json-server

# Ejecutar el servidor de datos
json-server --watch db.json --port 3001

# Abrir index.html en el navegador
\`\`\`

### Opción 3: Con Live Server (VS Code)
\`\`\`bash
# Instalar la extensión Live Server en VS Code
# Hacer clic derecho en index.html > "Open with Live Server"
\`\`\`

## 👥 Cuentas de Prueba

### Administrador
- **Usuario:** admin
- **Contraseña:** admin123
- **Permisos:** Crear, editar y eliminar eventos, gestionar usuarios

### Usuario Regular
- **Usuario:** user
- **Contraseña:** user123
- **Permisos:** Ver eventos, registrarse en eventos

## 🎯 Funcionalidades

### Para Usuarios Regulares:
- ✅ Registrarse en la plataforma
- ✅ Iniciar sesión
- ✅ Ver lista de eventos disponibles
- ✅ Registrarse en eventos
- ✅ Cancelar registro de eventos
- ✅ Ver sus eventos registrados

### Para Administradores:
- ✅ Todas las funcionalidades de usuario regular
- ✅ Crear nuevos eventos
- ✅ Editar eventos existentes
- ✅ Eliminar eventos
- ✅ Ver panel de administración
- ✅ Gestionar usuarios
- ✅ Ver estadísticas del sistema

## 🔧 Tecnologías Utilizadas

- **HTML5:** Estructura semántica
- **CSS3:** Estilos y diseño responsive
- **JavaScript Vanilla:** Lógica de la aplicación
- **JSON:** Almacenamiento de datos
- **LocalStorage:** Persistencia de sesión

## 📱 Características Técnicas

- **SPA (Single Page Application):** Navegación sin recarga de página
- **Responsive Design:** Compatible con dispositivos móviles
- **Validación de formularios:** Validación en tiempo real
- **Gestión de estado:** Control de sesiones y datos
- **Notificaciones:** Sistema de mensajes para el usuario
- **Modales:** Interfaz intuitiva para formularios

## 🎨 Diseño

- **Paleta de colores moderna**
- **Tipografía legible** (Arial/Sans-serif)
- **Iconos Font Awesome**
- **Animaciones CSS suaves**
- **Grid y Flexbox** para layouts

## 🔒 Seguridad

- Validación de entrada de datos
- Control de acceso basado en roles
- Sanitización básica de datos
- Gestión segura de sesiones

## 📊 Base de Datos (db.json)

La aplicación utiliza un archivo JSON que simula una base de datos con las siguientes entidades:

- **users:** Información de usuarios
- **events:** Datos de eventos
- **registrations:** Registros de usuarios en eventos

## 🚀 Despliegue

Para subir a GitHub:

\`\`\`bash
git init
git add .
git commit -m "Initial commit: Event Management SPA"
git remote add origin https://github.com/tuusuario/event-management-spa.git
git push -u origin main
\`\`\`

## 📝 Notas para Desarrollo

- El proyecto está diseñado para ser simple y educativo
- Código comentado y bien estructurado
- Fácil de extender y modificar
- Ideal para proyectos universitarios

## 🤝 Contribuciones

Este es un proyecto educativo. Las mejoras y sugerencias son bienvenidas.

## 📄 Licencia

Proyecto educativo - Uso libre para fines académicos.
