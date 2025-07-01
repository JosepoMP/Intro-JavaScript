# 🧠 Interactive System | Sistema Interactivo

This is a simple browser-based JavaScript program that interacts with the user through prompts and displays customized messages based on their age.  
Este es un programa sencillo en JavaScript que se ejecuta en el navegador, interactúa con el usuario mediante `prompts` y muestra mensajes personalizados según su edad.

---

## 📁 Files Included | Archivos Incluidos

- `index.html`: The HTML file that loads and runs the JavaScript in a browser.  
  El archivo HTML que carga y ejecuta el JavaScript en el navegador.

- `interactive_system.js`: The JavaScript file that contains all the interactive logic.  
  El archivo JavaScript que contiene toda la lógica interactiva.

---

## 💡 How It Works | ¿Cómo Funciona?

1. When you open the `index.html` file in your browser, it loads the JavaScript file.  
   Al abrir el archivo `index.html` en el navegador, se carga el archivo JavaScript.

2. The script immediately asks the user two questions:  
   El script le pregunta inmediatamente al usuario dos cosas:
   - What's your name? / ¿Cuál es tu nombre?
   - How old are you? / ¿Cuántos años tienes?

3. The user's input is validated:  
   La entrada del usuario se valida:
   - Name must not be empty. / El nombre no debe estar vacío.
   - Age must be a number, non-negative, and realistic (below 120).  
     La edad debe ser un número, no negativa y realista (menor a 120).

4. Based on the age entered, a personalized message is shown in the console.  
   Según la edad ingresada, se muestra un mensaje personalizado en la consola.

---

## 🧪 Example Outputs | Ejemplos de Salida

**Input / Entrada:**

- Name / Nombre: Sarah  
- Age / Edad: 10  
→ Output / Salida: `Hi Sarah 👋, great to start young! It's never too late to learn 😊`

---

- Name / Nombre: John  
- Age / Edad: 22  
→ Output / Salida: `Hi John, you have a bright future ahead in the tech world! 🌍`

---

- Name / Nombre: Carlos  
- Age / Edad: 130  
→ Output / Salida: `Error: Are you sure about that age? It seems unlikely!`  
→ `Error: ¿Estás seguro de esa edad? ¡Parece poco probable!`

---

## 🛠 Technologies Used | Tecnologías Utilizadas

- HTML5  
- Vanilla JavaScript (no frameworks)  
- Browser console for output / Consola del navegador para mostrar resultados

---

## 🚀 How to Run It | Cómo Ejecutarlo

1. Download or clone the repository.  
   Descarga o clona el repositorio.

2. Open `index.html` in your preferred browser.  
   Abre `index.html` en tu navegador favorito.

3. Open the browser console (Right click → Inspect → Console).  
   Abre la consola del navegador (Clic derecho → Inspeccionar → Consola).

4. Follow the prompts and see the responses.  
   Sigue los `prompts` y observa las respuestas.

---

## 🧼 Notes | Notas

- All messages are displayed in the **browser console**, not on the web page.  
  Todos los mensajes se muestran en la **consola del navegador**, no en la página.

- This app is great for educational purposes to learn about:  
  Esta app es ideal con fines educativos para aprender sobre:
  - `prompt()`, `console.log()`, `console.error()`
  - Type conversion with `Number()` / Conversión de tipos con `Number()`
  - Conditional statements (`if`, `else if`) / Condicionales
  - Basic error handling and validation / Validaciones básicas

---

## 📄 License | Licencia

This project is open source and free to use for educational or personal projects.  
Este proyecto es de código abierto y puede usarse libremente con fines educativos o personales.

---

## ✨ Author | Autor

Made with ❤️ by Jose.  
Hecho con ❤️ por Jose.
