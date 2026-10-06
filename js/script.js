const STORAGE_KEY = "coffee-cart";

const cartItemsEl = document.getElementById("cart-items");
const cartEmptyEl = document.getElementById("cart-empty");
const cartSumEl = document.getElementById("cart-sum");
const modalEl = document.getElementById("order-modal");
const formEl = document.getElementById("order-form");
const successEl = document.getElementById("order-success");

let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function getTotal() {
  return cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  cartEmptyEl.hidden = cart.length > 0;

  cart.forEach(function (item) {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML =
      '<img src="' + item.img + '" alt="' + item.name + '">' +
      '<div class="cart-item__info">' +
        "<h3>" + item.name + "</h3>" +
        "<p>" + item.price + " ₽</p>" +
        '<div class="qty">' +
          '<button type="button" data-action="minus" data-id="' + item.id + '">-</button>' +
          "<span>" + item.qty + "</span>" +
          '<button type="button" data-action="plus" data-id="' + item.id + '">+</button>' +
        "</div>" +
      "</div>" +
      '<button type="button" class="remove" data-action="remove" data-id="' + item.id + '">Удалить</button>';
    cartItemsEl.appendChild(li);
  });

  cartSumEl.textContent = getTotal();
}

function addToCart(product) {
  const existing = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }

  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(function (product) {
    return product.id === id;
  });
  if (!item) return;

  item.qty += delta;
  if (item.qty < 1) {
    cart = cart.filter(function (product) {
      return product.id !== id;
    });
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(function (item) {
    return item.id !== id;
  });
  saveCart();
  renderCart();
}
