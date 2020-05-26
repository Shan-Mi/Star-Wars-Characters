const rootURL = "https://swapi.dev/api/people/?page=";
const totalPage = 9;
const searchBtn = document.querySelector("button");
const charactersArea = document.querySelector(".characters-wrapper");
const searchTermArea = document.querySelector("#searchTerm");
let id = 0;
let characters,
  i = 1,
  charactersJson,
  results = [];

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
      console.log("dead end");
      isThisEnd = true;
    }
  } catch (err) {
    console.log(err);
  }

  console.log(i);
  if (isThisEnd) {
    drawCharacterArea(results);
  }
};
getCharacters();
console.log(results);

function drawCharacterArea(results) {
  results.forEach((result) => {
    generateCharatersPanel(result);
  });
  searchBtn.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();

    const searchResults = results.filter((result) =>
      result.name.toLowerCase().includes(searchString)
    );
    showSelectCharactor(searchResults);
  });
  // searchBtn.onclick = showSelectCharactor;

  function showSelectCharactor(e) {
    e.preventDefault();
    let id = 0;
    charactersArea.innerHTML = "";
    // let searchKeyWords = searchTermArea.value.toLowerCase();
    // const searchResults = results.filter((result) => {
    //   result.name.toLowerCase().includes(searchKeyWords);
    // });
    drawCharacterArea(searchResults);
  }
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

function generateCharatersPanel(character) {
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
        hrefLink = "https://en.wikipedia.org/wiki/Star_Wars:_The_Force_Awakens";
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

  charactersArea.innerHTML += `
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
  id++;
}
