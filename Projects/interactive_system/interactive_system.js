// Data capture
let name = prompt("What's your name?").trim();
let ageText = prompt("How old are you?").trim();

// Conversion and validation
let age = Number(ageText);

// Validations and messages
if (name === "") {
  console.error("Error: Name cannot be empty.");
} else if (isNaN(age)) {
  console.error("Error: The entered age is not a valid number.");
} else if (age < 0) {
  console.error("Error: Age cannot be a negative number.");
} else if (age > 120) {
  console.error("Error: Are you sure about that age? It seems unlikely!");
} else {
  if (age < 12) {
    console.log(`Hi ${name} 👋, great to start young! It's never too late to learn 😊`);
  } else if (age >= 12 && age <= 17) {
    console.log(`Hi ${name}, you're underage. Keep learning and have fun coding! 🚀`);
  } else if (age >= 18 && age <= 24) {
    console.log(`Hi ${name}, you have a bright future ahead in the tech world! 🌍`);
  } else {
    console.log(`Hi ${name}, programming has no age limits! Keep growing and building amazing things 💻✨`);
  }
}
