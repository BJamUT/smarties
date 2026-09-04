const grid = document.getElementById("grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const cardTemplate = document.getElementById("card-template");

let employees = [];
let sortBy = sortSelect.value;

function render(list) {
  grid.innerHTML = "";
  const frag = document.createDocumentFragment();

  for (const person of list) {
    const node = cardTemplate.content.cloneNode(true);

    const photo = node.querySelector(".photo");
    photo.src = person.photo;
    photo.alt = person.name;

    node.querySelector(".name").textContent = person.name;
    node.querySelector(".title").textContent = person.title;
    node.querySelector(".bio").textContent = person.bio || "";

    const linkedin = node.querySelector(".linkedin");
    if (person.linkedin) {
      linkedin.href = person.linkedin;
    } else {
      linkedin.remove();
    }

    frag.appendChild(node);
  }

  grid.appendChild(frag);
  resultCount.textContent = `${list.length} of ${employees.length}`;
  emptyState.hidden = list.length !== 0;
}

function getFirstName(person) {
  return person.name.trim().split(/\s+/)[0];
}

function getLastName(person) {
  const parts = person.name.trim().split(/\s+/);
  return parts[parts.length - 1];
}

function sortEmployees(list) {
  const keyFn = sortBy === "last" ? getLastName : getFirstName;
  return [...list].sort((a, b) => keyFn(a).localeCompare(keyFn(b)));
}

function filterEmployees(query) {
  const sorted = sortEmployees(employees);
  const q = query.trim().toLowerCase();
  if (!q) return sorted;

  // Rank name matches ahead of title/bio-only matches, keeping the chosen
  // name sort as the tiebreaker within each rank (Array#sort is stable).
  const ranked = [];
  for (const p of sorted) {
    const nameMatch = p.name.toLowerCase().includes(q);
    const otherMatch =
      p.title.toLowerCase().includes(q) ||
      (p.bio && p.bio.toLowerCase().includes(q));

    if (nameMatch || otherMatch) {
      ranked.push({ person: p, rank: nameMatch ? 0 : 1 });
    }
  }

  ranked.sort((a, b) => a.rank - b.rank);
  return ranked.map((r) => r.person);
}

searchInput.addEventListener("input", () => {
  render(filterEmployees(searchInput.value));
});

sortSelect.addEventListener("change", () => {
  sortBy = sortSelect.value;
  render(filterEmployees(searchInput.value));
});

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    employees = data;
    render(filterEmployees(searchInput.value));
  })
  .catch((err) => {
    grid.innerHTML = `<p style="color:red">Failed to load employee data: ${err.message}</p>`;
  });
