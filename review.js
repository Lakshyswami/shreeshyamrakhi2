import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
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
// SUBMIT REVIEW
// =======================

async function submitReview() {

  const name = document.getElementById("reviewName").value.trim();
  const rating = document.getElementById("reviewRating").value;
  const review = document.getElementById("reviewText").value.trim();

  if (!productId) {
    alert("Product ID not found.");
    return;
  }

  if (name === "" || rating === "" || review === "") {
    window.showToast("Please fill all fields");
    return;
  }

  try {

    await addDoc(collection(db, "reviews"), {
      productId: String(productId),
      name: name,
      rating: Number(rating),
      review: review,
      createdAt: serverTimestamp()
    });

   window.showToast("Review submitted successfully");

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewRating").value = "";
    document.getElementById("reviewText").value = "";

    loadReviews();

  } catch (error) {

    console.error("Submit Error:", error);
    window.showToast("Error submitting review");

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

    snapshot.forEach((doc) => {

      const data = doc.data();

      let stars = "";

      for (let i = 1; i <= 5; i++) {
        stars += i <= data.rating ? "⭐" : "☆";
      }

      reviewBox.innerHTML += `

<div class="review-card">

<h4>${data.name}</h4>

<p>${stars}</p>

<p>${data.review}</p>

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