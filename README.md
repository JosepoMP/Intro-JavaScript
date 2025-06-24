# Intro-JavaScript 📚

Este es un espacio dedicado al estudio y práctica del lenguaje JavaScript desde sus fundamentos. Este espacio reúne ejercicios prácticos, scripts de prueba, mini proyectos interactivos y experimentos personales orientados a comprender y dominar los conceptos esenciales del lenguaje.

---

## 📌 Content

El repositorio está organizado temáticamente, y se irá ampliando progresivamente con nuevos ejercicios y proyectos:

| Folder                 | Descripción                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **01-variables-operators**   | Declaración de variables, tipos de datos, operadores aritméticos y lógicos. |
| **02-conditionals**          | Uso de `if`, `else`, `switch` y validación de datos.                        |
| **03-functions**             | Definición, invocación, parámetros y retorno de funciones.                  |
| **04-user-interaction**      | Captura de datos con `prompt`, `alert`, `console.log`.                      |
| **05-mini-projects**         | Scripts completos que resuelven problemas concretos mediante lógica JS.     |

---

## 💻 Ejecución de los ejercicios

Todos los ejercicios están diseñados para ser ejecutados directamente desde la consola del navegador web.

### Instrucciones:

1. Abre tu navegador (Google Chrome, Firefox, Edge, etc.).
2. Presiona `F12` o `Ctrl + Shift + I` para abrir las herramientas de desarrollador.
3. Dirígete a la pestaña **Consola**.
4. Copia y pega el contenido del archivo `.js` correspondiente.
5. Presiona `Enter` y observa los resultados.

---

## 🧪 Ejemplo destacado

Uno de los scripts incluidos es un sistema interactivo que solicita nombre y edad al usuario, y genera un mensaje personalizado basado en esa información.

```javascript
let nombre = prompt("¿Cuál es tu nombre?");
let edad = Number(prompt("¿Cuál es tu edad?"));

if (!isNaN(edad)) {
  if (edad < 18) {
    console.log(`Hola ${nombre}, sigue aprendiendo. ¡Vas por buen camino!`);
  } else {
    console.log(`Hola ${nombre}, es hora de explorar nuevas oportunidades. 🚀`);
  }
} else {
  console.error("Por favor ingresa una edad válida.");
}
```
## ✍️ Autor

**Jose Patiño**  
Desarrollador full stack en formación, con enfoque en el desarrollo web moderno utilizando tecnologías como JavaScript, HTML, CSS, y bases de datos. Este repositorio documenta mi proceso de aprendizaje práctico, desde la lógica de programación hasta la interacción con el navegador y futuras implementaciones backend.

- 🔗 GitHub: [@JosepoMP]([https://github.com/josepatino](https://github.com/JosepoMP)) 
- 📧 Email: josepatinohincapie@gmail.com
- 🌐 Portafolio: https://tuportafolio.com 
- 💼 LinkedIn: https://linkedin.com/in/josepatino

## 📢 Licencia

Este proyecto está licenciado bajo la Licencia MIT.  
Consulta el archivo [LICENSE](LICENSE) para más información.

> _“La práctica no hace al maestro. La práctica con intención, mejora constante y curiosidad, sí.”_
