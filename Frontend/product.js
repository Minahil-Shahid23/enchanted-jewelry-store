//------------------------------------------- 🧭 STEP 1: Product Detail Load -------------------------------------------

// This assumes products is a local array, but now we want to fetch from your backend.
// const product = products.find(p => p.id === productId);

const productId = new URLSearchParams(window.location.search).get("id");

const fetchProduct = async () => {
  console.log("🔍 productId from URL:", productId);
  if (!productId) {
    document.querySelector(".main-product").innerHTML = "<h2>Invalid product ID!</h2>";
    return;
  }

  let product = null;
  let isWeekly = false;

  try {
    const res = await fetch(`http://localhost:8025/api/products/${productId}`);
    if (res.ok) {
      const data = await res.json();
      product = data;
    } else {
      const res2 = await fetch(`http://localhost:8025/api/weekly-products/${productId}`);
      if (res2.ok) {
        product = await res2.json();
        isWeekly = true;
      }
    }

    if (!product) {
      document.querySelector(".main-product").innerHTML = "<h2>Product not found!</h2>";
      return;
    }

    // 🖼️ Image
    document.getElementById("product-img").src = isWeekly ? product.image : product.images[0];

    // 🔽 Thumbnails
    const thumbnailsDiv = document.getElementById("thumbnail-container");
    thumbnailsDiv.innerHTML = "";
    if (!isWeekly && product.images.length > 1) {
      product.images.slice(1).forEach((img, index) => {
        const thumb = document.createElement("img");
        thumb.src = img;
        thumb.alt = `Thumbnail ${index}`;
        thumb.onclick = function () {
          clickImageChange(this);
        };
        thumbnailsDiv.appendChild(thumb);
      });
    }

    // 🏷️ Title
    document.getElementById("product-main-heading").textContent = product.name;
    document.getElementById("product-title").textContent = product.name;

    // 💰 Price
    const price = parseFloat(product.price);
    const originalPrice = parseFloat(product.originalPrice || 0);
    const discountedPrice = price;

    document.getElementById("product-price").textContent = `Rs. ${price}`;
    if (!isWeekly && originalPrice > price) {
      document.getElementById("old-price").textContent = `Rs. ${originalPrice}`;
      document.getElementById("old-price").style.display = "inline";
    } else {
      document.getElementById("old-price").style.display = "none";
    }

    // 🧾 Description
    document.getElementById("product-description").textContent = isWeekly
      ? "This is one of our special weekly picks – simple and elegant."
      : product.description;

    // 🔖 Breadcrumb
    const breadCategory = document.getElementById("breadcrum-category");
    if (isWeekly) {
      breadCategory.textContent = "Weekly Product";
      breadCategory.href = "#";
    } else {
      breadCategory.textContent = product.category;
      breadCategory.href = `products.html?category=${product.category}`;
    }
    document.getElementById("breadcrum").textContent = product.name;

    // 📏 Sizes
    const sizeSelect = document.getElementById("size");
    if (!isWeekly && product.sizes) {
      sizeSelect.innerHTML = product.sizes.map(size => `<option>${size}"</option>`).join("");
    } else {
      sizeSelect.innerHTML = `<option>Default</option>`;
    }

    // 🛒 Cart
    const btn = document.getElementById("add-to-cart-btn");
    btn.setAttribute("data-id", product._id);
    btn.setAttribute("data-name", product.name);
    btn.setAttribute("data-price", discountedPrice);
    btn.setAttribute("data-image", isWeekly ? product.image : product.images[0]);
// ❌ Hide related products section if weekly
if (isWeekly) {
  const relatedSection = document.getElementById("related-section");
  if (relatedSection) relatedSection.style.display = "none";
}
    if (!isWeekly) showRecs(product); // ✅ Recommendations only for full products

  } catch (err) {
    console.error("❌ Failed to fetch product:", err);
  }
};

document.addEventListener("DOMContentLoaded", fetchProduct);


//------------------------------------------- 🛒 STEP 2: Add to Cart Functionality -------------------------------------------

