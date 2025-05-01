
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
const app = initializeApp({"apiKey": "AIzaSyD170Bct_iQaHivGB0MDwFGqvO-0BZ-ASQ", "authDomain": "crochet-videos-5b09a.firebaseapp.com", "databaseURL": "https://crochet-videos-5b09a-default-rtdb.europe-west1.firebasedatabase.app", "projectId": "crochet-videos-5b09a", "storageBucket": "crochet-videos-5b09a.firebasestorage.app", "messagingSenderId": "159415304130", "appId": "1:159415304130:web:ffacbacb3eeade6c4c605b"});
const db = getDatabase(app);
const auth = getAuth(app);
await signInAnonymously(auth);
const vRef = id => ref(db, `votes/${id}`);
document.querySelectorAll(".video-card").forEach(card => {
  const vid = card.dataset.id;
  const up  = card.querySelector(".up");
  const down= card.querySelector(".down");
  const score = card.querySelector(".score");
  onValue(vRef(vid), snap => {
      const d = snap.val() || {score:0,users:{}};
      score.textContent = d.score ?? 0;
      const me = d.users?.[auth.currentUser?.uid] ?? 0;
      up.classList.toggle("active", me === 1);
      down.classList.toggle("active", me === -1);
  });
  function vote(delta){
      const uid = auth.currentUser.uid;
      runTransaction(vRef(vid), data => {
          data = data || {score:0,users:{}};
          const prev = data.users[uid] || 0;
          const next = (prev === delta) ? 0 : delta;
          data.users[uid] = next;
          data.score += next - prev;
          return data;
      });
  }
  up.addEventListener("click", ()=>vote(1));
  down.addEventListener("click", ()=>vote(-1));
});
