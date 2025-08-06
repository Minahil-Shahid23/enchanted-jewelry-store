// ======================= 🛒 CART SETUP ========================
let cart = [];
let isBuy = false;
let appliedDiscount = 0;

// Check Buy Now
const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
if (buyNowItem) {
  cart = [buyNowItem];
  isBuy = true;
  localStorage.removeItem("buyNowItem");
} else {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

const cartSummary = document.querySelector(".cart-summary");

// ===================== 📦 RENDER CART ITEMS ====================
function renderCartItems() {
  const oldItems = document.querySelectorAll(".cart-summary .cart-item");
  oldItems.forEach(item => item.remove());

  cart.forEach(product => {
    const item = document.createElement("div");
    item.classList.add("cart-item");

    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <p>${product.name}</p>
        <span>Rs. ${(product.price * product.quantity).toFixed(2)}</span>
      </div>
    `;

    cartSummary.insertBefore(item, document.querySelector(".discount-code"));
  });
}

// =================== 🚚 GET SHIPPING COST ===================
function getShippingCost() {
  const shippingDropdown = document.getElementById("shipping-method");
  if (shippingDropdown) {
    shippingDropdown.addEventListener("change", updateSummary);
  }

  const value = shippingDropdown ? parseFloat(shippingDropdown.value) : NaN;
  return isNaN(value) ? 200 : value;
}

function calculateTotal() {
  let subtotal = 0;
  cart.forEach(p => subtotal += p.price * p.quantity);
  const shipping = getShippingCost();
  const discountAmount = (appliedDiscount * subtotal) / 100;
  return subtotal + shipping - discountAmount;
}

// =================== 💰 UPDATE PRICE SUMMARY ===================
function updateSummary() {
  let subtotal = 0;
  cart.forEach(p => subtotal += p.price * p.quantity);
  const shipping = getShippingCost();
  const discountAmount = (appliedDiscount * subtotal) / 100;
  const total = subtotal + shipping - discountAmount;

  document.querySelector(".price-summary").innerHTML = `
    <p>Subtotal: <span>Rs. ${subtotal.toFixed(2)}</span></p>
    <p>Shipping: <span>Rs. ${shipping.toFixed(2)}</span></p>
    <p>Discount: <span>-Rs. ${discountAmount.toFixed(2)}</span></p>
    <h4>Total: <span>Rs. ${total.toFixed(2)}</span></h4>
  `;
}

// ==================== 🎟️ APPLY DISCOUNT CODE ====================
document.querySelector(".discount-code button").addEventListener("click", () => {
  const input = document.querySelector(".discount-code input");
  const code = input.value.trim().toUpperCase();

  if (code === "MAGIC10") {
    appliedDiscount = 10;
    alert("🎉 Discount applied!");
  } else {
    appliedDiscount = 0;
    alert("⚠️ Invalid discount code.");
  }

  updateSummary();
});

// ======================= 🚀 INIT CALLS =========================
renderCartItems();
updateSummary();

// ========= ✅ FORM VALIDATION ============

function validateAndSubmitForm() {
  document.querySelectorAll(".error").forEach(el => el.innerText = "");

  const email = document.querySelector(".email");
  const first = document.querySelector(".first");
  const last = document.querySelector(".last");
  const country = document.querySelector(".country");
  const shipping = document.querySelector(".shipping");
  const address = document.querySelector(".address");
  const city = document.querySelector(".city");
  const state = document.querySelector(".state");
  const zip = document.querySelector(".zip");
  const phone = document.querySelector(".phone");
  const checkbox = document.querySelector(".checkbox");

  let valid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+92\d{10}$/;

  if (!email.value.trim()) {
    email.nextElementSibling.innerText = "Email is required.";
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    email.nextElementSibling.innerText = "Enter a valid email (e.g. abc@gmail.com).";
    valid = false;
  }

  if (!first.value.trim()) {
    first.nextElementSibling.innerText = "First name is required.";
    valid = false;
  }

  if (!last.value.trim()) {
    last.nextElementSibling.innerText = "Last name is required.";
    valid = false;
  }

  if (!country.value.trim()) {
    country.nextElementSibling.innerText = "Select your country.";
    valid = false;
  }

  if (!shipping.value.trim()) {
    shipping.nextElementSibling.innerText = "Choose a shipping method.";
    valid = false;
  }

  if (!address.value.trim()) {
    address.nextElementSibling.innerText = "Address is required.";
    valid = false;
  }

  if (!city.value.trim()) {
    city.nextElementSibling.innerText = "City is required.";
    valid = false;
  }

  if (!state.value.trim()) {
    state.nextElementSibling.innerText = "State is required.";
    valid = false;
  }

  if (!zip.value.trim()) {
    zip.nextElementSibling.innerText = "ZIP code is required.";
    valid = false;
  }

  const phoneValue = phone.value.trim();
  if (!phoneValue) {
    phone.nextElementSibling.innerText = "Phone number is required.";
    valid = false;
  } else if (!phoneRegex.test(phoneValue)) {
    phone.nextElementSibling.innerText = "Phone must start with +92 and be followed by 10 digits. (+921234567890)";
    valid = false;
  }

  const termsError = checkbox.closest(".form-group").querySelector(".error");
  if (!checkbox.checked) {
    termsError.innerText = "You must accept the terms.";
    valid = false;
  }

  if (valid) {
    const orderData = {
      name: `${first.value.trim()} ${last.value.trim()}`,
      email: email.value.trim(),
      address: address.value.trim(),
      city: city.value.trim(),
      state: state.value.trim(),
      zip: zip.value.trim(),
      phone: phone.value.trim(),
      country: country.value.trim(),
      shippingMethod: parseFloat(shipping.value),
      items: cart,
      total: calculateTotal()
    };

    axios.post("http://localhost:8025/api/orders", orderData)
      .then(res => {
        alert("🎉 Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "thankyou.html";
      })
      .catch(err => {
        console.error("❌ Order failed", err);
        alert("⚠️ Failed to place order. Please try again.");
      });
  }
}

// ✅ Only this button triggers validation and order submission
document.querySelector(".place-order-btn").addEventListener("click", (e) => {
  e.preventDefault();
  validateAndSubmitForm();
});
