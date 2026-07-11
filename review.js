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

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function submitReview() {

  const name = document.getElementById("reviewName").value.trim();
  const rating = document.getElementById("reviewRating").value;
  const review = document.getElementById("reviewText").value.trim();

  if (name === "" || rating === "" || review === "") {
    alert("Please fill all fields.");
    return;
  }

  try {

    await addDoc(collection(db, "reviews"), {

      productId: productId,
      name: name,
      rating: Number(rating),
      review: review,
      createdAt: serverTimestamp()

    });

    alert("Review submitted successfully!");

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewRating").value = "";
    document.getElementById("reviewText").value = "";

    loadReviews();

  } catch (e) {

    console.error(e);
    alert("Error submitting review.");

  }

}
async function loadReviews() {

  const reviewBox = document.getElementById("reviews");

  if (!reviewBox) return;

  reviewBox.innerHTML = "<p>Loading reviews...</p>";

  const q = query(
    collection(db, "reviews"),
    where("productId", "==", productId),
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

}
window.submitReview = submitReview;

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("reviews")) {
    loadReviews();
  }

});
export {
  submitReview,
  loadReviews
};