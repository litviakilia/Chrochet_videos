
document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.vote-box');
  boxes.forEach(box => {
    const id = box.dataset.id;
    const upBtn = box.querySelector('.up');
    const downBtn = box.querySelector('.down');
    const scoreSpan = box.querySelector('.score');

    function getVote(){
      return parseInt(localStorage.getItem('vote_'+id) || '0', 10);
    }
    function setVote(val){
      localStorage.setItem('vote_'+id, String(val));
    }
    function updateUI(){
      const v = getVote();
      upBtn.classList.toggle('active', v===1);
      downBtn.classList.toggle('active', v===-1);
      scoreSpan.textContent = v;
    }
    upBtn.addEventListener('click', () => {
      const v = getVote();
      setVote(v===1?0:1);
      updateUI();
    });
    downBtn.addEventListener('click', () => {
      const v = getVote();
      setVote(v===-1?0:-1);
      updateUI();
    });
    updateUI();
  });
});