document.getElementById("add-to-cart-btn").addEventListener("click", () => {
  const btn = document.getElementById("add-to-cart-btn");

  const id = btn.getAttribute("data-id");
  const name = btn.getAttribute("data-name");
  const price = parseInt(btn.getAttribute("data-price"));
  const image = btn.getAttribute("data-image");

  const quantityInput = document.getElementById("qty");
  const selectedQty = parseInt(quantityInput.value);

  let cart = [];
  try {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];
  } catch (e) {
    console.error("Invalid cart data in localStorage, resetting...");
    localStorage.removeItem("cart");
    cart = [];
  }

  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.quantity += selectedQty;
  } else {
    cart.push({ id, name, price, image, quantity: selectedQty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showMiniCartPopup({ name, price, image });
});



//------------------------------------------- 🧾 STEP 3: Buy Now Button Functionality -------------------------------------------

document.querySelector(".buy-now").addEventListener("click", () => {
  const btn = document.getElementById("add-to-cart-btn");

  const name = btn.getAttribute("data-name");
  const price = parseFloat(btn.getAttribute("data-price"));
  const image = btn.getAttribute("data-image");
  const quantity = parseInt(document.getElementById("qty").value);
  const size = document.getElementById("size").value;

  const buyNowItem = {
    name,
    price,
    image,
    quantity,
    size
  };

  localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
  window.location.href = "checkout.html";
});



//------------------------------------------- 🖼️ STEP 4: Image Thumbnail Swap -------------------------------------------

function clickImageChange(thumbnail) {
  const mainImage = document.getElementById('product-img');
  const currentMainSrc = mainImage.src;
  mainImage.src = thumbnail.src;
  thumbnail.src = currentMainSrc;
}



//------------------------------------------- ⭐ STEP 5: Related Products Section -------------------------------------------

function showRecs(currentProduct) {
  const recsSection = document.querySelector('.related-products');
  recsSection.innerHTML = "";

  fetch("http://localhost:8025/api/products")
    .then(res => res.json())
    .then(data => {
      const allProducts = data;

      const sameCategory = allProducts.filter(p =>
        p._id !== currentProduct._id &&
        p.category?.toLowerCase() === currentProduct.category?.toLowerCase()
      );

      const random3 = sameCategory.sort(() => 0.5 - Math.random()).slice(0, 3);

      random3.forEach(product => {
        const originalPrice = parseFloat(product.originalPrice || product.price);
        const discountedPrice = parseFloat(product.price);

        const card = document.createElement("div");
        card.classList.add("related-card");
        card.innerHTML = `
          <img src="${product.images?.[0] || 'images/default.jpg'}" alt="${product.name}">
          <div class="name">${product.name}</div>
          <div class="price">
            <del>Rs ${originalPrice}</del> 
            <strong>Rs ${discountedPrice}</strong>
          </div>
          <button class="add-related" 
            data-id="${product._id}"
            data-image="${product.images?.[0] || 'images/default.jpg'}"
            data-name="${product.name}"
            data-price="${discountedPrice}">
            Add to Cart
          </button>
        `;

        recsSection.appendChild(card);
      });

      document.querySelectorAll('.add-related').forEach(button => {
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-id");
          const name = button.getAttribute("data-name");
          const price = parseFloat(button.getAttribute("data-price"));
          const image = button.getAttribute("data-image");

          let cart = [];
          try {
            const storedCart = localStorage.getItem("cart");
            cart = storedCart ? JSON.parse(storedCart) : [];
          } catch {
            localStorage.removeItem("cart");
            cart = [];
          }

          const existing = cart.find(p => p.id === id);
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ id, name, price, image, quantity: 1 });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          showMiniCartPopup({ name, price, image });
        });
      });
    })
    .catch(err => {
      console.error("❌ Failed to fetch recommended products:", err);
    });
}



// function getRandomProducts(count = 3) {
//   const Randomparams = new URLSearchParams(window.location.search);
//   const currentProductId = Randomparams.get("id");

//   const currentProduct = products.find(p => p.id === currentProductId);
//   if (!currentProduct) return [];

//   const sameCategory = products.filter(
//     p => p.category === currentProduct.category && p.id !== currentProduct.id
//   );

//   const shuffled = sameCategory.sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

document.addEventListener("DOMContentLoaded", showRecs);



//------------------------------------------- 🔔 STEP 6: Mini Cart Popup Functionality -------------------------------------------

function showMiniCartPopup(product) {
  const popup = document.getElementById("miniCartPopup");

  document.getElementById("mini-cart-image").src = product.image;
  document.getElementById("mini-cart-name").textContent = product.name;
  document.getElementById("mini-cart-price").textContent = `Rs. ${product.price}`;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 5000);
}

function closeMiniCart() {
  document.getElementById("miniCartPopup").classList.remove("show");
}
