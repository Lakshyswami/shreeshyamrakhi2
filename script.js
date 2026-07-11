
// =======================
// PRODUCTS ARRAY
// =======================

let products = [];

// =======================
// PAGE LOAD
// =======================

window.onload = async function () {

    await loadProducts();

products.sort((a, b) => a.id - b.id);

if (document.getElementById("products")) {
    displayProducts();
}

    if (document.getElementById("productImage")) {
        await loadProductDetails();
    }

    loadCart();
    updateCartCount();

    if (document.getElementById("reviews")) {
        displayReviews();
    }

};

// =======================
// LOAD PRODUCTS
// =======================

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        products = await response.json();

    } catch (err) {

        console.error("Products Load Error:", err);

    }

}

// =======================
// DISPLAY PRODUCTS
// =======================

function displayProducts() {

    const container = document.getElementById("products");

    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `

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

<button onclick="addToCart('${product.name}', ${product.price}, ${product.wholesalePrice}, '${product.images[0]}')">
Add To Cart
</button>

<button onclick="add12ToCart('${product.name}', ${product.price}, ${product.wholesalePrice}, '${product.images[0]}')">
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

function addToCart(name, price, wholesalePrice, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({

            name,

            price,

            wholesalePrice,

            image,

            qty: 1

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " added to cart!");

}

// =======================
// ADD 12 TO CART
// =======================

function add12ToCart(name, price, wholesalePrice, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if (existing) {

        existing.qty += 12;

    } else {

        cart.push({

            name,

            price,

            wholesalePrice,

            image,

            qty: 12

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("12 " + name + " added to cart!");

}
// =======================
// LOAD CART
// =======================

function loadCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartItems = document.getElementById("cartItems");
    let totalPrice = document.getElementById("totalPrice");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        let currentPrice =
            item.qty >= 12
                ? (item.wholesalePrice || item.price)
                : item.price;

        let priceType =
            item.qty >= 12
                ? "Wholesale Price"
                : "Retail Price";

        let subtotal = currentPrice * item.qty;

        total += subtotal;

        cartItems.innerHTML += `

<div class="cart-item">

<img src="${item.image}" class="cart-image">

<div class="cart-details">

<h3>${item.name}</h3>

<p>${priceType} : ₹${currentPrice}</p>

<button onclick="decreaseQty(${index})">-</button>

<span>${item.qty}</span>

<button onclick="increaseQty(${index})">+</button>

<p><b>Subtotal : ₹${subtotal}</b></p>

</div>

<button class="remove-btn" onclick="removeItem(${index})">
Remove
</button>

</div>

`;

    });

    if (totalPrice) {

        totalPrice.innerHTML = "Total Price : ₹" + total;

    }

}

// =======================
// CART COUNT
// =======================

function updateCartCount() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(item => count += item.qty);

    const badge = document.getElementById("cartCount");

    if (badge) {

        badge.innerText = count;

    }

}

// =======================
// INCREASE QUANTITY
// =======================

function increaseQty(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty++;

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    loadCart();

}

// =======================
// DECREASE QUANTITY
// =======================

function decreaseQty(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].qty > 1) {

        cart[index].qty--;

    } else {

        cart.splice(index, 1);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    loadCart();

}

// =======================
// REMOVE ITEM
// =======================

function removeItem(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    loadCart();

}
// =======================
// WHATSAPP ORDER
// =======================

function orderWhatsApp() {

    const name = document.getElementById("customerName")?.value || "";
    const mobile = document.getElementById("customerMobile")?.value || "";
    const address = document.getElementById("customerAddress")?.value || "";

    if (name === "" || mobile === "" || address === "") {
        alert("Please fill all customer details");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart Empty");
        return;
    }

    let total = 0;

    let message = "🛍️ *New Order - Shree Shyam Rakhi*%0A%0A";

    message += "👤 Name : " + name + "%0A";
    message += "📱 Mobile : " + mobile + "%0A";
    message += "🏠 Address : " + address + "%0A%0A";
    message += "🛒 Order Details:%0A%0A";

    cart.forEach(item => {

        let currentPrice =
            item.qty >= 12
                ? (item.wholesalePrice || item.price)
                : item.price;

        let priceType =
            item.qty >= 12
                ? "Wholesale"
                : "Retail";

        let subtotal = currentPrice * item.qty;

        total += subtotal;

        message += "📦 " + item.name + "%0A";
        message += "Qty : " + item.qty + "%0A";
        message += priceType + " Price : ₹" + currentPrice + "%0A";
        message += "Subtotal : ₹" + subtotal + "%0A%0A";

    });

    message += "💰 Total : ₹" + total;

    window.open("https://wa.me/919462311500?text=" + message);

}

// =======================
// SEARCH PRODUCTS
// =======================

function searchProducts() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    const value = input.value.toLowerCase();

    document.querySelectorAll(".product").forEach(card => {

        const name = card.querySelector("h3").innerText.toLowerCase();

        card.style.display =
            name.includes(value) ? "block" : "none";

    });

}

// =======================
// CATEGORY FILTER
// =======================

function filterProducts(category) {

    document.querySelectorAll(".product").forEach(card => {

        if (category === "all" || card.dataset.category === category) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}

// =======================
// SORT PRODUCTS
// =======================

function sortProducts() {

    const sortValue = document.getElementById("sortSelect").value;

    switch (sortValue) {

        case "priceLow":
            products.sort((a, b) => a.price - b.price);
            break;

        case "priceHigh":
            products.sort((a, b) => b.price - a.price);
            break;

        case "nameAZ":
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;

        case "nameZA":
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;

        case "newest":
            products.sort((a, b) => b.id - a.id);
            break;

        case "oldest":
            products.sort((a, b) => a.id - b.id);
            break;

        default:
            products.sort((a, b) => a.id - b.id);
            break;

    }

    displayProducts();
    updateCartCount();

}
// =======================
// RESET SORT
// =======================

function resetSort() {

    products.sort((a, b) => a.id - b.id);

    const sort = document.getElementById("sortSelect");

    if (sort) {
        sort.value = "default";
    }

    displayProducts();

}

window.resetSort = resetSort;

// =======================
// REVIEWS
// =======================

async function addReview() {

    alert("Review system baad me Firebase se connect karenge.");

}

async function displayReviews() {

    const box = document.getElementById("reviews");

    if (box) {

        box.innerHTML = "";

    }

}
// =======================
// SCROLL TO TOP
// =======================

window.onscroll = function () {

    const btn = document.getElementById("scrollTopBtn");

    if (!btn) return;

    btn.style.display =
        (document.documentElement.scrollTop > 200)
            ? "block"
            : "none";

};

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// =======================
// PRODUCT DETAILS
// =======================

async function loadProductDetails() {

    await loadProducts();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const product = products.find(p => String(p.id) === String(id));

    if (!product) {

        document.querySelector(".product-detail").innerHTML =
            "<h2>Product Not Found</h2>";

        return;

    }

    document.getElementById("productImage").src = product.images[0];
    document.getElementById("productName").innerText = product.name;

    document.getElementById("productPrice").innerHTML =
        "Retail : ₹" + product.price +
        "<br><span class='wholesale-price'>Wholesale : ₹" +
        product.wholesalePrice +
        "</span>";

    document.getElementById("productDescription").innerText =
        product.description;

    if (document.getElementById("productRating")) {

        document.getElementById("productRating").innerText =
            product.rating || "-";

    }

    if (document.getElementById("productStock")) {

        document.getElementById("productStock").innerText =
            product.stock;

    }

    if (document.getElementById("productDelivery")) {

        document.getElementById("productDelivery").innerText =
            product.delivery;

    }

    if (document.getElementById("productMaterial")) {

        document.getElementById("productMaterial").innerText =
            product.material;

    }

    const gallery = document.getElementById("gallery");

    if (gallery) {

        gallery.innerHTML = "";

        product.images.forEach(img => {

            gallery.innerHTML += `

<img src="${img}" class="thumb"
onclick="document.getElementById('productImage').src='${img}'">

`;

        });

    }

    document.getElementById("buyBtn").onclick = function () {

        addToCart(

            product.name,

            product.price,

            product.wholesalePrice,

            product.images[0]

        );

    };

    updateCartCount();

}

// =======================
// SHARE PRODUCT WHATSAPP
// =======================

function shareProductWhatsApp() {

    const name = document.getElementById("productName").innerText;

    const price = document.getElementById("productPrice").innerText;

    const link = window.location.href;

    const message =
`🌸 *Shree Shyam Rakhi*

✨ ${name}

💰 ${price}

🛍️ Check this Rakhi:

${link}

🙏 Thank You`;

    const whatsappURL =
        "https://wa.me/?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

}

// =======================
// COPY PRODUCT LINK
// =======================

function copyProductLink() {

    navigator.clipboard.writeText(window.location.href)
    .then(() => {

        alert("✅ Product link copied!");

    })
    .catch(() => {

        alert("❌ Unable to copy link.");

    });

}

// =======================
// GLOBAL FUNCTIONS
// =======================

window.addToCart = addToCart;
window.add12ToCart = add12ToCart;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.removeItem = removeItem;
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.orderWhatsApp = orderWhatsApp;
window.scrollToTop = scrollToTop;
window.addReview = addReview;
window.loadProductDetails = loadProductDetails;
window.shareProductWhatsApp = shareProductWhatsApp;
window.copyProductLink = copyProductLink;

// =======================
// EXPORTS
// =======================

window.loadCart = loadCart;
window.updateCartCount = updateCartCount;

export {
    loadProductDetails,
    loadCart,
    updateCartCount,
    addToCart,
    add12ToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    searchProducts,
    filterProducts,
    sortProducts,
    orderWhatsApp,
    scrollToTop,
    addReview,
    displayReviews,
    copyProductLink,
    shareProductWhatsApp,
};