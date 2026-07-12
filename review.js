import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// =======================
// PRODUCT ID
// =======================

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("Current Product ID:", productId);

// =======================
// IMGBB CONFIG
// =======================

const IMGBB_API_KEY = "bef71ad3608374110b6492b2255788d3";

// =======================
// UPLOAD PHOTO TO IMGBB
// =======================

async function uploadPhotoToImgBB(file) {

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("ImgBB upload failed");
  }

}

// =======================
// SUBMIT REVIEW
// =======================

async function submitReview() {

  const name = document.getElementById("reviewName").value.trim();
  const rating = document.getElementById("reviewRating").value;
  const review = document.getElementById("reviewText").value.trim();
  const photoInput = document.getElementById("reviewPhoto");
  const submitBtn = document.getElementById("submitReviewBtn");

  if (!productId) {
    alert("Product ID not found.");
    return;
  }

  if (name === "" || rating === "" || review === "") {
    window.showToast("Please fill all fields");
    return;
  }

  try {

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting...";
    }

    let photoUrl = "";

    if (photoInput && photoInput.files.length > 0) {

      const file = photoInput.files[0];
      photoUrl = await uploadPhotoToImgBB(file);

    }

    await addDoc(collection(db, "reviews"), {
      productId: String(productId),
      name: name,
      rating: Number(rating),
      review: review,
      photoUrl: photoUrl,
      createdAt: serverTimestamp()
    });

    window.showToast("Review submitted successfully");

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewRating").value = "";
    document.getElementById("reviewText").value = "";
    if (photoInput) photoInput.value = "";

    loadReviews();

  } catch (error) {

    console.error("Submit Error:", error);
    window.showToast("Error submitting review");

  } finally {

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit Review";
    }

  }

}

// =======================
// LOAD REVIEWS
// =======================

async function loadReviews() {

  const reviewBox = document.getElementById("reviews");

  if (!reviewBox) return;

  reviewBox.innerHTML = "<p>Loading reviews...</p>";

  try {

    const q = query(
      collection(db, "reviews"),
      where("productId", "==", String(productId)),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    reviewBox.innerHTML = "";

    if (snapshot.empty) {
      reviewBox.innerHTML = "<p>No reviews yet.</p>";
      return;
    }

    const likedReviews = JSON.parse(localStorage.getItem("likedReviews")) || [];

    snapshot.forEach((doc) => {

      const data = doc.data();
      const reviewId = doc.id;

      let stars = "";

      for (let i = 1; i <= 5; i++) {
        stars += i <= data.rating ? "⭐" : "☆";
      }

      const photoHtml = data.photoUrl
        ? `<img src="${data.photoUrl}" onclick="openLightbox('${data.photoUrl}')" style="width:100%; max-width:200px; border-radius:12px; margin-top:10px; cursor:pointer; transition:.3s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">`
        : "";

      const likeCount = data.likes || 0;
      const alreadyLiked = likedReviews.includes(reviewId);

      reviewBox.innerHTML += `

<div class="review-card">

<h4>${data.name}</h4>

<p>${stars}</p>

<p>${data.review}</p>

${photoHtml}

<button
  id="likeBtn-${reviewId}"
  onclick="toggleLike('${reviewId}')"
  style="
    margin-top:12px;
    padding:8px 16px;
    border:none;
    border-radius:20px;
    background:${alreadyLiked ? '#8B0000' : '#eee'};
    color:${alreadyLiked ? '#fff' : '#555'};
    font-weight:bold;
    cursor:pointer;
    transition:.3s;
  "
>
👍 Helpful (<span id="likeCount-${reviewId}">${likeCount}</span>)
</button>

</div>

`;

    });

  } catch (error) {

    console.error("Load Reviews Error:", error);

    reviewBox.innerHTML =
      "<p>Unable to load reviews. Check Console (F12).</p>";

  }

}

// =======================
// TOGGLE LIKE
// =======================

async function toggleLike(reviewId) {

  let likedReviews = JSON.parse(localStorage.getItem("likedReviews")) || [];

  const alreadyLiked = likedReviews.includes(reviewId);

  const reviewRef = doc(db, "reviews", reviewId);

  try {

    if (alreadyLiked) {

      await updateDoc(reviewRef, {
        likes: increment(-1)
      });

      likedReviews = likedReviews.filter(id => id !== reviewId);

    } else {

      await updateDoc(reviewRef, {
        likes: increment(1)
      });

      likedReviews.push(reviewId);

    }

    localStorage.setItem("likedReviews", JSON.stringify(likedReviews));

    // UI turant update karo bina pura reload kiye
    const btn = document.getElementById(`likeBtn-${reviewId}`);
    const countSpan = document.getElementById(`likeCount-${reviewId}`);

    const newCount = Number(countSpan.innerText) + (alreadyLiked ? -1 : 1);
    countSpan.innerText = newCount;

    if (alreadyLiked) {
      btn.style.background = "#eee";
      btn.style.color = "#555";
    } else {
      btn.style.background = "#8B0000";
      btn.style.color = "#fff";
    }

  } catch (error) {

    console.error("Like Error:", error);
    window.showToast("Error updating like");

  }

}

window.toggleLike = toggleLike;

// =======================
// GLOBAL FUNCTION
// =======================

window.submitReview = submitReview;

// =======================
// AUTO LOAD REVIEWS
// =======================

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("reviews")) {
    loadReviews();
  }

});

// =======================
// EXPORTS
// =======================

export {
  submitReview,
  loadReviews
};