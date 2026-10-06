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

document.querySelectorAll(".add-to-cart").forEach(function (button) {
  button.addEventListener("click", function () {
    addToCart({
      id: button.dataset.id,
      name: button.dataset.name,
      price: Number(button.dataset.price),
      img: button.dataset.img
    });
  });
});

cartItemsEl.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "plus") changeQty(id, 1);
  if (action === "minus") changeQty(id, -1);
  if (action === "remove") removeFromCart(id);
});

document.getElementById("open-order").addEventListener("click", function () {
  formEl.hidden = false;
  successEl.hidden = true;
  formEl.reset();
  modalEl.hidden = false;
});

document.getElementById("close-order").addEventListener("click", function () {
  modalEl.hidden = true;
});

formEl.addEventListener("submit", function (event) {
  event.preventDefault();
  formEl.hidden = true;
  successEl.hidden = false;
  cart = [];
  saveCart();
  renderCart();
});

renderCart();
