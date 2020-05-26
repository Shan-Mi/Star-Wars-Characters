const rootURL = "https://swapi.dev/api/people/?page=";
const searchBtn = document.querySelector("button");
const charactersArea = document.querySelector(".characters-wrapper");
const searchTermArea = document.querySelector("#searchTerm");
let id = 0,
  characters,
  i = 1,
  charactersJson,
  results = [],
  filterResults = [];

const getCharacters = async () => {
  let isThisEnd = false;
  try {
    const res = await fetch(`${rootURL}${i}`);
    charactersJson = await res.json();
    // console.log(charactersJson.next);
    characters = await charactersJson.results;
    results.push(characters);
    results = results.flat();
    if (charactersJson.next) {
      i++;
      getCharacters();
    }
    if (!charactersJson.next) {
      isThisEnd = true;
    }
  } catch (err) {
    console.log(err);
  }

  if (isThisEnd) {
    drawCharacterArea(results);
  }
};

getCharacters();

function drawCharacterArea(results) {
  generateCharatersPanel(results);

  searchTermArea.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    let isThereAnyFound = false;
    filterResults = [];
    results.forEach((result) => {
      if (result.name.toLowerCase().includes(searchString)) {
        filterResults.push(result);
        isThereAnyFound = true;
        generateCharatersPanel(filterResults);
      } else if (!isThereAnyFound) {
        charactersArea.innerHTML = "";
      }
    });
  });
}

const swPanel = document.querySelector("#sw-panel");
swPanel.addEventListener("click", (e) => {
  if (e.target.matches("p")) {
    let chosenId = e.target.dataset.id;
    document.querySelectorAll(`[data-info="${chosenId}"]`).forEach((item) => {
      item.classList.toggle("hidden");
    });
  }
});

document.querySelector(".date").innerHTML = new Date();

function generateCharatersPanel(characters) {
  charactersArea.innerHTML = "";
  id = 0;
  const htmlString = characters
    .map((character) => {
      let films = "";
      let gender;
      let hrefLink;

      character.films.map((film) => {
        switch (film.slice(-2, -1)) {
          case "1":
            hrefLink =
              "https://en.wikipedia.org/wiki/Star_Wars:_Episode_I_%E2%80%93_The_Phantom_Menace";
            break;
          case "2":
            hrefLink =
              "https://en.wikipedia.org/wiki/Star_Wars:_Episode_II_%E2%80%93_Attack_of_the_Clones";
            break;
          case "3":
            hrefLink =
              "https://en.wikipedia.org/wiki/Star_Wars:_Episode_III_%E2%80%93_Revenge_of_the_Sith";
            break;
          case "4":
            hrefLink =
              "https://en.wikipedia.org/wiki/Star_Wars:_The_Force_Awakens";
            break;
          case "5":
            hrefLink = "https://en.wikipedia.org/wiki/Star_Wars:_The_Last_Jedi";
            break;
          case "6":
            hrefLink =
              "https://en.wikipedia.org/wiki/Star_Wars:_The_Rise_of_Skywalker";
            break;
        }
        return (films += `<a href='${hrefLink}'>${film}</a>`);
      });
      gender = character.gender.replace(/\//, "");
      id++;

      return `
        <div data-id="${id}" class="character">
          <div class="name-container ${gender}">
            <a class='showInfo'><p class="name" data-id="${id}">${character.name}</p></a>
          </div>
          <div class="info-container hidden" data-info="${id}">
            ${films} 
            <p class="text"><b>Hair Color</b>: ${character.hair_color}</p>
            <p class="text"><b>Eye Color</b>: ${character.eye_color}</p>
          </div>
        </div>
        `;
    })
    .join("");

  charactersArea.innerHTML += htmlString;
}

const characterCards = document.querySelectorAll(".character");
const overlay = document.querySelector(".overlay");
const module = document.querySelector(".module");

charactersArea.addEventListener("click", (e) => {
  if (e.target.matches("div.character")) {
    overlay.classList.remove("hidden");
    module.classList.remove("hidden");

    results.forEach((result) => {
      if (result.name == e.target.firstElementChild.innerText) {
        let homeworld;

        (async () => {
          try {
            const res = await fetch(`${result.homeworld}`);
            const resJson = await res.json();
            homeworld = resJson.name;
            let species = result.species != false ? result.species : "unknown";
            module.innerHTML = `
              <h2>Name: ${result.name}</h2>
              <p class="module-text"><strong>Birth of Year</strong>: <i>${result.birth_year}</i></p>
              <p class="module-text"><strong>Height</strong>: <i>${result.height}</i></p>
              <p class="module-text"><strong>Hair Color</strong>: <i>${result.hair_color}</i></p>
              <p class="module-text"><strong>Skin Color</strong>: <i>${result.skin_color}</i></p>
              <p class="module-text"><strong>Eye Color</strong>: <i>${result.eye_color}</i></p>
              <p class="module-text"><strong>Homeworld</strong>: <i><a href="${result.homeworld}">${homeworld}</a></i></p>
              <p class="module-text"><strong>Species</strong>: <i><a href="${result.species}">${species}</a></i></p>
            `;
          } catch (err) {
            console.log(err);
          }
        })();
      }
    });
  }
});

overlay.addEventListener("click", () => {
  overlay.classList.add("hidden");
  module.classList.add("hidden");
});
