
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


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
signInAnonymously(auth).catch(console.error);

function nodePath(vid) {
  return `votes/{${vid}}`;
}

function scoreRef(vid) {
  return ref(db, nodePath(vid) + '/score');
}

function videoNodeRef(vid) {
  return ref(db, nodePath(vid));
}

auth.onAuthStateChanged(() => {
  initVoting();
});

function initVoting() {
  document.querySelectorAll('.video-card').forEach(card => {
    const vid = card.dataset.id;
    if(!vid) return;
    const btnUp = card.querySelector('.up');
    const btnDown = card.querySelector('.down');
    const lblScore = card.querySelector('.score');

    // global score listener
    onValue(scoreRef(vid), snap => {
      lblScore.textContent = snap.exists() ? snap.val() : 0;
    });

    // my vote listener (optional - highlight)
    const myVoteRef = () => ref(db, nodePath(vid) + '/users/' + auth.currentUser.uid);
    onValue(myVoteRef(), snap => {
      const my = snap.exists() ? snap.val() : 0;
      btnUp.classList.toggle('active', my === 1);
      btnDown.classList.toggle('active', my === -1);
    });

    function sendVote(delta) {
      if(!auth.currentUser) return;
      runTransaction(videoNodeRef(vid), data => {
        if(data === null) {
          data = {score:0, users:{}};
        }
        const uid = auth.currentUser.uid;
        const prev = data.users[uid] ?? 0;
        const next = (prev === delta) ? 0 : delta;
        const diff = next - prev;
        data.users[uid] = next;
        data.score = (data.score || 0) + diff;
        return data;
      });
    }

    btnUp.addEventListener('click', () => sendVote(1));
    btnDown.addEventListener('click', () => sendVote(-1));
  });
}
