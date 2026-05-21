// --- PRODUCTS DATABASE ---
const PRODUCTS = [
  {
    id: 1,
    name: "Aura Nebula",
    category: "Neon Cyber",
    price: 240.00,
    rating: 4.9,
    description: "Equipped with hyper-luminescent active knit polymers, the Nebula reacts dynamically to surrounding biomechanical waves. Standardized with deep violet compression plates.",
    image: "assets/sneaker_purple.png",
    glowColor: "rgba(199, 0, 255, 0.4)",
    sizes: [8, 9, 10, 11, 12],
    colors: ["purple", "cyan", "green", "red"],
    specs: ["Bioluminescent Sole v3", "Adaptive Compression Fit", "Carbon Core Stability Plate"]
  },
  {
    id: 2,
    name: "Aura Frostbyte",
    category: "Hyper-Light",
    price: 195.00,
    rating: 4.8,
    description: "Designed for rapid traversal, Frostbyte features high-tensile white polymer mesh and an ultra-cold translucent ice sole that actively channels airflow for optimal thermal ventilation.",
    image: "assets/sneaker_cyan.png",
    glowColor: "rgba(0, 242, 254, 0.4)",
    sizes: [7, 8, 9, 10, 11],
    colors: ["cyan", "purple", "green"],
    specs: ["Thermal Ventilation Vent", "Ice-Grip Traction Tread", "Hyper-Lightweight Aero Mesh"]
  },
  {
    id: 3,
    name: "Aura CyberClaw",
    category: "Neon Cyber",
    price: 280.00,
    rating: 5.0,
    description: "Aggressive styling meets defense-grade materials. The CyberClaw features stealth impact plates, structural carbon outriggers, and custom neon green micro-wiring aesthetics.",
    image: "assets/sneaker_green.png",
    glowColor: "rgba(46, 213, 115, 0.4)",
    sizes: [8, 9, 10, 11, 12, 13],
    colors: ["green", "cyan", "red"],
    specs: ["Stealth Impact Plates", "Vibrant Micro-wiring Trims", "Defense-grade Cyber Synthetic"]
  },
  {
    id: 4,
    name: "Aura Onyx",
    category: "Stealth",
    price: 310.00,
    rating: 4.9,
    description: "A phantom footprint designed for subterranean operations. Onyx integrates radar-absorbing composite grids with ultra-thin glowing laser nodes for absolute tactical elegance.",
    image: "assets/sneaker_red.png",
    glowColor: "rgba(255, 0, 127, 0.4)",
    sizes: [8, 9, 10, 11, 12],
    colors: ["red", "purple", "green"],
    specs: ["Radar-absorbing Shell", "Tactical Laser Illumination", "Vibration Damping Midsole"]
  }
];

// --- APP STATE ---
let cart = [];
let activeFilter = "all";
let currentProduct = null;

