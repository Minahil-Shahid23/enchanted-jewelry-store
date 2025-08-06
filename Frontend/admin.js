const BASE_URL = 'http://localhost:8025'; // ✅ Your backend URL

// Keep track of current filter
let currentStatusFilter = '';

// Formatters
const fmtPKR = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 });
const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString('en-PK', { year:'numeric', month:'short', day:'numeric' });
  } catch {
    return '-';
  }
};

//-------------------------------------------
// 🔗 NAVIGATION TABS HANDLING
//-------------------------------------------
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
let editId = null;

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    sections.forEach(section => section.classList.remove('active'));
    const sectionId = item.dataset.section;
    document.getElementById(sectionId).classList.add('active');

    if (sectionId === 'orders') {
      // When switching to Orders, load using whatever is selected in the filter (if present)
      currentStatusFilter = document.getElementById('status-filter')?.value || '';
      fetchOrders(currentStatusFilter);
    }
  });
});


//-------------------------------------------
// ✏️ EDIT PRODUCT - Prefill form fields
//-------------------------------------------
function editProduct(id) {
  const productRow = [...document.querySelectorAll("#product-table tbody tr")]
    .find(row => row.innerHTML.includes(id));

  const cells = productRow.querySelectorAll("td");

  // Extract prices
  const priceCellHTML = cells[1].innerHTML;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = priceCellHTML;

  const spans = tempDiv.querySelectorAll("span");
  let originalPrice = "";
  let discountedPrice = "";

  if (spans.length === 2) {
    originalPrice = spans[0].innerText.replace("₹", "").trim();
    discountedPrice = spans[1].innerText.replace("₹", "").trim();
  } else if (spans.length === 1) {
    discountedPrice = spans[0].innerText.replace("₹", "").trim();
  }

  // Prefill form fields
  document.getElementById("title").value = cells[0].innerText;
  document.getElementById("original-price").value = originalPrice;
  document.getElementById("price").value = discountedPrice;
  document.getElementById("category").value = cells[2].innerText;
  document.getElementById("description").value = cells[4].innerText;


  editId = id;
  document.querySelector('button[onclick="addProductToDB()"]').innerText = "Update Product";
}


//-------------------------------------------
// ❌ DELETE PRODUCT
//-------------------------------------------
async function deleteProduct(id) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    await fetch(`http://localhost:8025/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Failed to delete product.");
  }
}


//-------------------------------------------
// 🧼 CLEAR FORM AFTER SUBMIT / CANCEL
//-------------------------------------------
function clearForm() {
  document.getElementById("title").value = '';
  document.getElementById("description").value = '';
  document.getElementById("price").value = '';
  document.getElementById("original-price").value = '';
  document.getElementById("category").value = '';
  document.getElementById("imageFile").value = '';
  const sizeSelect = document.getElementById("size");
  Array.from(sizeSelect.options).forEach(option => option.selected = false);

  document.querySelector('button[onclick="addProductToDB()"]').innerText = "Add Product";
  editId = null;
}


//-------------------------------------------
// 📦 FETCH PRODUCTS AND DISPLAY IN TABLE
//-------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
});

async function fetchProducts() {
  const res = await fetch("http://localhost:8025/api/products");
  const products = await res.json();
  const tbody = document.querySelector("#product-table tbody");
  tbody.innerHTML = "";

  products.forEach(product => {
    const row = document.createElement("tr");

    // 💰 Price Display Logic (show both if applicable)
    const showOriginal = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
    const priceHTML = showOriginal
      ? `
          <span style="text-decoration: line-through; color: gray;">₹${product.originalPrice}</span><br>
          <span style="font-weight: bold; color: black;">₹${product.price}</span>
        `
      : `<span style="font-weight: bold; color: black;">₹${product.price}</span>`;

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${priceHTML}</td>
      <td>${product.category}</td>
      <td><img src="${product.images?.[0]}" width="40"/></td>
          <td>${product.description || "—"}</td>

      <td><button onclick="editProduct('${product._id}')">Edit</button></td>
      <td><button onclick="deleteProduct('${product._id}')">Delete</button></td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById("total-products").textContent = products.length;
}


//-------------------------------------------
// ☁️ UPLOAD MULTIPLE IMAGES TO CLOUDINARY
//-------------------------------------------
async function uploadMultipleToCloudinary(files) {
  const uploadedUrls = [];

  for (let file of files) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "jewelry_upload");

    const res = await fetch("https://api.cloudinary.com/v1_1/dbaoyczba/image/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();

    if (result.secure_url) {
      uploadedUrls.push(result.secure_url);
    } else {
      console.error("Cloudinary Error:", result);
      alert(result.error.message);
    }
  }

  return uploadedUrls;
}


//-------------------------------------------
// ➕ ADD OR ✏️ UPDATE PRODUCT
//-------------------------------------------
async function addProductToDB() {
  const name = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const originalPrice = document.getElementById("original-price").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const sizeSelect = document.getElementById("size");
  const sizes = Array.from(sizeSelect.selectedOptions).map(option => option.value);
  const files = document.getElementById("imageFile").files;

  if (!name || !price || !category) {
    alert("Please fill all required fields");
    return;
  }

  let images = [];
  if (files.length > 0) {
    images = await uploadMultipleToCloudinary(files);
  }

  const productData = {
    name,
    price,
    originalPrice,
    description,
    category,
    sizes,
  };

  if (images.length > 0) {
    productData.images = images;
  }

  if (editId) {
    // 🔄 Update product
    await fetch(`http://localhost:8025/api/products/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    document.querySelector('button[onclick="addProductToDB()"]').innerText = "Add Product";
    editId = null;
  } else {
    // ➕ Add new product
    await fetch("http://localhost:8025/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...productData,
        images,
      }),
    });
  }

  fetchProducts();
  clearForm();
}

