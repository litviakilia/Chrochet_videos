
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const firebaseConfig = {"apiKey": "AIzaSyD170Bct_iQaHivGB0MDwFGqvO-0BZ-ASQ", "authDomain": "crochet-videos-5b09a.firebaseapp.com", "databaseURL": "https://crochet-videos-5b09a-default-rtdb.europe-west1.firebasedatabase.app", "projectId": "crochet-videos-5b09a", "storageBucket": "crochet-videos-5b09a.firebasestorage.app", "messagingSenderId": "159415304130", "appId": "1:159415304130:web:ffacbacb3eeade6c4c605b"};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
signInAnonymously(auth);

function scoreRef(id) { return ref(db, `votes/${id}/score`); }
function userRef(id, uid) { return ref(db, `votes/${id}/users/${uid}`); }

document.querySelectorAll(".video-card").forEach(card=>{
  const vid = card.dataset.id;
  const up = card.querySelector(".up");
  const down = card.querySelector(".down");
  const lbl = card.querySelector(".score");
  
  onValue(scoreRef(vid), snap=>{ lbl.textContent = snap.val() ?? 0; });
  
  auth.onAuthStateChanged(user=>{
    if(!user) return;
    onValue(userRef(vid, user.uid), snap=>{
        const my = snap.val() ?? 0;
        up.classList.toggle("active", my===1);
        down.classList.toggle("active", my===-1);
    });
  });
  
  function vote(delta){
    const user = auth.currentUser;
    if(!user) return;
    runTransaction(scoreRef(vid), curr=>{
      if(curr==null) curr=0;
      return runTransaction(userRef(vid, user.uid), my=>{
        my = my ?? 0;
        const next = (my===delta)?0:delta;
        const diff = next - my;
        return next;
      }).then(()=> curr + ((delta===1||delta===-1)? (auth.currentUser ? 0 : 0):0)); // placeholder, will be overridden
    });
  }
  
  up.addEventListener("click", ()=>vote(1));
  down.addEventListener("click", ()=>vote(-1));
});
