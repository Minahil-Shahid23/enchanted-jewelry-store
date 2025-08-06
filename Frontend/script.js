//------------------------------------------- 🛒 UPDATE CART COUNT -------------------------------------------
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCount = 0;

    cart.forEach(item => totalCount += item.quantity);

    // 🔢 For header cart icon badge
    const headerCountEl = document.querySelector(".cart-count");
    if (headerCountEl) headerCountEl.textContent = totalCount;

    // 🛍️ For the "Cart (X products)" heading
    const productCountEl = document.getElementById("product-count");
    if (productCountEl) productCountEl.textContent = cart.length;

  } catch (error) {
    const headerCountEl = document.querySelector(".cart-count");
    if (headerCountEl) headerCountEl.textContent = "0";

    const productCountEl = document.getElementById("product-count");
    if (productCountEl) productCountEl.textContent = "0";
  }
}
document.addEventListener("DOMContentLoaded", updateCartCount);


//------------------------------------------- 🔍 SEARCH SUGGESTIONS -------------------------------------------
const searchInput = document.getElementById("search-input");
const suggestionsList = document.getElementById("suggestions-list");
const validCategories = ["necklace", "ring", "bracelet", "charm", "earrings"];

// 🖊️ Listen while user types
searchInput.addEventListener("input", function () {
  const input = searchInput.value.trim().toLowerCase();
  suggestionsList.innerHTML = "";

  if (input === "") {
    suggestionsList.style.display = "none";
    return;
  }

  // 🔍 Match categories
  const matches = validCategories.filter(cat =>
    cat.includes(input) || input.includes(cat)
  );

  // 💡 Show suggestions
  if (matches.length > 0) {
    matches.forEach(match => {
      const li = document.createElement("li");
      li.textContent = match;
      li.addEventListener("click", () => {
        window.location.href = `products.html?category=${match}`;
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = "block";
  } else {
    suggestionsList.style.display = "none";
  }
});

// 🔁 Press Enter → fallback logic
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  const input = searchInput.value.trim().toLowerCase();
  const matched = validCategories.find(cat =>
    cat.includes(input) || input.includes(cat)
  );

  if (matched) {
    window.location.href = `products.html?category=${matched}`;
  } else {
    alert("No products found for that category.");
  }
}


//------------------------------------------- 📬 CONTACT FORM SUBMIT -------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ JS file loaded");

  const form = document.querySelector(".contact-form");
  if (!form) {
    console.error("❌ Form not found in DOM");
    return;
  }

  const submitBtn = form.querySelector(".submit-btn");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    const response = await fetch("http://localhost:8025/api/contact", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    console.log("🧾 Response Content-Type:", contentType);

    const raw = await response.text(); // Always get raw
    console.log("📃 Raw response body:", raw);

    let data = {};
    try {
      data = JSON.parse(raw); // Try parse manually
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err.message);
      alert("❌ Received invalid response from server.");
      throw err;
    }

    console.log("✅ Parsed JSON:", data);

    if (data.success) {
      alert("✅ Contact form submitted");
      form.reset();
    } else {
      alert("❌ Submission failed: " + (data.error || "Unknown error"));
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Get in Touch";
  });
});


//------------------------------------------- 🛍️ LOAD WEEKLY PRODUCTS -------------------------------------------
async function loadWeeklyProducts() {
  try {
    const res = await fetch("http://localhost:8025/api/weekly-products");
    const products = await res.json();

    const container = document.querySelector(".weekly-products");
    container.innerHTML = ""; // Clear any static HTML

    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "prod1";

      div.innerHTML = `
        <a href="product.html?id=${p._id}">
          <img src="${p.image}" class="prod1-img" alt="${p.name}">
          <p class="prod-name">${p.name}</p>
          <p class="prod-price">${p.price} PKR</p>
        </a>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Failed to load weekly products:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 Calling loadWeeklyProducts()");
  loadWeeklyProducts();
});
