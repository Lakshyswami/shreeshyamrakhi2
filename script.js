// =======================
// PRODUCTS DATABASE
// =======================

const products = [

{
id:1,
name:"Designer Rakhi",
price:20,
image:"rakhi1.jpg",
description:"Premium Handmade Designer Rakhi with beautiful craftsmanship.",
rating:"4.9 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Premium Silk Thread"
},

{
id:2,
name:"Royal Rakhi",
price:20,
image:"rakhi2.jpg",
description:"Elegant Royal Rakhi with premium finish.",
rating:"4.8 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Silk Thread"
},

{
id:3,
name:"Premium Rakhi",
price:399,
image:"rakhi3.jpg",
description:"Luxury Premium Rakhi made with high quality material.",
rating:"5.0 ⭐",
stock:"Available",
delivery:"2-3 Days",
material:"Premium Beads"
},

{
id:4,
name:"Classic Rakhi",
price:20,
image:"rakhi4.jpg",
description:"Traditional Classic Rakhi for Raksha Bandhan.",
rating:"4.7 ⭐",
stock:"Available",
delivery:"3-5 Days",
material:"Cotton & Silk"
},

{
id:5,
name:"Luxury Rakhi",
price:20,
image:"rakhi5.jpg",
description:"Luxury Designer Rakhi with premium look.",
rating:"4.9 ⭐",
stock:"Limited Stock",
delivery:"2-4 Days",
material:"Premium Silk"
},

{
id:6,
name:"Festival Special Rakhi",
price:20,
image:"rakhi6.jpg",
description:"Special Rakhi for festive celebrations.",
rating:"4.8 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Designer Thread"
},

{
id:7,
name:"Exclusive Rakhi",
price:20,
image:"rakhi7.jpg",
description:"Exclusive Premium Rakhi with elegant design.",
rating:"5.0 ⭐",
stock:"Available",
delivery:"2-3 Days",
material:"Premium Stone Work"
},

{
id:8,
name:"Joda Rakhi 1",
price:40,
image:"jodarakhi1.jpg",
description:"Beautiful Joda Rakhi for Bhaiya Bhabhi.",
rating:"4.9 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Premium Silk Thread"
},

{
id:9,
name:"Joda Rakhi 2",
price:20,
image:"jodarakhi2.jpg",
description:"Elegant Handmade Joda Rakhi.",
rating:"4.8 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Designer Thread"
},

{
id:10,
name:"Joda Rakhi 3",
price:20,
image:"jodarakhi3.jpg",
description:"Traditional Joda Rakhi with premium finish.",
rating:"4.8 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Silk Thread"
},

{
id:11,
name:"Kids Rakhi 1",
price:15,
image:"kidsrakhi1.jpg",
description:"Cute Kids Rakhi.",
rating:"4.9 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Soft Cotton"
},

{
id:12,
name:"Kids Rakhi 2",
price:15,
image:"kidsrakhi2.jpg",
description:"Colorful Kids Rakhi.",
rating:"4.8 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Soft Cotton"
},

{
id:13,
name:"Kids Rakhi 3",
price:15,
image:"kidsrakhi3.jpg",
description:"Premium Cartoon Kids Rakhi.",
rating:"4.9 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Soft Cotton"
},

{
id:14,
name:"Kundan Rakhi",
price:30,
image:"kundanrakhi.jpg",
description:"Premium Kundan Rakhi.",
rating:"5.0 ⭐",
stock:"Available",
delivery:"2-3 Days",
material:"Kundan Stone"
},

{
id:15,
name:"Lil Bro Rakhi",
price:15,
image:"lilbrorakhi.jpg",
description:"Special Lil Bro Rakhi.",
rating:"4.8 ⭐",
stock:"Available",
delivery:"2-4 Days",
material:"Designer Thread"
},

{
id:16,
name:"Om Rakhi",
price:20,
image:"omrakhi.jpg",
description:"Spiritual Om Rakhi.",
rating:"5.0 ⭐",
stock:"Available",
delivery:"2-3 Days",
material:"Premium Beads"
}

];



// =======================
// BANNER SLIDER
// =======================

const slider = document.getElementById("sliderImage");

if(slider){

const banners=[
"banner1.jpg",
"banner2.jpg",
"banner3.jpg"
];

let currentBanner=0;

setInterval(()=>{

currentBanner=(currentBanner+1)%banners.length;

slider.src=banners[currentBanner];

},3000);

}



// =======================
// ADD TO CART
// =======================

