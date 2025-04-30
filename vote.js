
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
const firebaseConfig = {"apiKey": "AIzaSyD170Bct_iQaHivGB0MDwFGqvO-0BZ-ASQ", "authDomain": "crochet-videos-5b09a.firebaseapp.com", "databaseURL": "https://crochet-videos-5b09a-default-rtdb.europe-west1.firebasedatabase.app", "projectId": "crochet-videos-5b09a", "storageBucket": "crochet-videos-5b09a.firebasestorage.app", "messagingSenderId": "159415304130", "appId": "1:159415304130:web:ffacbacb3eeade6c4c605b"};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
signInAnonymously(auth);
const vRef = id=>ref(db,`votes/${id}`);
function mount(card){
  const vid=card.dataset.id;
  const up=card.querySelector(".up");
  const down=card.querySelector(".down");
  const scoreEl=card.querySelector(".score");
  onValue(vRef(vid),snap=>{
     const d=snap.val()||{score:0,users:{}};
     scoreEl.textContent=d.score??0;
     const my=d.users?.[auth.currentUser?.uid]??0;
     up.classList.toggle("active",my===1);
     down.classList.toggle("active",my===-1);
  });
  function vote(delta){
     runTransaction(vRef(vid),data=>{
        data=data||{score:0,users:{}};
        const uid=auth.currentUser.uid;
        const prev=data.users[uid]??0;
        const next=(prev===delta)?0:delta;
        data.users[uid]=next;
        data.score+=next-prev;
        return data;
     });
  }
  up.addEventListener("click",()=>vote(1));
  down.addEventListener("click",()=>vote(-1));
}
document.querySelectorAll(".video-card").forEach(mount);