// --- DOM ELEMENTS ---
const elements = {
  header: document.getElementById("siteHeader"),
  productGrid: document.getElementById("productGrid"),
  filterBar: document.getElementById("filterBar"),
  cartTrigger: document.getElementById("cartTrigger"),
  cartBadgeCount: document.getElementById("cartBadgeCount"),
  cartOverlay: document.getElementById("cartOverlay"),
  cartSidebar: document.getElementById("cartSidebar"),
  cartCloseBtn: document.getElementById("cartCloseBtn"),
  cartItemsContainer: document.getElementById("cartItemsContainer"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  cartTaxes: document.getElementById("cartTaxes"),
  cartGrandTotal: document.getElementById("cartGrandTotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  
  modalOverlay: document.getElementById("modalOverlay"),
  modalContent: document.getElementById("modalContent"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  productDetailsView: document.getElementById("productDetailsView"),
  modalGlow: document.getElementById("modalGlow"),
  modalMainImg: document.getElementById("modalMainImg"),
  modalThumbs: document.getElementById("modalThumbs"),
  modalCat: document.getElementById("modalCat"),
  modalTitle: document.getElementById("modalTitle"),
  modalPrice: document.getElementById("modalPrice"),
  modalDesc: document.getElementById("modalDesc"),
  modalSizes: document.getElementById("modalSizes"),
  modalColors: document.getElementById("modalColors"),
  modalAddToCartBtn: document.getElementById("modalAddToCartBtn"),
  
  checkoutView: document.getElementById("checkoutView"),
  creditCardGraphic: document.getElementById("creditCardGraphic"),
  ccFrontNumber: document.getElementById("ccFrontNumber"),
  ccFrontHolder: document.getElementById("ccFrontHolder"),
  ccFrontExpiry: document.getElementById("ccFrontExpiry"),
  ccBackCvv: document.getElementById("ccBackCvv"),
  checkoutForm: document.getElementById("checkoutForm"),
  chName: document.getElementById("chName"),
  ccNumber: document.getElementById("ccNumber"),
  ccExp: document.getElementById("ccExp"),
  ccCvv: document.getElementById("ccCvv"),
  checkoutBackBtn: document.getElementById("checkoutBackBtn"),
  submitPaymentBtn: document.getElementById("submitPaymentBtn"),
  checkoutSummaryItems: document.getElementById("checkoutSummaryItems"),
  checkoutSubtotal: document.getElementById("checkoutSubtotal"),
  checkoutTaxes: document.getElementById("checkoutTaxes"),
  checkoutGrandTotal: document.getElementById("checkoutGrandTotal"),
  
  successView: document.getElementById("successView"),
  successNodeVal: document.getElementById("successNodeVal"),
  successCloseBtn: document.getElementById("successCloseBtn"),
  
  toastContainer: document.getElementById("toastContainer"),
  newsletterForm: document.getElementById("newsletterForm"),
  newsletterEmail: document.getElementById("newsletterEmail")
};

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
  loadCartFromStorage();
});

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Sticky Header scroll interaction
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      elements.header.classList.add("scrolled");
    } else {
      elements.header.classList.remove("scrolled");
    }
  });

  // Category Filtering
  elements.filterBar.addEventListener("click", (e) => {
    const filterBtn = e.target.closest(".filter-btn");
    if (!filterBtn) return;
    
    // UI update
    elements.filterBar.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    filterBtn.classList.add("active");
    
    // Filter trigger
    activeFilter = filterBtn.dataset.filter;
    filterProducts();
  });

  // Shopping Cart drawer open/close
  elements.cartTrigger.addEventListener("click", openCart);
  elements.cartCloseBtn.addEventListener("click", closeCart);
  elements.cartOverlay.addEventListener("click", (e) => {
    if (e.target === elements.cartOverlay) closeCart();
  });

  // Product modal close
  elements.modalCloseBtn.addEventListener("click", closeModal);
  elements.modalOverlay.addEventListener("click", (e) => {
    if (e.target === elements.modalOverlay) closeModal();
  });

  // Add to cart in details modal
  elements.modalAddToCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;
    
    const selectedSizeBtn = elements.modalSizes.querySelector(".size-btn.active");
    const selectedSize = selectedSizeBtn ? parseInt(selectedSizeBtn.textContent) : 9;
    
    const selectedColorBtn = elements.modalColors.querySelector(".color-btn.active");
    const selectedColor = selectedColorBtn ? selectedColorBtn.dataset.color : "purple";
    
    addToCart(currentProduct.id, selectedSize, selectedColor);
    closeModal();
  });

  // Checkout transitions
  elements.checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Error manifest allocation empty. Add items first.", "error");
      return;
    }
    closeCart();
    openCheckout();
  });
  
  elements.checkoutBackBtn.addEventListener("click", () => {
    elements.modalContent.classList.remove("checkout-active");
  });

  // Form payments input formatting & card flip triggers
  elements.ccNumber.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += value[i];
    }
    e.target.value = formatted;
    elements.ccFrontNumber.textContent = formatted || "•••• •••• •••• ••••";
  });

  elements.chName.addEventListener("input", (e) => {
    elements.ccFrontHolder.textContent = e.target.value.toUpperCase() || "AURA OPERATOR";
  });

  elements.ccExp.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    e.target.value = value;
    elements.ccFrontExpiry.textContent = value || "08/30";
  });

  // Card flipping triggers
  elements.ccCvv.addEventListener("focus", () => {
    elements.creditCardGraphic.classList.add("flipped");
  });
  elements.ccCvv.addEventListener("blur", () => {
    elements.creditCardGraphic.classList.remove("flipped");
  });
  elements.ccCvv.addEventListener("input", (e) => {
    elements.ccBackCvv.textContent = e.target.value || "•••";
  });

  // Payment Form Submission
  elements.checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    processSimulatedPayment();
  });

  // Success screen exit
  elements.successCloseBtn.addEventListener("click", () => {
    closeModal();
    cart = [];
    updateCartUI();
    saveCartToStorage();
  });

  // Newsletter injection
  elements.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = elements.newsletterEmail.value;
    showToast(`Operator injected successfully: ${email}`);
    elements.newsletterEmail.value = "";
  });
}

