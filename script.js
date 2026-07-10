import { db } from "./firebase.js";

import {
collection,
getDocs
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
