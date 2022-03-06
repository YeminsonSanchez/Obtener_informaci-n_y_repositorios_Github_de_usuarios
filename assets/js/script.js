const baseUrl = "https://api.github.com/users";
const request = async (url) => {
  const results = await fetch(url);
  const response = await results.json();
  return response;
};

const getUser = async (name) => {
  const url = `${baseUrl}/${name}`;
  return request(url);
};
const getRepos = async (name, page, repos) => {
  const url = `${baseUrl}/${name}/repos?page=${page}&per_page=${repos}`;
  return request(url);
};
let form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputs = new FormData(form);
  const resultUser = document.getElementById("resultUser");
  const resultRepos = document.getElementById("resultRepos");
  resultRepos.innerHTML = "";
  Promise.all([
    getUser(inputs.get("name")),
    getRepos(inputs.get("name"), inputs.get("page"), inputs.get("repoPage")),
  ])
    .then((resp) => {
      resultUser.innerHTML = `<img class="avatar" src="${resp[0].avatar_url}">
        <p>Nombre de usuario: ${resp[0].name}</p> <p>Nombre de login: ${resp[0].login}</p>
        <p>Cantidad de repositorios: ${resp[0].public_repos}</p> <p>Localidad: ${resp[0].location}</p>
        <p>Tipo de usuario: ${resp[0].type}</p>`;

      resp[1].map((repos) => {
        let reposName = repos.name;
        let reposUrl = repos.html_url;
        resultRepos.innerHTML += `<li><a target="_blank" href="${reposUrl}"> ${reposName}</a></li>`;
      });
    })

    .catch((err) => {
      alert("Usuario no existe", err);
      resultUser.innerHTML = "";
    });
  form.reset();
});
