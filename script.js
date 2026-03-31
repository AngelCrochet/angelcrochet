// Load saved cart (this is the key part)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to browser
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  saveCart();
  updateCart();
  showToast(`${name} added to cart`);toggleCart();
  localStorage.removeItem("cart");
}

// Remove item
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart(); // ✅ save
  updateCart();
}

// Update UI
function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");

    itemElement.innerHTML = `
      <h4>${item.name}</h4>
      <div class="cart-row">
  <p>R${item.price} x ${item.quantity}</p>

  <div class="qty-controls">
    <button onclick="changeQuantity('${item.name}', -1)">-</button>
    <button onclick="changeQuantity('${item.name}', 1)">+</button>
  </div>

  <button onclick="removeFromCart('${item.name}')">Remove</button>
</div>
    `;

    cartItemsContainer.appendChild(itemElement);
  });

  if (cartCount) cartCount.textContent = totalItems;
  if (cartTotal) cartTotal.textContent = totalPrice;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  }
}

// Toggle cart
function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}

// Checkout
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let message = "Hi, I would like to place an order:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    message += `- ${item.name} x${item.quantity} = R${item.price * item.quantity}%0A`;
    total += item.price * item.quantity;
  });

  message += `%0ATotal: R${total}`;

  // ⚠️ REPLACE THIS NUMBER
  window.open(`https://wa.me/27814694237?text=${message}`, "_blank");
}
function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}
function changeQuantity(name, amount) {
  const item = cart.find(i => i.name === name);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.name !== name);
  }

  saveCart();
  updateCart();
}
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}