// Hook up the filter dropdown once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const statusSelect = document.getElementById('status-filter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      currentStatusFilter = e.target.value || '';
      fetchOrders(currentStatusFilter);
    });
  }
});

// --------------------
// Orders Section
// --------------------
async function fetchOrders(status = null) {
  const tbody = document.getElementById('orders-body');
  if (!tbody) return;

  try {
    const effective = status ?? (document.getElementById('status-filter')?.value || '');
    currentStatusFilter = effective;

    const url = effective
      ? `${BASE_URL}/api/orders?status=${encodeURIComponent(effective)}`
      : `${BASE_URL}/api/orders`;

    // Loading state
    tbody.innerHTML = '<tr class="muted-row"><td colspan="6">Loading…</td></tr>';

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const orders = await res.json();
    console.log("✅ Orders fetched:", orders);

    tbody.innerHTML = '';

    if (!Array.isArray(orders) || orders.length === 0) {
      tbody.innerHTML = '<tr class="muted-row"><td colspan="6">No orders found.</td></tr>';
      return;
    }

    orders.forEach(order => {
      const tr = document.createElement('tr');
      const statusVal = order.status || 'Pending';
      const statusClass = statusVal.toLowerCase();

      tr.innerHTML = `
        <td>${sanitize(order.name)}</td>
        <td>${sanitize(order.email)}</td>
        <td>${fmtPKR.format(Number(order.total) || 0)}</td>
        <td>${fmtDate(order.createdAt || order.date)}</td>
        <td><span class="status-badge ${statusClass}">${sanitize(statusVal)}</span></td>
        <td style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn" onclick="viewOrder('${order._id}')">View</button>
          <button class="btn danger" onclick="deleteOrder('${order._id}')">🗑 Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('❌ Failed to fetch orders:', err);
    tbody.innerHTML = '<tr class="muted-row"><td colspan="6">Failed to load orders.</td></tr>';
  }
}

async function viewOrder(orderId) {
  try {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const order = await res.json();
    console.log("👀 Viewing order:", order);

    document.getElementById('shipping-info').textContent =
      `📦 Shipping: ${[order.name, order.address, order.city, order.state, order.zip, order.country]
        .filter(Boolean).join(', ')}`;

    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';

    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        const li = document.createElement('li');
        const itemName = item.name || item.productId || 'Item';
        const itemPrice = typeof item.price === 'number' ? item.price : 0;
        const qty = typeof item.quantity === 'number' ? item.quantity : 1;
        li.textContent = `${itemName} x${qty} – ${fmtPKR.format(itemPrice)}`;
        itemsList.appendChild(li);
      });
    } else {
      itemsList.innerHTML = '<li>No items in this order.</li>';
    }

    const shipBtn = document.getElementById('mark-shipped-btn');
    if (order.status !== 'Shipped') {
      shipBtn.style.display = 'inline-block';
      shipBtn.onclick = () => markAsShipped(orderId);
    } else {
      shipBtn.style.display = 'none';
    }

    document.getElementById('order-details').style.display = 'block';
  } catch (err) {
    console.error('❌ Failed to view order:', err);
    alert('Failed to load order details.');
  }
}

async function markAsShipped(orderId) {
  try {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Shipped' })
    });

    if (res.ok) {
      alert('✅ Order marked as shipped!');
      await fetchOrders(currentStatusFilter);
      await fetchDashboardSummary();
      document.getElementById('order-details').style.display = 'none';
    } else {
      const msg = await safeText(res);
      alert(`❌ Failed to update order status. ${msg ? '(' + msg + ')' : ''}`);
    }
  } catch (err) {
    console.error('❌ Error updating order status:', err);
    alert('Error updating order status.');
  }
}

// ✅ Delete order
async function deleteOrder(orderId) {
  try {
    const yes = confirm("Are you sure you want to delete this order?");
    if (!yes) return;

    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, { method: 'DELETE' });
    if (res.ok) {
      alert('🗑️ Order deleted');
      await fetchOrders(currentStatusFilter);
      await fetchDashboardSummary();
      document.getElementById('order-details').style.display = 'none';
    } else {
      const msg = await safeText(res);
      alert(`❌ Failed to delete order. ${msg ? '(' + msg + ')' : ''}`);
    }
  } catch (err) {
    console.error('❌ Error deleting order:', err);
    alert('Error deleting order.');
  }
}

// --------------------
// Dashboard Summary
// --------------------
async function fetchDashboardSummary() {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      fetch(`${BASE_URL}/api/products`),
      fetch(`${BASE_URL}/api/orders`)
    ]);

    if (!productsRes.ok || !ordersRes.ok) throw new Error('HTTP error');

    const products = await productsRes.json();
    const orders = await ordersRes.json();

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const uniqueCustomers = new Set(orders.map(o => o.email).filter(Boolean));

    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-revenue').textContent = fmtPKR.format(totalRevenue);
    document.getElementById('unique-customers').textContent = uniqueCustomers.size;
  } catch (err) {
    console.error('❌ Dashboard fetch failed:', err);
  }
}

// --------------------
// Helpers
// --------------------
function sanitize(v) {
  return String(v ?? '').replace(/[<>&'"]/g, s => ({
    '<':'&lt;','>':'&gt;','&':'&amp;','\'':'&#39;','"':'&quot;'
  }[s]));
}

async function safeText(res) {
  try { return await res.text(); } catch { return ''; }
}

// --------------------
// Init load
// --------------------
fetchOrders('');            // loads with "All"
fetchDashboardSummary();

function switchSection(sectionId) {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) target.classList.add("active");
}

async function loadContactMessages() {
  try {
    const res = await fetch("http://localhost:8025/api/contact/all");
    const result = await res.json(); // 👈 Get full response
    const contacts = result.data;    // 👈 Then get data array

    const tbody = document.querySelector("#contact-table tbody");
    tbody.innerHTML = "";

    contacts.forEach(contact => {
      const row = document.createElement("tr");
     row.innerHTML = `
  <td>${contact.fullname}</td>
  <td>${contact.email}</td>
  <td>${contact.interest}</td>
  <td>${contact.message}</td>
  <td>
    ${contact.attachmentUrl
      ? `<a href="${contact.attachmentUrl}" target="_blank">View</a>`
      : "No file"}
  </td>
  <td>
    <button class="delete-btn" onclick="deleteContact('${contact._id}')">🗑️ Delete</button>
  </td>
`;

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("❌ Failed to load contact messages:", err);
  }
}


document.querySelector('[data-section="contacts"]').addEventListener("click", () => {
  switchSection("contacts");
  loadContactMessages();
});

async function deleteContact(id) {
  const confirmDelete = confirm("Are you sure you want to delete this contact?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:8025/api/contact/${id}`, {
      method: "DELETE"
    });

    const result = await res.json();
    if (result.success) {
      alert("Deleted successfully!");
      loadContactMessages(); // Refresh table
    } else {
      alert("Failed to delete");
    }
  } catch (err) {
    console.error("❌ Delete failed:", err);
    alert("Error occurred while deleting");
  }
}

async function fetchWeeklyProducts() {
    try {
      const res = await fetch("http://localhost:8025/api/weekly-products");
      const data = await res.json();

      const tbody = document.querySelector("#weekly-product-table tbody");
      tbody.innerHTML = "";

      data.forEach(product => {
        const row = document.createElement("tr");
       prodDiv.innerHTML = `
  <a href="product.html?id=${product._id}">
    <img src="${product.image}" class="prod1-img" alt="${product.name}">
    <p class="prod-name">${product.name}</p>
    <p class="prod-price">${product.price} PKR</p>
  </a>
`;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("❌ Failed to fetch weekly products:", err);
    }
  }

  async function addWeeklyProduct() {
    const name = document.getElementById("weekly-name").value;
    const price = document.getElementById("weekly-price").value;
    const image = document.getElementById("weekly-image").value;

    try {
      const res = await fetch("http://localhost:8025/api/weekly-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, image })
      });

      if (!res.ok) throw new Error("Failed to add product");
      await fetchWeeklyProducts();
    } catch (err) {
      console.error("❌ Error adding weekly product:", err);
    }
  }

  async function deleteWeeklyProduct(id) {
    try {
      const res = await fetch(`http://localhost:8025/api/weekly-products/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchWeeklyProducts();
    } catch (err) {
      console.error("❌ Error deleting weekly product:", err);
    }
  }

  // Load when section opened (example if using nav tabs)
  document.querySelector('[data-section="weekly-products"]').addEventListener("click", () => {
    switchSection("weekly-products");
    fetchWeeklyProducts();
  });
async function fetchWeeklyProducts() {
    try {
      const res = await fetch("http://localhost:8025/api/weekly-products");
      const data = await res.json();

      const tbody = document.querySelector("#weekly-product-table tbody");
      tbody.innerHTML = "";

      data.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td><img src="${product.image}" width="50"/></td>
          <td><button onclick="deleteWeeklyProduct('${product._id}')">Delete</button></td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("❌ Failed to fetch weekly products:", err);
    }
  }

  async function addWeeklyProduct() {
  const name = document.getElementById("weekly-name").value;
  const price = document.getElementById("weekly-price").value;
  const file = document.getElementById("weekly-image").files[0];

  if (!name || !price || !file) {
    alert("Please fill all fields");
    return;
  }

  // Upload image to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "jewelry_upload"); // ✅ preset name

  try {
    const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dbaoyczba/image/upload", {
      method: "POST",
      body: formData,
    });

    const cloudinaryData = await cloudinaryRes.json();

    if (!cloudinaryData.secure_url) {
      alert("Image upload failed");
      return;
    }

    // ✅ Send to backend
    const res = await fetch("http://localhost:8025/api/weekly-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price,
        image: cloudinaryData.secure_url,
      }),
    });

    if (!res.ok) throw new Error("Failed to add product");
    await fetchWeeklyProducts();

    // Reset form
    document.getElementById("weekly-name").value = "";
    document.getElementById("weekly-price").value = "";
    document.getElementById("weekly-image").value = "";
  } catch (err) {
    console.error("❌ Error adding weekly product:", err);
    alert("Something went wrong while adding weekly product.");
  }
}


  async function deleteWeeklyProduct(id) {
    try {
      const res = await fetch(`http://localhost:8025/api/weekly-products/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchWeeklyProducts();
    } catch (err) {
      console.error("❌ Error deleting weekly product:", err);
    }
  }

  // Load when section opened (example if using nav tabs)
  document.querySelector('[data-section="weekly-products"]').addEventListener("click", () => {
    switchSection("weekly-products");
    fetchWeeklyProducts();
  });


