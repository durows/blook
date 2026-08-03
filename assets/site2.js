let stories = [];
let currentIndex = 0;
let currentVersion = 'original';

const $ = s => document.querySelector(s);

async function init() {
    const response = await fetch('data/vignettes1.json');

    if (!response.ok) {
        throw new Error('Could not load vignette data.');
    }

    const allStories = await response.json();

    stories = allStories.filter(story =>
        (story.publish || 'Published').toLowerCase() === 'published'
    );

    renderCards();
    renderNav();
    route();
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
function showStory(index) {
    currentIndex = index;
    currentVersion = 'maven';

    const s = stories[index];

    $('#homeView').hidden = true;
    $('#storyView').hidden = false;

    $('#storyNumber').textContent =
        `Vignette ${String(s.number).padStart(2, '0')} · ${s.status}`;

    $('#storyTitle').textContent = s.title;

    $('#storyTags').innerHTML = s.tags
        .map(t => `<span class="tag">${t}</span>`)
        .join('');

    $('#originalVersion').classList.add('active');
    $('#mavenVersion').classList.remove('active');

    const hasMavenEdit = Boolean(s.html_maven);

    $('#mavenVersion').disabled = !hasMavenEdit;
    $('#mavenVersion').title = hasMavenEdit
        ? 'Read the Maven edit'
        : 'Maven edit coming soon';

    renderStoryVersion();

    $('#prevStory').textContent = index
        ? `← ${stories[index - 1].title}`
        : '← Back to beginning';

    $('#nextStory').textContent = index < stories.length - 1
        ? `${stories[index + 1].title} →`
        : 'Return to all vignettes →';

    document.title = `${s.title} · usernames_by_durows`;

    scrollTo(0, 0);
}

function renderStoryVersion() {
    const s = stories[currentIndex];

    const useMaven =
        currentVersion === 'maven' &&
        Boolean(s.html_maven);

    $('#storyContent').innerHTML = useMaven
        ? s.html_maven
        : s.html;

    $('#storyContent').classList.remove('hide-artifacts');
    $('#focusToggle').textContent = 'Hide artifacts';

    $('#originalVersion').classList.toggle('active', !useMaven);
    $('#mavenVersion').classList.toggle('active', useMaven);
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

$('#originalVersion').addEventListener('click', () => {
    currentVersion = 'original';
    renderStoryVersion();
    scrollTo(0, 0);
});

$('#mavenVersion').addEventListener('click', () => {
    if (!stories[currentIndex].html_maven) return;

    currentVersion = 'maven';
    renderStoryVersion();
    scrollTo(0, 0);
});


function closeMenu() {
    $('#siteNav').classList.remove('open');
    $('#menuButton').setAttribute('aria-expanded', 'false');
}

const blookArtifacts = {
    surfs: {
        title: "SURFS",
        image: "assets/images/SURFS.jpg",
        alt: "SURFS framework",
        caption: "Sustainable, User-friendly, Reliable, Flexible, and Scalable."
    },
    picake: {
        title: "Pi Cake",
        image: "assets/images/PiCake/image1.png",
        alt: "Pi Cake",
        caption: "World Longest Digits of Pi Cake attempt"
    },
    paperclips: {
        title: "Steven rolled",
        image: "assets/images/head_animation.gif",
        alt: "Steven rolled",
        caption: "Steven Rolled"
    },
    rules: {
        title: "Bowling Rules",
        image: "assets/images/rulesBowlingText.png",
        alt: "Bowling Rules",
        caption: "The equivilant of flipping a coin eight times and getting tails all 8 times"
    },
    cardboard: {
        title: "Making of Pi Day",
        image: "assets/images/PiCake/cardboardMontage.png",
        alt: "Making of Pi Day",
        caption: "Cutting up cardboard to transport pi cake. Video available for purchase."
    },
    digits: {
        title: "Making of Pi Day",
        image: "assets/images/PiCake/piDigitsForCake.png",
        alt: "Making of Pi Day",
        caption: "Digits for each segment of pi cake"
    },
    watch: {
        title: "Calculator Watch",
        image: "assets/images/GoodJobPencils/calculatorWatch2.png",
        alt: "Calculator Watch",
        caption: "Calculator Watch"
    },
    staffpictures: {
        title: "Staff Picture Frame",
        image: "assets/images/staffPictures.png",
        alt: "Staff Picture Frame",
        caption: "Staff Picture Frame"
    }


    
    // Add more artifacts here later:
    //
    // piPoster: {
    //     title: "The Pi Poster",
    //     image: "assets/images/piPoster/piPoster.png",
    //     alt: "Poster containing digits of pi",
    //     caption: "The poster that started a graduation tradition."
    // }
};

function showArtifactModal(artifactId) {
    const artifact = blookArtifacts[artifactId];

    if (!artifact) {
        console.warn("Artifact not found:", artifactId);
        return;
    }

    const modal = document.getElementById("artifactModal");
    const image = document.getElementById("artifactModalImage");
    const title = document.getElementById("artifactModalTitle");
    const caption = document.getElementById("artifactModalCaption");

    title.textContent = artifact.title || "";
    image.src = artifact.image;
    image.alt = artifact.alt || artifact.title || "Artifact";
    caption.textContent = artifact.caption || "";

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("artifact-modal-open");

    document.querySelector(".artifact-modal-close")?.focus();
}

function closeArtifactModal() {
    const modal = document.getElementById("artifactModal");

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("artifact-modal-open");

    document.getElementById("artifactModalImage").src = "";
}

document.addEventListener("click", function (event) {
    const modal = document.getElementById("artifactModal");

    if (event.target === modal) {
        closeArtifactModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeArtifactModal();
    }
});
