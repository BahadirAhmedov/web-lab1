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

function createElement(tag, options) {
  const el = document.createElement(tag);
  const settings = options || {};

  if (settings.className) el.className = settings.className;
  if (settings.text !== undefined) el.textContent = settings.text;
  if (settings.attrs) {
    Object.keys(settings.attrs).forEach(function (name) {
      el.setAttribute(name, settings.attrs[name]);
    });
  }
  if (settings.dataset) {
    Object.keys(settings.dataset).forEach(function (name) {
      el.dataset[name] = settings.dataset[name];
    });
  }
  if (settings.children) {
    settings.children.forEach(function (child) {
      el.appendChild(child);
    });
  }

  return el;
}

function createCartItem(item) {
  const image = createElement("img", {
    attrs: { src: item.img, alt: item.name }
  });

  const qty = createElement("div", {
    className: "qty",
    children: [
      createElement("button", {
        text: "-",
        attrs: { type: "button" },
        dataset: { action: "minus", id: item.id }
      }),
      createElement("span", { text: item.qty }),
      createElement("button", {
        text: "+",
        attrs: { type: "button" },
        dataset: { action: "plus", id: item.id }
      })
    ]
  });

  const info = createElement("div", {
    className: "cart-item__info",
    children: [
      createElement("h3", { text: item.name }),
      createElement("p", { text: item.price + " ₽" }),
      qty
    ]
  });

  const removeButton = createElement("button", {
    className: "remove",
    text: "Удалить",
    attrs: { type: "button" },
    dataset: { action: "remove", id: item.id }
  });

  return createElement("li", {
    className: "cart-item",
    children: [image, info, removeButton]
  });
}

function renderCart() {
  cartItemsEl.replaceChildren();
  cartEmptyEl.hidden = cart.length > 0;

  cart.forEach(function (item) {
    cartItemsEl.appendChild(createCartItem(item));
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
