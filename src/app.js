import { db, ref, set, get, child } from "./firebase-init.js";

let projects = [];

function displayProjects() {
  const list = document.getElementById('projectList');
  list.innerHTML = '';

  projects.forEach((project) => {
    const li = document.createElement('li');
    li.textContent = project.name;
    list.appendChild(li);
  });
}

function openProjectDialog() {
  document.getElementById('projectDialog').style.display = 'flex';
}

function closeProjectDialog() {
  document.getElementById('projectDialog').style.display = 'none';
}

function saveProject() {
  const name = document.getElementById('projectName').value.trim();
  if (!name) {
    alert('Prosjektnavn er påkrevd.');
    return;
  }

  const newProject = { name };
  projects.push(newProject);

  set(ref(db, 'projects'), projects)
    .then(() => {
      closeProjectDialog();
      displayProjects();
    })
    .catch((error) => {
      alert('Kunne ikke lagre til Firebase: ' + error);
    });
}

function loadProjects() {
  get(child(ref(db), 'projects')).then((snapshot) => {
    if (snapshot.exists()) {
      projects = snapshot.val();
      displayProjects();
    } else {
      projects = [];
      displayProjects();
    }
  }).catch((error) => {
    console.error("Feil ved lasting fra Firebase:", error);
  });
}

window.onload = loadProjects;
