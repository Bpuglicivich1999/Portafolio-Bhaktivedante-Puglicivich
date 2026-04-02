const GITHUB_USERNAME = "Bpuglicivich1999";
const MAX_REPOS = 6;

function buildRepoCard(repo) {
  const card = document.createElement("a");
  card.className = "repo-card";
  card.href = repo.html_url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  const name = document.createElement("div");
  name.className = "repo-name";
  name.textContent = repo.name;

  const description = document.createElement("div");
  description.className = "repo-desc";
  description.textContent = repo.description || "Sin descripcion aun.";

  const meta = document.createElement("div");
  meta.className = "repo-meta";

  if (repo.language) {
    const language = document.createElement("span");
    language.className = "repo-lang";
    language.textContent = repo.language;
    meta.appendChild(language);
  }

  const stars = document.createElement("span");
  stars.className = "repo-stars";
  stars.textContent = `Stars: ${repo.stargazers_count ?? 0}`;
  meta.appendChild(stars);

  card.append(name, description, meta);
  return card;
}

async function loadRepos() {
  const container = document.getElementById("repos-container");
  if (!container) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${MAX_REPOS}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    const visibleRepos = repos.filter((repo) => !repo.fork).slice(0, MAX_REPOS);

    if (!visibleRepos.length) {
      container.innerHTML = '<p class="repos-loading">Aun no hay repositorios publicos.</p>';
      return;
    }

    const grid = document.createElement("div");
    grid.className = "repos-grid";
    visibleRepos.forEach((repo) => grid.appendChild(buildRepoCard(repo)));

    container.replaceChildren(grid);
  } catch (error) {
    container.innerHTML = '<p class="repos-loading">No se pudieron cargar los repos por ahora.</p>';
  }
}

document.addEventListener("DOMContentLoaded", loadRepos);
