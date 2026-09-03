const grid = document.getElementById("grid");
const searchInput = document.getElementById("search-input");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const cardTemplate = document.getElementById("card-template");

let employees = [];

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

function filterEmployees(query) {
  const q = query.trim().toLowerCase();
  if (!q) return employees;
  return employees.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      (p.bio && p.bio.toLowerCase().includes(q))
    );
  });
}

searchInput.addEventListener("input", () => {
  render(filterEmployees(searchInput.value));
});

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    employees = data.sort((a, b) => a.name.localeCompare(b.name));
    render(employees);
  })
  .catch((err) => {
    grid.innerHTML = `<p style="color:red">Failed to load employee data: ${err.message}</p>`;
  });
