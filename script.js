import { db } from "./firebase.js";

import {
collection,
getDocs
addDoc,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// =======================
// PRODUCTS ARRAY
// =======================

let products = [];

// =======================
// PAGE LOAD
// =======================

window.onload = async function(){

await loadProducts();

loadCart();

updateCartCount();

displayReviews();

};

// =======================
// LOAD PRODUCTS FROM FIREBASE
// =======================

async function loadProducts(){

const snapshot = await getDocs(collection(db,"products"));

products=[];

snapshot.forEach((doc)=>{

products.push({

id:doc.id,

...doc.data()

});

});

displayProducts();

}

// =======================
// DISPLAY PRODUCTS
// =======================

function displayProducts(){

const container=document.getElementById("products");

if(!container) return;

container.innerHTML="";

products.forEach(product=>{

container.innerHTML+=`

<div class="product" data-category="${product.category}">

<a href="product.html?id=${product.id}">

<img src="${product.images[0]}" alt="${product.name}">

</a>

<h3>${product.name}</h3>

<p>${product.description}</p>

<h4>Retail : ₹${product.price}</h4>

<p class="wholesale-price">

Wholesale : ₹${product.wholesalePrice}

</p>

<button onclick="addToCart('${product.name}',${product.price},'${product.images[0]}')">

Add To Cart

</button>

<button onclick="add12ToCart('${product.name}',${product.wholesalePrice},'${product.images[0]}')">

Add 12 Rakhi

</button>

<p class="wholesale-text">

Wholesale price will be applicable on purchase of minimum 12 Rakhi.

</p>

</div>

`;

});

}
// =======================
// ADD TO CART
// =======================

function addToCart(name, price, image){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(item => item.name === name);

if(existing){

existing.qty++;

}else{

cart.push({
name:name,
price:price,
image:image,
qty:1
});

}

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();

alert(name + " Cart me add ho gaya!");

}

// =======================
// ADD 12 TO CART
// =======================

function add12ToCart(name, price, image){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(item => item.name === name);

if(existing){

existing.qty += 12;

}else{

cart.push({
name:name,
price:price,
image:image,
qty:12
});

}

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();

alert("12 " + name + " Cart me add ho gayi!");

}

// =======================
// LOAD CART
// =======================

function loadCart(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let cartItems = document.getElementById("cartItems");

let totalPrice = document.getElementById("totalPrice");

if(!cartItems) return;

cartItems.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

total += item.price * item.qty;

cartItems.innerHTML += `

<div class="cart-item">

<img src="${item.image}" class="cart-image">

<div class="cart-details">

<h3>${item.name}</h3>

<p>₹${item.price}</p>

<button onclick="decreaseQty(${index})">-</button>

<span>${item.qty}</span>

<button onclick="increaseQty(${index})">+</button>

<p><b>Subtotal : ₹${item.price * item.qty}</b></p>

</div>

<button class="remove-btn" onclick="removeItem(${index})">

Remove

</button>

</div>

`;

});

if(totalPrice){

totalPrice.innerHTML = "Total Price : ₹" + total;

}

}

// =======================
// CART COUNT
// =======================

function updateCartCount(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let count = 0;

cart.forEach(item=>{

count += item.qty;

});

let badge = document.getElementById("cartCount");

if(badge){

badge.innerText = count;

}

}
// =======================
// INCREASE QUANTITY
// =======================

function increaseQty(index){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart[index].qty++;

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();

loadCart();

}

// =======================
// DECREASE QUANTITY
// =======================

function decreaseQty(index){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if(cart[index].qty > 1){

cart[index].qty--;

}else{

cart.splice(index,1);

}

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();

loadCart();

}

// =======================
// REMOVE ITEM
// =======================

function removeItem(index){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.splice(index,1);

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();

loadCart();

}

// =======================
// WHATSAPP ORDER
// =======================

