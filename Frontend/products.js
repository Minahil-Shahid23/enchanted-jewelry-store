// /***************************************
//  ✅ PRODUCT DATA (Dummy JSON Array)
// ****************************************/
// const products = [
//   // Necklaces
//   { id: "1", name: "Marina Nebula", price: 700, image: "images/necklace-img.png", category: "Necklace" },
//   { id: "2", name: "Evergreen Charm", price: 750, image: "images/neckpiece-img.png", category: "Necklace" },
//   { id: "3", name: "Crimson Cascade", price: 600, image: "images/crimson-cascade.png", category: "Necklace" },
//   { id: "4", name: "Blue Shines", price: 500, image: "images/blue-shines.png", category: "Necklace" },
//   { id: "5", name: "Daisy Chain", price: 500, image: "images/daisy-chain.png", category: "Necklace" },
//   { id: "6", name: "Fairycore Dream", price: 700, image: "images/fairycore-dream.png", category: "Necklace" },
//   { id: "7", name: "Ivory Romance", price: 600, image: "images/ivory-romance.png", category: "Necklace" },
//   { id: "8", name: "Charmie", price: 450, image: "images/charmie.png", category: "Necklace" },
//   { id: "9", name: "Celestial Orbit", price: 600, image: "images/celestial-orbit.png", category: "Necklace" },
//   { id: "10", name: "Starry Nights", price: 500, image: "images/starry nights.png", category: "Necklace" },
//   { id: "11", name: "Letter", price: 500, image: "images/letter.png", category: "Necklace" },
//   { id: "12", name: "Purrl Charm", price: 600, image: "images/purrl-charm.png", category: "Necklace" },
//   { id: "13", name: "Viva La Vida", price: 600, image: "images/viva la vida.png", category: "Necklace" },
//   { id: "14", name: "Whimsy Wings", price: 500, image: "images/Whimsy Wings.png", category: "Necklace" },
//   { id: "15", name: "Hearty Hearts", price: 500, image: "images/hearts.png", category: "Necklace" },
//   { id: "16", name: "Strawberry Shortcake", price: 650, image: "images/strawberry-shortcake.png", category: "Necklace" },

//   // Earrings
//   { id: "17", name: "Pearl Drops", price: 400, image: "images/earrings-pearl-drops.png", category: "Earrings" },
//   { id: "18", name: "Golden Hoops", price: 550, image: "images/earrings-golden-hoops.png", category: "Earrings" },
//   { id: "19", name: "Twilight Tassels", price: 500, image: "images/earrings-tassels.png", category: "Earrings" },

//   // Rings
//   { id: "20", name: "Moonstone Ring", price: 450, image: "images/ring-moonstone.png", category: "Ring" },
//   { id: "21", name: "Heart Beat", price: 500, image: "images/ring-heartbeat.png", category: "Ring" },
//   { id: "22", name: "Vintage Bloom", price: 600, image: "images/ring-vintage.png", category: "Ring" },

//   // Charms
//   { id: "23", name: "Lucky Clover Charm", price: 300, image: "images/charm-clover.png", category: "Charm" },
//   { id: "24", name: "Butterfly Magic", price: 350, image: "images/charm-butterfly.png", category: "Charm" },
//   { id: "25", name: "Mini Rosebud", price: 280, image: "images/charm-rosebud.png", category: "Charm" },

//   // Bracelets
//   { id: "26", name: "Crystal Bloom", price: 600, image: "images/bracelet-bloom.png", category: "Bracelet" },
//   { id: "27", name: "Infinity Spark", price: 550, image: "images/bracelet-infinity.png", category: "Bracelet" },
//   { id: "28", name: "Pastel Beads", price: 480, image: "images/bracelet-pastel.png", category: "Bracelet" }
// ];

document.addEventListener("DOMContentLoaded", () => {
  /*******************************************
   ✅ FILTER PRODUCTS BY URL CATEGORY
  ********************************************/
  let filteredProducts = [];
  let allProducts = [];


  const params = new URLSearchParams(window.location.search);
  const categoryFromURL = params.get("category");

  const fetchProducts = async () => {
  try {
    const res = await fetch("http://localhost:8025/api/products");
    const data = await res.json();
    allProducts = data;
    console.log("✅ All products from backend:", allProducts);


    filteredProducts = categoryFromURL
  ? allProducts.filter(p => p.category?.toLowerCase() === categoryFromURL.toLowerCase())
  : [...allProducts];

    renderPaginatedProducts();
    updateHeading();
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
  }
};


  /*******************************************
   ✅ SORTING PRODUCTS (Dropdown Events)
  ********************************************/
  const sortDropDown = document.getElementById("filter-category");
  const productGrid = document.querySelector(".product-grid");

  if(sortDropDown){
    sortDropDown.addEventListener("change", function () {
    const sortValue = sortDropDown.value;

    if (sortValue === "necklace") {
      filteredProducts.sort((a, b) => b.price - a.price); // High to low
    } else if (sortValue === "earrings") {
      filteredProducts.sort((a, b) => a.price - b.price); // Low to high
    } else if (sortValue === "newest") {
      filteredProducts.sort((a, b) => b.id - a.id); // Newest first
    } else {
    filteredProducts = [...allProducts]; // ✅ Use real fetched data
    }

    renderPaginatedProducts();
  });
  }


  /*******************************************
   ✅ RENDER PRODUCTS TO GRID
  ********************************************/
 function renderProducts(productArray) {
  productGrid.innerHTML = "";

  productArray.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <a href="product.html?id=${product._id}">
        <img src="${product.images[0]}" alt="${product.name}" class="search-prod-img">
        <h3 class="search-prod-name">${product.name}</h3>
        <p class="search-prod-price">Rs ${product.price}</p>
      </a>
    `;

    productGrid.appendChild(card);
  });
}


  /*******************************************
   ✅ PAGINATION LOGIC
  ********************************************/
  let currentPage = 1;
  const productsPerPage = 6;

  function slicePage(pageNo, sourceArray) {
    const start = (pageNo - 1) * productsPerPage;
    const end = start + productsPerPage;
    return sourceArray.slice(start, end);
  }

  function renderPaginatedProducts() {
    const paginatedArray = slicePage(currentPage, filteredProducts);
    renderProducts(paginatedArray);
    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    document.getElementById("page-number").innerText = currentPage;
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage === totalPages;
  }
  const prevbtn = document.getElementById("prev-btn");
  if(prevbtn){
    prevbtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPaginatedProducts();
    }
  });
  }
  
  const nextbtn= document.getElementById("next-btn");
  if(nextbtn){
    nextbtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPaginatedProducts();
    }
  });

  }


  /*******************************************
   ✅ INITIAL RENDER
  ********************************************/
  // renderPaginatedProducts();
  fetchProducts(); // ✅ This will fetch and render from backend



  /*******************************************
   ✅ OPTIONAL: UPDATE CATEGORY HEADING
  ********************************************/
 function updateHeading() {
  if (categoryFromURL) {
    const heading = document.querySelector(".Weekly-texts-necklace h1");
    const breadcrum = document.getElementById("breadcrumb-cat");
    if (heading) heading.textContent = categoryFromURL;
    if (breadcrum) breadcrum.textContent = categoryFromURL;
  }
}
});













