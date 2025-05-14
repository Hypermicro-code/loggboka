let projects = JSON.parse(localStorage.getItem('projects')) || [];

function displayProjects() {
  const list = document.getElementById('projectList');
  list.innerHTML = '';

  projects.forEach((project, index) => {
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

  projects.push({ name });
  localStorage.setItem('projects', JSON.stringify(projects));
  closeProjectDialog();
  displayProjects();
}

window.onload = displayProjects;