function orderWhatsApp(){

let name = document.getElementById("customerName").value;

let mobile = document.getElementById("customerMobile").value;

let address = document.getElementById("customerAddress").value;

if(name==="" || mobile==="" || address===""){

alert("Please fill all customer details");

return;

}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if(cart.length===0){

alert("Cart Empty");

return;

}

let total = 0;

let message = "🛍️ *New Order - Shree Shyam Rakhi*%0A%0A";

message += "👤 Name : "+name+"%0A";

message += "📱 Mobile : "+mobile+"%0A";

message += "🏠 Address : "+address+"%0A%0A";

message += "🛒 Order Details:%0A%0A";

cart.forEach(item=>{

message += "📦 "+item.name+"%0A";

message += "Qty : "+item.qty+"%0A";

message += "Price : ₹"+item.price+"%0A%0A";

total += item.price * item.qty;

});

message += "💰 Total : ₹"+total;

window.open("https://wa.me/919462311500?text="+message);

localStorage.removeItem("cart");

window.location.href="order-success.html";

}

// =======================
// SEARCH PRODUCTS
// =======================

function searchProducts(){

let input = document.getElementById("searchInput");

if(!input) return;

let value = input.value.toLowerCase();

let cards = document.querySelectorAll(".product");

cards.forEach(card=>{

let name = card.querySelector("h3").innerText.toLowerCase();

if(name.includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}

});

}

// =======================
// CATEGORY FILTER
// =======================

function filterProducts(category){

const cards = document.querySelectorAll(".product");

cards.forEach(card=>{

if(category==="all" || card.dataset.category===category){

card.style.display="block";

}else{

card.style.display="none";

}

});

}
// =======================
// ADD REVIEW
// =======================

async function addReview(){

let name = document.getElementById("reviewName").value;

let rating = document.getElementById("reviewRating").value;

let text = document.getElementById("reviewText").value;

if(name==="" || text===""){

alert("Please fill review");

return;

}

await addDoc(collection(db,"reviews"),{

name:name,

rating:rating,

text:text,

date:Date.now()

});

document.getElementById("reviewName").value="";

document.getElementById("reviewText").value="";

displayReviews();

}

// =======================
// DISPLAY REVIEWS
// =======================

async function displayReviews(){

const box=document.getElementById("reviews");

if(!box) return;

box.innerHTML="";

const q=query(

collection(db,"reviews"),

orderBy("date","desc")

);

const snapshot=await getDocs(q);

snapshot.forEach(doc=>{

const review=doc.data();

box.innerHTML+=`

<div class="review-card">

<h4>${review.name}</h4>

<p>${review.rating}</p>

<p>${review.text}</p>

</div>

`;

});

}

// =======================
// SCROLL TO TOP
// =======================

window.onscroll=function(){

let btn=document.getElementById("scrollTopBtn");

if(!btn) return;

if(document.body.scrollTop>200 ||

document.documentElement.scrollTop>200){

btn.style.display="block";

}else{

btn.style.display="none";

}

};

function scrollToTop(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}
// =======================
// PRODUCT DETAILS
// =======================

async function loadProductDetails(){

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

if(!id) return;

const product = products.find(p => String(p.id) === String(id));

if(!product) return;

document.getElementById("productName").innerText = product.name;

document.getElementById("productPrice").innerHTML =
"Retail : ₹" + product.price +
"<br><span class='wholesale-price'>Wholesale : ₹" +
product.wholesalePrice +
"</span>";

document.getElementById("productDescription").innerText =
product.description;

document.getElementById("productRating").innerText =
product.rating;

document.getElementById("productStock").innerText =
product.stock;

document.getElementById("productDelivery").innerText =
product.delivery;

document.getElementById("productMaterial").innerText =
product.material;

// Main Image

document.getElementById("productImage").src =
product.images[0];

// Gallery

const gallery = document.getElementById("gallery");

if(gallery){

gallery.innerHTML="";

product.images.forEach(img=>{

gallery.innerHTML += `

<img
src="${img}"
class="thumb"
onclick="changeImage('${img}')">

`;

});

}

// Add To Cart

document.getElementById("buyBtn").onclick=function(){

addToCart(

product.name,

product.price,

product.images[0]

);

};

}

// =======================
// CHANGE IMAGE
// =======================

function changeImage(image){

document.getElementById("productImage").src=image;

}
