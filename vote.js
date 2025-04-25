
// simple localStorage voting
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.vote-box').forEach(box=>{
    const up=box.querySelector('.up')
    const down=box.querySelector('.down')
    const scoreEl=box.querySelector('.score')
    const videoId=box.dataset.vid
    let score=parseInt(localStorage.getItem('score_'+videoId))||0
    let userVote=localStorage.getItem('vote_'+videoId)||''
    scoreEl.textContent=score
    if(userVote==='up'){up.classList.add('voted')}
    if(userVote==='down'){down.classList.add('voted')}
    up.addEventListener('click',()=>vote(1))
    down.addEventListener('click',()=>vote(-1))
    function vote(dir){
      let prev = userVote==='up'?1 : userVote==='down'?-1 : 0
      if(dir===prev){
        // undo
        score -= dir
        userVote=''
      }else{
        score += dir - prev
        userVote = dir===1?'up':'down'
      }
      scoreEl.textContent=score
      localStorage.setItem('score_'+videoId, score)
      localStorage.setItem('vote_'+videoId, userVote)
      up.classList.toggle('voted', userVote==='up')
      down.classList.toggle('voted', userVote==='down')
    }
  })
})
