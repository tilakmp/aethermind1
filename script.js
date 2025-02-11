// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 56, // Adjust for fixed navbar height
        behavior: "smooth",
      });
    }
  });
});

// Back-to-Top Button Functionality
const backToTopButton = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  backToTopButton.style.display = window.scrollY > 300 ? "block" : "none";
});
backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Fade-In Animations Using Intersection Observer
document.addEventListener("DOMContentLoaded", function () {
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach((fader) => appearOnScroll.observe(fader));
});

// Three.js - 3D Design in Hero Section
const canvas = document.getElementById("hero-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight * 0.7); // 70% viewport height
renderer.setClearColor(0x222222, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight * 0.7),
  0.1,
  1000
);
camera.position.z = 5;

// Add lighting so the black cube is visible
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create a larger cube (2x2x2) with a black Phong material for a matte finish
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshPhongMaterial({
  color: 0x000000,
  shininess: 50,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animation loop for 3D scene
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Adjust canvas size on window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
  camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
  camera.updateProjectionMatrix();
});

/* Chatbot Functionality */
// Open the chatbot modal when "Club Chat" is clicked
document.getElementById("open-chatbot").addEventListener("click", function (e) {
  e.preventDefault();
  $("#chatbotModal").modal("show");
});

// Append a new chat message to the chat window
function appendMessage(message, sender) {
  const messageElem = document.createElement("div");
  messageElem.classList.add("chat-message", sender);
  messageElem.innerText = message;
  const chatContainer = document.getElementById("chatbot-messages");
  chatContainer.appendChild(messageElem);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
}

// Handle sending a message from the user
function sendMessage() {
  const inputField = document.getElementById("chatbot-input");
  const userMessage = inputField.value.trim();
  if (!userMessage) return;
  appendMessage(userMessage, "user");
  inputField.value = "";

  // Call the free chatbot API with botname=botme
  fetch(
    "https://api.affiliateplus.xyz/api/chatbot?message=" +
      encodeURIComponent(userMessage) +
      "&botname=botme&ownername=AetherMind"
  )
    .then((response) => response.json())
    .then((data) => {
      // Append bot response; fallback message if needed.
      const botMessage =
        data.message || "Oops, I'm momentarily out of jokes. Try again!";
      appendMessage(botMessage, "bot");
    })
    .catch((error) => {
      appendMessage("Sorry, I got a bit confused. Please try again!", "bot");
      console.error("Chatbot API error:", error);
    });
}

// Send message when send button is clicked
document.getElementById("chatbot-send").addEventListener("click", sendMessage);

// Also send message when Enter key is pressed in the input field
document
  .getElementById("chatbot-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
