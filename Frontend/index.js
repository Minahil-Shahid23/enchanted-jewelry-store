document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".submit-btn").addEventListener("click", (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll(".error").forEach(el => el.innerText = "");

    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const interest = document.getElementById("interest");
    const message = document.getElementById("message");

    let valid = true;

    if (!fullname.value.trim()) {
      fullname.nextElementSibling.innerText = "Full name is required.";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.nextElementSibling.innerText = "Enter a valid email.";
      valid = false;
    }

    const phoneValue = phone.value.trim();
    const phoneRegex = /^\+92\d{10}$/;
    if (phoneValue && !phoneRegex.test(phoneValue)) {
      phone.nextElementSibling.innerText = "Phone must start with +92 and have 10 digits.";
      valid = false;
    }

    if (!interest.value.trim()) {
      interest.parentElement.querySelector(".error").innerText = "Please select an option.";
      valid = false;
    }

    if (!message.value.trim()) {
      message.nextElementSibling.innerText = "Message is required.";
      valid = false;
    }

    if (valid) {
      alert("✅ Thank you for contacting us!");
      document.querySelector(".contact-form").reset();
    }
  });
});



