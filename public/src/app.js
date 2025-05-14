// Oppdatert app.js med Firebase integrasjon steg 4 og 5 (områder + bildeopplasting)
import { ref, push, set, get, child, storage, uploadBytes, getDownloadURL } from "./firebase-init.js";

const db = ref(database); // referanse til root

// Opprett område
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

// Last inn områder
function loadAreas(projectId) {
    const areasRef = ref(database, `projects/${projectId}/areas`);
    get(areasRef).then((snapshot) => {
        const areas = snapshot.val();
        displayAreas(areas, projectId);
    });
}

// Vis områder
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
            <button onclick="openArea('${projectId}', '${key}')">Åpne</button>
        `;
        list.appendChild(li);
    });
}

// Åpne område og vis bilder
function openArea(projectId, areaId) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="project-content">
            <h3>Område</h3>
            <button onclick="uploadImage('${projectId}', '${areaId}')">📷 Legg til bilde</button>
            <div id="imageGallery"></div>
            <button onclick="loadAreas('${projectId}')">🔙 Tilbake</button>
        </div>
    `;
    loadImages(projectId, areaId);
}

// Last opp bilde til Firebase Storage
function uploadImage(projectId, areaId) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const storageRef = storage.ref(`projects/${projectId}/areas/${areaId}/${file.name}`);
        await uploadBytes(storageRef, file);
        alert("Bilde lastet opp!");
        loadImages(projectId, areaId);
    };
    input.click();
}

// Last og vis bilder
function loadImages(projectId, areaId) {
    const gallery = document.getElementById('imageGallery');
    gallery.innerHTML = 'Laster bilder...';

    const listRef = storage.ref(`projects/${projectId}/areas/${areaId}/`);
    listRef.listAll().then((res) => {
        gallery.innerHTML = '';
        if (res.items.length === 0) gallery.innerHTML = 'Ingen bilder funnet.';
        res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
                const img = document.createElement('img');
                img.src = url;
                img.style.width = '120px';
                img.style.margin = '5px';
                gallery.appendChild(img);
            });
        });
    });
}

window.createArea = createArea;
window.loadAreas = loadAreas;
window.openArea = openArea;
