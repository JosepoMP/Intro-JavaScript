// Captura de datos
let nombre = prompt("¿Cuál es tu nombre?").trim();
let edadTexto = prompt("¿Cuál es tu edad?").trim();

// Conversión y validación
let edad = Number(edadTexto);

// Validaciones y mensajes
if (nombre === "") {
  console.error("Error: El nombre no puede estar vacío.");
} else if (isNaN(edad)) {
  console.error("Error: La edad ingresada no es un número válido.");
} else if (edad < 0) {
  console.error("Error: La edad no puede ser un número negativo.");
} else if (edad > 120) {
  console.error("Error: ¿Estás seguro de esa edad? ¡Parece poco probable!");
} else {
  if (edad < 12) {
    console.log(`Hola ${nombre} 👋, ¡qué bueno que empieces desde pequeño! Nunca es tarde para aprender 😊`);
  } else if (edad >= 12 && edad <= 17) {
    console.log(`Hola ${nombre}, eres menor de edad. ¡Sigue aprendiendo y diviértete programando! 🚀`);
  } else if (edad >= 18 && edad <= 24) {
    console.log(`Hola ${nombre}, ¡tienes todo un futuro por delante para explorar el mundo tech! 🌍`);
  } else {
    console.log(`Hola ${nombre}, ¡la programación no tiene edad! Sigue creciendo y creando cosas increíbles 💻✨`);
  }
}