// --- PRODUCT GRID RENDERING ---
function renderProducts() {
  elements.productGrid.innerHTML = "";
  
  PRODUCTS.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.category = product.category;
    card.style.setProperty("--glow-color", product.glowColor);
    
    card.innerHTML = `
      <span class="product-tag">${product.category}</span>
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </div>
      <div class="product-info">
        <span class="product-category">Structural Spec</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="add-to-cart-btn" aria-label="Quick add ${product.name} to cart" onclick="event.stopPropagation(); quickAdd(${product.id})">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    
    // Grid click triggers Details Modal
    card.addEventListener("click", () => openProductDetails(product));
    elements.productGrid.appendChild(card);
  });
}

function filterProducts() {
  const cards = elements.productGrid.querySelectorAll(".product-card");
  cards.forEach(card => {
    const category = card.dataset.category;
    
    // Smooth transition
    card.style.opacity = "0";
    card.style.transform = "scale(0.9) translateY(10px)";
    
    setTimeout(() => {
      if (activeFilter === "all" || category === activeFilter) {
        card.classList.remove("hidden");
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1) translateY(0)";
        }, 50);
      } else {
        card.classList.add("hidden");
      }
    }, 200);
  });
}

// --- CART STATE OPERATIONS ---
function quickAdd(productId) {
  addToCart(productId, 9, "purple");
  showToast("Quick add: Caliber 9 Manifested");
}

function addToCart(productId, size, color) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  // Unique identification: ID + size + color
  const existingIndex = cart.findIndex(item => 
    item.id === productId && item.size === size && item.color === color
  );
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      color: color,
      quantity: 1
    });
  }
  
  updateCartUI();
  saveCartToStorage();
  showToast(`${product.name} successfully loaded to manifest.`);
}

function updateCartUI() {
  // Update Header badge count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  elements.cartBadgeCount.textContent = totalItems;
  
  // Bounce animation on badge
  elements.cartBadgeCount.style.animation = "none";
  elements.cartBadgeCount.offsetHeight; // Trigger reflow
  elements.cartBadgeCount.style.animation = "badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

  // Update Cart items lists
  elements.cartItemsContainer.innerHTML = "";
  
  if (cart.length === 0) {
    elements.cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-cloud-arrow-down icon"></i>
        <p>No specifications active.</p>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Manifest currently offline</p>
      </div>
    `;
    elements.cartSubtotal.textContent = "$0.00";
    elements.cartTaxes.textContent = "$0.00";
    elements.cartGrandTotal.textContent = "$0.00";
    return;
  }
  
  let subtotal = 0;
  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-options">Caliber: ${item.size} // Theme: ${item.color.toUpperCase()}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
          <div class="cart-item-qty">
            <button class="qty-btn minus" onclick="changeQty(${index}, -1)">&minus;</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn plus" onclick="changeQty(${index}, 1)">&plus;</button>
          </div>
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCartItem(${index})" aria-label="Remove item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    elements.cartItemsContainer.appendChild(cartItem);
  });
  
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;
  
  elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  elements.cartTaxes.textContent = `$${tax.toFixed(2)}`;
  elements.cartGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
}

