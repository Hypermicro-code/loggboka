import { db, ref, set, push, onValue, remove, update } from "./firebase-init.js";
import { ref, push, set, get, child } from "./firebase-init.js";

const db = ref(database); // referanse til root
let currentProjectId = null;

// Last inn og vis prosjekter
function loadProjects() {
    const list = document.getElementById('projectList');
    list.innerHTML = "Laster prosjekter...";

    const projectsRef = ref(db, 'projects/');
    onValue(projectsRef, (snapshot) => {
        list.innerHTML = '';
        if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).forEach((key) => {
                const proj = data[key];
                const li = document.createElement('li');
                li.innerHTML = `
                    ${proj.name} (${proj.date})
                    <button onclick="editProject('${key}')">✏️</button>
                    <button onclick="deleteProject('${key}')">🗑️</button>
                `;
                list.appendChild(li);
            });
        } else {
            list.innerHTML = "Ingen prosjekter funnet.";
        }
    });
}

// Opprett nytt prosjekt
function createProject() {
    const name = prompt("Prosjektnavn:");
    const date = prompt("Dato (åååå-mm-dd):", new Date().toISOString().split('T')[0]);
    const info = prompt("Generelle opplysninger:");

    if (!name) return alert("Prosjektnavn kreves.");

    const newProj = {
        name,
        date,
        info,
        created: new Date().toISOString()
    };

    push(ref(db, 'projects/'), newProj);
}

// Rediger prosjekt
function editProject(projectId) {
    const projRef = ref(db, `projects/${projectId}`);
    onValue(projRef, (snapshot) => {
        const proj = snapshot.val();
        const name = prompt("Nytt prosjektnavn:", proj.name);
        const date = prompt("Ny dato:", proj.date);
        const info = prompt("Ny info:", proj.info);

        if (!name) return alert("Prosjektnavn kreves.");

        update(projRef, { name, date, info });
    }, { onlyOnce: true });
}

// Slett prosjekt
function deleteProject(projectId) {
    if (confirm("Er du sikker på at du vil slette dette prosjektet?")) {
        remove(ref(db, `projects/${projectId}`));
    }
}
function createArea(projectId, areaName) {
    const areaRef = ref(database, `projects/${projectId}/areas`);
    const newAreaRef = push(areaRef);
    set(newAreaRef, {
        name: areaName,
        createdAt: new Date().toISOString()
    }).then(() => {
        alert("Område opprettet!");
        loadAreas(projectId);
    });
}

function loadAreas(projectId) {
    const areasRef = ref(database, `projects/${projectId}/areas`);
    get(areasRef).then((snapshot) => {
        const areas = snapshot.val();
        displayAreas(areas, projectId);
    });
}

function displayAreas(areas, projectId) {
    const list = document.getElementById('areaList');
    list.innerHTML = '';

    if (!areas) {
        list.innerHTML = '<li>Ingen områder registrert.</li>';
        return;
    }

    Object.entries(areas).forEach(([key, area]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${area.name}
            <button onclick="alert('Funksjon for å vise bilder og notater her')">Åpne</button>
        `;
        list.appendChild(li);
    });
}
window.onload = loadProjects;
window.createProject = createProject;
window.editProject = editProject;
window.deleteProject = deleteProject;
