let stories=[]; let currentIndex=0;
const $=s=>document.querySelector(s);
async function init(){
  const response=await fetch('data/vignettes.json');
  if(!response.ok) throw new Error('Could not load vignette data.');
  stories=await response.json(); renderCards(); renderNav(); route();
}
function renderCards(){
  $('#storyGrid').innerHTML=stories.map((s,i)=>`<button class="story-card" data-index="${i}" type="button"><span class="story-card-number">${String(s.number).padStart(2,'0')} · ${s.status}</span><h3>${s.title}</h3><p>${s.excerpt}</p><span class="tag-row">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</span></button>`).join('');
  document.querySelectorAll('.story-card').forEach(b=>b.addEventListener('click',()=>openStory(+b.dataset.index)));
}
function renderNav() {
    $('#siteNav').innerHTML = stories.map((s, i) => `
    <a href="#story/${s.id}" data-index="${i}">
      ${s.number}. ${s.title}
    </a>
  `).join('');

    $('#siteNav').querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}
function openStory(index) {
    currentIndex = index;
    closeMenu();
    location.hash = `story/${stories[index].id}`;
}
function showHome(){ $('#homeView').hidden=false; $('#storyView').hidden=true; document.title='usernames_by_durows'; scrollTo(0,0); }
function showStory(index){
  currentIndex=index; const s=stories[index]; $('#homeView').hidden=true; $('#storyView').hidden=false;
  $('#storyNumber').textContent=`Vignette ${String(s.number).padStart(2,'0')} · ${s.status}`; $('#storyTitle').textContent=s.title;
  $('#storyTags').innerHTML=s.tags.map(t=>`<span class="tag">${t}</span>`).join(''); $('#storyContent').innerHTML=s.html;
  $('#storyContent').classList.remove('hide-artifacts'); $('#focusToggle').textContent='Hide artifacts';
  $('#prevStory').textContent=index?`← ${stories[index-1].title}`:'← Back to beginning';
  $('#nextStory').textContent=index<stories.length-1?`${stories[index+1].title} →`:'Return to all vignettes →';
  document.title=`${s.title} · usernames_by_durows`; scrollTo(0,0);
}
function route(){
  const hash=location.hash.replace('#',''); if(!hash||hash==='home') return showHome();
  if(hash.startsWith('story/')){ const id=hash.split('/')[1]; const i=stories.findIndex(s=>s.id===id); if(i>=0) return showStory(i); }
  showHome();
}
$('#startReading').addEventListener('click',()=>openStory(0));
$('#shuffleButton').addEventListener('click',()=>openStory(Math.floor(Math.random()*stories.length)));
$('#backHome').addEventListener('click',()=>location.hash='home');
$('#prevStory').addEventListener('click',()=>currentIndex?openStory(currentIndex-1):(location.hash='home'));
$('#nextStory').addEventListener('click',()=>currentIndex<stories.length-1?openStory(currentIndex+1):(location.hash='home'));
$('#focusToggle').addEventListener('click',()=>{ const hidden=$('#storyContent').classList.toggle('hide-artifacts'); $('#focusToggle').textContent=hidden?'Show artifacts':'Hide artifacts'; });
$('.brand').addEventListener('click',()=>location.hash='home');
$('#menuButton').addEventListener('click',()=>{const open=$('#siteNav').classList.toggle('open');$('#menuButton').setAttribute('aria-expanded',open)});
document.querySelectorAll('.view-button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.view-button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#storyGrid').classList.toggle('list',b.dataset.view==='list')}));
window.addEventListener('hashchange',route);
init().catch(err => { $('#app').innerHTML = `<section class="hero"><h1>Could not load the prototype.</h1><p>${err.message} Because this page uses fetch, open it through a web server rather than double-clicking index.html.</p></section>` });


function closeMenu() {
    $('#siteNav').classList.remove('open');
    $('#menuButton').setAttribute('aria-expanded', 'false');
}
