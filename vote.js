
// vote.js  — global voting with Firebase Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD170Bct_iQaHivGB0MDwFGqvO-0BZ-ASQ",
    authDomain: "crochet-videos-5b09a.firebaseapp.com",
    databaseURL: "https://crochet-videos-5b09a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "crochet-videos-5b09a",
    storageBucket: "crochet-videos-5b09a.firebasestorage.app",
    messagingSenderId: "159415304130",
    appId: "1:159415304130:web:ffacbacb3eeade6c4c605b"
};

const app  = initializeApp(firebaseConfig);
const db   = getDatabase(app);
const auth = getAuth(app);
signInAnonymously(auth);

/**
 * Return database ref for total score for video id
 */
function scoreRef(id) {
  return ref(db, `votes/${id}/score`);
}
/**
 * Return database ref for user's vote
 */
function userRef(id, uid) {
  return ref(db, `votes/${id}/users/${uid}`);
}

document.querySelectorAll(".video-card").forEach(card => {
  const vid      = card.dataset.id;
  const btnUp    = card.querySelector(".up");
  const btnDown  = card.querySelector(".down");
  const lblScore = card.querySelector(".score");

  // live score listener
  onValue(scoreRef(vid), snap => {
      lblScore.textContent = snap.exists() ? snap.val() : 0;
  });

  // reflect my own vote (after auth ready)
  auth.onAuthStateChanged(user => {
    if(!user) return;
    onValue(userRef(vid, user.uid), snap => {
       const myVote = snap.exists() ? snap.val() : 0;
       btnUp.classList.toggle("active", myVote === 1);
       btnDown.classList.toggle("active", myVote === -1);
    });
  });

  function send(delta) {
    const user = auth.currentUser;
    if(!user) return;

    runTransaction(scoreRef(vid), current => {
      if(current === null) current = 0;
      return current; // we'll update after user vote transaction
    }).then(() => {
      runTransaction(userRef(vid, user.uid), myVote => {
        myVote = myVote ?? 0;
        const next = (myVote === delta) ? 0 : delta;
        const diff = next - myVote;
        // update score
        runTransaction(scoreRef(vid), s => (s ?? 0) + diff);
        return next;
      });
    });
  }

  btnUp.addEventListener("click", () => send(1));
  btnDown.addEventListener("click", () => send(-1));
});
