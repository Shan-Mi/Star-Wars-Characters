const rootURL = 'https://swapi.dev/api/people/?page=';
const totalPage = 9;
const searchBtn = document.querySelector('button');
const charactersArea = document.querySelector('.characters-wrapper');
const searchTermArea = document.querySelector('#searchTerm');
let id = 0;
let results = [];

for (let i = 1; i <= totalPage; i++) {
  fetch(`${rootURL}${i}`)
    .then(response => response.json())
    .then(json => {
      let characters = json.results;
      drawCharacterArea(characters);
    })
    .catch(err => console.log('Fetch problem: ' + err.message));
}

function drawCharacterArea(results) {
  results.forEach(result => {
    generateCharatersPanel(result);
  })
  searchBtn.onclick = showSelectCharactor;

  function showSelectCharactor(e) {
    e.preventDefault();
    let id = 0;
    charactersArea.innerHTML = '';
    let searchKeyWords = searchTermArea.value.toLowerCase();

    for (let i = 1; i <= totalPage; i++) {
      fetch(`${rootURL}${i}`)
        .then(response => response.json())
        .then(json => {
          let characters = json.results;
          searchResults = characters.filter(item => {
            if (item.name.toLowerCase().indexOf(searchKeyWords) != -1) {
              console.log(item);
              generateCharatersPanel(item);
            }
          })
        })
        .catch(err => console.log('Fetch problem: ' + err.message));
    }
  }
}

const swPanel = document.querySelector('#sw-panel');
swPanel.addEventListener('click', (e) => {
  if (e.target.matches('p')) {
    let chosenId = e.target.dataset.id;
    document.querySelectorAll(`[data-info="${chosenId}"]`).forEach(item => {
      item.classList.toggle('hidden')
    })
  }
})

document.querySelector('.date').innerHTML = new Date();

function generateCharatersPanel(character) {
  let films = '';
  let gender;
  let hrefLink;

  character.films.map(film => {
    switch (film.slice(-2, -1)) {
      case '1':
        hrefLink = 'https://en.wikipedia.org/wiki/Star_Wars:_Episode_I_%E2%80%93_The_Phantom_Menace';
        break;
      case '2':
        hrefLink = 'https://en.wikipedia.org/wiki/Star_Wars:_Episode_II_%E2%80%93_Attack_of_the_Clones';
        break;
      case '3':
        hrefLink = 'https://en.wikipedia.org/wiki/Star_Wars:_Episode_III_%E2%80%93_Revenge_of_the_Sith';
        break;
      case '4':
        hrefLink = 'https://en.wikipedia.org/wiki/Star_Wars:_The_Force_Awakens';
        break;
      case '5':
        hrefLink = 'https://en.wikipedia.org/wiki/Star_Wars:_The_Last_Jedi';
        break;
      case '6':
        hrefLink = 'https://en.wikipedia.org/wiki/Star_Wars:_The_Rise_of_Skywalker';
        break;
    }
    return films += `<a href='${hrefLink}'>${film}</a>`
  })
  gender = character.gender.replace(/\//, '');

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
    `
  id++;
}