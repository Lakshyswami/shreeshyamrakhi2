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
function addToCart(name, price, wholesalePrice, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({
            name: name,
            price: price,
            wholesalePrice: wholesalePrice,
            image: image,
            qty: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " Cart me add ho gaya!");

}
function add12ToCart(name, price, wholesalePrice, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if (existing) {

        existing.qty += 12;

    } else {

        cart.push({
            name: name,
            price: price,
            wholesalePrice: wholesalePrice,
            image: image,
            qty: 12
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("12 " + name + " Cart me add ho gayi!");

}
function loadCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartItems = document.getElementById("cartItems");
    let totalPrice = document.getElementById("totalPrice");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        // Automatic Retail / Wholesale Price
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
function orderWhatsApp(){

    const name = document.getElementById("customerName")?.value || "";
    const mobile = document.getElementById("customerMobile")?.value || "";
    const address = document.getElementById("customerAddress")?.value || "";

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

    message += "👤 Name : " + name + "%0A";
    message += "📱 Mobile : " + mobile + "%0A";
    message += "🏠 Address : " + address + "%0A%0A";
    message += "🛒 Order Details:%0A%0A";

    cart.forEach(item => {

        // Automatic Retail / Wholesale Price
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

    document.getElementById("productDescription").innerText = product.description;

    if(document.getElementById("productRating")){
        document.getElementById("productRating").innerText = product.rating || "-";
    }

    if(document.getElementById("productStock")){
        document.getElementById("productStock").innerText = product.stock;
    }

    if(document.getElementById("productDelivery")){
        document.getElementById("productDelivery").innerText = product.delivery;
    }

    if(document.getElementById("productMaterial")){
        document.getElementById("productMaterial").innerText = product.material;
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
