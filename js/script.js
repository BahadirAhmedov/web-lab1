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