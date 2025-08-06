// 🧠 STEP 1: Pehle cart ko localStorage se uthao (jo bhi user ne store kiya tha)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 📦 STEP 2: Important DOM elements dhoondo jahan cart items inject honge
const cartTable = document.querySelector(".cart-table"); // Cart ke items yahan dikhenge
const emptyMessage = document.querySelector(".empty-cart-message"); // "Cart empty" ka message
const cartTotal = document.getElementById("cart-total"); // Total price dikhane ke liye
const cartCount = document.getElementById("cart-count"); // Navbar cart badge
const proceedBtn = document.querySelector(".checkout-btn"); // Checkout button

// 🖥️ STEP 3: Ye function poora cart render karta hai HTML me
function renderCart() {
  // 🧽 Step 3.1: Pehle purana cart clear karo (sirf header chod ke)
  cartTable.innerHTML = `
    <div class="cart-row cart-row-head">
      <div class="product">Product</div>
      <div class="details">Details</div>
      <div class="quantity">Quantity</div>
      <div class="price">Price</div>
      <div></div>
    </div>
  `;

  // 👀 Step 3.2: Agar cart khaali ho, to "Your cart is empty" message show karo
  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    if (cartTotal) cartTotal.textContent = `Total: Rs. 0`;
    if (cartCount) cartCount.textContent = "0";
    return;
  } else {
    emptyMessage.style.display = "none";
  }

  // 💰 Step 3.3: Total price calculate karne ke liye variable
  let total = 0;

  // 🧾 Step 3.4: Har product ke liye ek row banao aur HTML inject karo
  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.classList.add("cart-row");

    row.innerHTML = `
      <div class="cart-img"><img src="${item.image}" alt="${item.name}"></div>
      <div class="cart-details">
        <div class="cart-title">${item.name}</div>
        <div class="cart-variant">Size: 18"</div>
      </div>
      <div class="cart-qty">
        <button class="qty-btn minus" data-index="${index}">-</button>
        <input type="number" value="${item.quantity}" min="1" max="10" readonly>
        <button class="qty-btn plus" data-index="${index}">+</button>
      </div>
      <div class="cart-price">Rs. ${item.price * item.quantity}</div>
      <div class="cart-remove" data-id="${item.id}" title="Remove"><i class="fas fa-times"></i></div>
    `;

    cartTable.appendChild(row);
  });

  // 💰 Step 3.5: Show total amount in footer
  if (cartTotal) cartTotal.textContent = `Total: Rs. ${total}`;

  // 🛒 Step 3.6: Update cart icon badge
  if (cartCount) cartCount.textContent = cart.length;

  // 🔗 Step 3.7: Attach event listeners
  attachQuantityEvents();
  attachRemoveEvents();
}

// 🛠️ STEP 4: Plus/Minus buttons ka kaam karne wala function
function attachQuantityEvents() {
  const plusBtns = document.querySelectorAll(".qty-btn.plus");
  const minusBtns = document.querySelectorAll(".qty-btn.minus");

  plusBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      cart[index].quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();

    });
  });

  minusBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1); // remove product
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();

    });
  });
}

// 🚀 STEP 5: Page load hote hi cart show karne ke liye function call karo
renderCart();

// 🛒 STEP 6: Proceed to Checkout Button ka kaam
proceedBtn.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    proceedBtn.disabled = true;
    proceedBtn.classList.add("disabled");
  } else {
    proceedBtn.disabled = false;
    proceedBtn.classList.remove("disabled");
    window.location.href = "checkout.html";
  }
});




// ❌ STEP 7: Remove individual item from cart
function attachRemoveEvents() {
  const removeBtns = document.querySelectorAll(".cart-remove");

  removeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");

      cart = cart.filter(item => item.id !== id);

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();


      // ✅ Show toast message
      const toast = document.getElementById("toast");
      if (toast) {
        toast.style.display = "block";
        toast.textContent = "Removed from Cart";
        setTimeout(() => (toast.style.display = "none"), 1500);
      }
    });
  });




  // 🧹 Also handle clear cart button inside this function
  const clearCartBtn = document.querySelector(".clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        const toast = document.getElementById("toast");
        if (toast) {
          toast.style.display = "block";
          toast.textContent = "Cart is already empty";
          setTimeout(() => (toast.style.display = "none"), 1500);
        }
        return;
      }

      cart = [];
      localStorage.removeItem("cart");
      renderCart();
      updateCartCount();


      if (cartCount) cartCount.textContent = "0";

      const toast = document.getElementById("toast");
      if (toast) {
        toast.style.display = "block";
        toast.textContent = "Cart Cleared";
        setTimeout(() => (toast.style.display = "none"), 1500);
      }
    });
  }
}