window.changeQty = function(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
    saveCartToStorage();
  }
};

window.removeCartItem = function(index) {
  if (cart[index]) {
    const name = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    saveCartToStorage();
    showToast(`Removed from manifest: ${name}`, "error");
  }
};

function openCart() {
  elements.cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Stop page scroll
}

function closeCart() {
  elements.cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// --- LOCAL STORAGE ---
function saveCartToStorage() {
  localStorage.setItem("aura_cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const stored = localStorage.getItem("aura_cart");
  if (stored) {
    try {
      cart = JSON.parse(stored);
      updateCartUI();
    } catch (e) {
      cart = [];
    }
  }
}

// --- DETAILS MODAL OPERATIONS ---
function openProductDetails(product) {
  currentProduct = product;
  
  // Set content
  elements.modalMainImg.src = product.image;
  elements.modalMainImg.alt = product.name;
  elements.modalCat.textContent = product.category;
  elements.modalTitle.textContent = product.name;
  elements.modalPrice.textContent = `$${product.price.toFixed(2)}`;
  elements.modalDesc.textContent = product.description;
  
  // Glow effect
  elements.modalGlow.style.setProperty("--modal-glow-color", product.glowColor);
  
  // Size selection builders
  elements.modalSizes.innerHTML = "";
  product.sizes.forEach((size, idx) => {
    const sizeBtn = document.createElement("button");
    sizeBtn.className = `size-btn ${idx === 1 ? 'active' : ''}`;
    sizeBtn.textContent = size;
    sizeBtn.addEventListener("click", () => {
      elements.modalSizes.querySelectorAll(".size-btn").forEach(btn => btn.classList.remove("active"));
      sizeBtn.classList.add("active");
    });
    elements.modalSizes.appendChild(sizeBtn);
  });
  
  // Color selection builders
  elements.modalColors.innerHTML = "";
  product.colors.forEach((color, idx) => {
    const colorBtn = document.createElement("button");
    colorBtn.className = `color-btn ${color} ${idx === 0 ? 'active' : ''}`;
    colorBtn.dataset.color = color;
    colorBtn.setAttribute("aria-label", `${color} variant`);
    colorBtn.addEventListener("click", () => {
      elements.modalColors.querySelectorAll(".color-btn").forEach(btn => btn.classList.remove("active"));
      colorBtn.classList.add("active");
      
      // Dynamic details color tweak illustration
      adjustModalTheme(color);
    });
    elements.modalColors.appendChild(colorBtn);
  });
  
  // Thumbnails builders
  elements.modalThumbs.innerHTML = "";
  const th1 = document.createElement("div");
  th1.className = "modal-thumb active";
  th1.innerHTML = `<img src="${product.image}" alt="Side Spec">`;
  elements.modalThumbs.appendChild(th1);
  
  // Fake detailed thumbs angles
  const angles = [product.image, product.image];
  angles.forEach((imgSrc, index) => {
    const thumb = document.createElement("div");
    thumb.className = "modal-thumb";
    thumb.innerHTML = `<img src="${imgSrc}" alt="Detail Angle ${index + 2}" style="transform: rotate(${15 + index * 45}deg) scale(0.95);">`;
    thumb.addEventListener("click", () => {
      elements.modalThumbs.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      elements.modalMainImg.src = imgSrc;
    });
    elements.modalThumbs.appendChild(thumb);
  });
  
  // Show details view, hide checkout & success views
  elements.modalContent.className = "modal-content"; // Reset classes
  elements.productDetailsView.style.display = "block";
  elements.checkoutView.style.display = "none";
  elements.successView.style.display = "none";
  
  elements.modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function adjustModalTheme(color) {
  let rgbGlow = "rgba(199, 0, 255, 0.4)"; // Purple default
  if (color === "cyan") rgbGlow = "rgba(0, 242, 254, 0.4)";
  if (color === "green") rgbGlow = "rgba(46, 213, 115, 0.4)";
  if (color === "red") rgbGlow = "rgba(255, 0, 127, 0.4)";
  
  elements.modalGlow.style.setProperty("--modal-glow-color", rgbGlow);
  
  // Slide effect on main image to emphasize change
  elements.modalMainImg.style.transform = "scale(0.8) rotate(-15deg)";
  elements.modalMainImg.style.opacity = "0.3";
  
  setTimeout(() => {
    elements.modalMainImg.style.transform = "";
    elements.modalMainImg.style.opacity = "1";
    // Change image filter slightly to represent cyber color shifting!
    if (color === "cyan") elements.modalMainImg.style.filter = "hue-rotate(180deg) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))";
    else if (color === "green") elements.modalMainImg.style.filter = "hue-rotate(90deg) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))";
    else if (color === "red") elements.modalMainImg.style.filter = "hue-rotate(290deg) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))";
    else elements.modalMainImg.style.filter = "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))";
  }, 150);
}

function closeModal() {
  elements.modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// --- CHECKOUT OPERATIONS ---
function openCheckout() {
  // Populate Checkout Manifest review list
  elements.checkoutSummaryItems.innerHTML = "";
  let subtotal = 0;
  
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    
    const summaryItem = document.createElement("div");
    summaryItem.className = "checkout-summary-item";
    summaryItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="checkout-summary-info">
        <h4 class="checkout-summary-name">${item.name}</h4>
        <p class="checkout-summary-details">Size: ${item.size} // Qty: ${item.quantity}</p>
      </div>
      <span class="checkout-summary-price">$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    elements.checkoutSummaryItems.appendChild(summaryItem);
  });
  
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;
  
  elements.checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  elements.checkoutTaxes.textContent = `$${tax.toFixed(2)}`;
  elements.checkoutGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
  
  // Transition modal views
  elements.productDetailsView.style.display = "none";
  elements.checkoutView.style.display = "flex";
  elements.successView.style.display = "none";
  
  // Activate form elements states
  elements.checkoutForm.reset();
  elements.ccFrontNumber.textContent = "•••• •••• •••• ••••";
  elements.ccFrontHolder.textContent = "AURA OPERATOR";
  elements.ccFrontExpiry.textContent = "08/30";
  elements.ccBackCvv.textContent = "•••";
  
  elements.modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function processSimulatedPayment() {
  // Form checkout validations
  const name = elements.chName.value.trim();
  const num = elements.ccNumber.value.trim();
  const exp = elements.ccExp.value.trim();
  const cvv = elements.ccCvv.value.trim();
  
  if (!name || num.length < 15 || exp.length < 5 || cvv.length < 3) {
    showToast("Invalid security allocation fields.", "error");
    return;
  }
  
  // Processing animation states
  elements.submitPaymentBtn.disabled = true;
  elements.submitPaymentBtn.innerHTML = `Decrypting Enclave <i class="fa-solid fa-spinner fa-spin"></i>`;
  
  setTimeout(() => {
    elements.submitPaymentBtn.innerHTML = `Broadcasting Node <i class="fa-solid fa-wifi fa-fade"></i>`;
    
    setTimeout(() => {
      // Complete transaction successfully
      elements.submitPaymentBtn.disabled = false;
      elements.submitPaymentBtn.innerHTML = `Confirm Node Transfer <i class="fa-solid fa-circle-check"></i>`;
      
      // Random Node validation number
      const randomNode = Math.floor(Math.random() * 9000) + 1000;
      elements.successNodeVal.textContent = `#NODE-${randomNode}`;
      
      // Swap view to success
      elements.checkoutView.style.display = "none";
      elements.successView.style.display = "flex";
      
      // Animation pulse trigger
      showToast("Quantum Payment Confirmed!", "success");
    }, 1500);
  }, 1500);
}

// --- TOAST ALERTS SYSTEM ---
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  const icon = type === "success" 
    ? `<i class="fa-solid fa-circle-check toast-icon"></i>` 
    : `<i class="fa-solid fa-triangle-exclamation toast-icon"></i>`;
    
  toast.innerHTML = `
    ${icon}
    <span class="toast-message">${message}</span>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Auto remove after animation completes
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