function addToCart(name,price,image){

let cart=JSON.parse(localStorage.getItem("cart")) || [];


let existing=cart.find(item=>item.name===name);


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


localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

alert(name+" Cart me add ho gaya!");

}



// =======================
// LOAD CART
// =======================

function loadCart(){

let cart=JSON.parse(localStorage.getItem("cart")) || [];

let cartItems=document.getElementById("cartItems");

let totalPrice=document.getElementById("totalPrice");


if(!cartItems) return;


cartItems.innerHTML="";


let total=0;


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


<p>
<b>Subtotal : ₹${item.price * item.qty}</b>
</p>


</div>


<button class="remove-btn" onclick="removeItem(${index})">
Remove
</button>


</div>

`;

});


totalPrice.innerHTML="Total Price : ₹"+total;


}
// =======================
// INCREASE QUANTITY
// =======================

function increaseQty(index){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart[index].qty++;

localStorage.setItem("cart",JSON.stringify(cart));

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

}
else{

cart.splice(index,1);

}


localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

loadCart();

}



// =======================
// REMOVE PRODUCT
// =======================

function removeItem(index){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.splice(index,1);

localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

loadCart();

}



// =======================
// WHATSAPP ORDER
// =======================

function orderWhatsApp(){

let name=document.getElementById("customerName").value;

let mobile=document.getElementById("customerMobile").value;

let address=document.getElementById("customerAddress").value;



if(name==="" || mobile==="" || address===""){

alert("Please fill all customer details");

return;

}



let cart=JSON.parse(localStorage.getItem("cart")) || [];


if(cart.length===0){

alert("Cart Empty");

return;

}



let total=0;


let message=
"🛍️ *New Order - Shree Shyam Rakhi*%0A%0A";


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



window.open(
"https://wa.me/919462311500?text="+message
);



localStorage.removeItem("cart");


window.location.href="order-success.html";


}




// =======================
// SEARCH PRODUCTS
// =======================

function searchProducts(){


let input=document.getElementById("searchInput");


if(!input) return;


let value=input.value.toLowerCase();


let products=document.querySelectorAll(".product");



products.forEach(product=>{


let name=
product.querySelector("h3").innerText.toLowerCase();



if(name.includes(value)){


product.style.display="block";


}
else{


product.style.display="none";


}



});


}



// =======================
// CART COUNT
// =======================

function updateCartCount(){


let cart=JSON.parse(localStorage.getItem("cart")) || [];


let count=0;


cart.forEach(item=>{


count += item.qty;


});



let badge=document.getElementById("cartCount");



if(badge){


badge.innerText=count;


}


}




// =======================
// REVIEW SYSTEM
// =======================

function addReview(){


let name=
document.getElementById("reviewName").value;


let rating=
document.getElementById("reviewRating").value;


let text=
document.getElementById("reviewText").value;



if(name==="" || text===""){


alert("Please fill review");


return;


}



let reviews=
JSON.parse(localStorage.getItem("reviews")) || [];



reviews.push({

name:name,

rating:rating,

text:text

});



localStorage.setItem(
"reviews",
JSON.stringify(reviews)
);



displayReviews();


}




function displayReviews(){


let box=document.getElementById("reviews");


if(!box) return;



let reviews=
JSON.parse(localStorage.getItem("reviews")) || [];



box.innerHTML="";



reviews.forEach(review=>{


box.innerHTML += `

<div class="review-card">

<h4>${review.name}</h4>

<p>${review.rating}</p>

<p>${review.text}</p>

</div>

`;


});


}




// =======================
// PAGE LOAD
// =======================

window.onload=function(){

loadCart();

updateCartCount();

displayReviews();


setTimeout(function(){

alert("🎁 Buy minimum 12 Rakhi and get up to 40% discount!");

},2000);


};
/* ==========================
   CATEGORY FILTER
========================== */

function filterProducts(category){

    const products = document.querySelectorAll(".product");
    const buttons = document.querySelectorAll(".category-buttons button");

    buttons.forEach(button=>{
        button.classList.remove("active");

        if(button.getAttribute("onclick").includes("'" + category + "'")){
            button.classList.add("active");
        }
    });

    products.forEach(product=>{

        if(category==="all" || product.dataset.category===category){
            product.style.display="";
        }else{
            product.style.display="none";
        }

    });

}
function add12ToCart(name,price,image){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let existing = cart.find(item=>item.name===name);


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


localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

alert("12 "+name+" added to cart!");

}
alert("TEST POPUP WORKING");