const rootURL = 'https://swapi.dev/api/people/?page=';
const totalPage = 9;
let id = 0;

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
  const charactersArea = document.querySelector('.characters-wrapper');
  const searchTermArea = document.querySelector('#searchTerm');
  const searchBtn = document.querySelector('button');

  results.forEach(result => {
    let films = '';
    let hrefLink;
    result.films.map(film => {
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
    charactersArea.innerHTML += `
      <div data-id="${id}" class="character">
        <div class="name-container">
          <a class='showInfo'><p class="name" data-id="${id}">${result.name}</p></a>
        </div>
        <div class="info-container hidden" data-info="${id}">
          ${films}
        </div>
      </div>
      `
    id++;
  })
  searchBtn.onclick = showSelectCharactor;

  function showSelectCharactor(e) {
    e.preventDefault();
    charactersArea.innerHTML = '';
    let searchKeyWords = searchTermArea.value;
    let searchResults = [];
    results.filter(result => {
      if (result.name.toLowerCase().includes(searchKeyWords))
        searchResults.push(result)
    })
    if (!searchResults) {
      charactersArea.innerHTML = '';
      return;
    }
    searchResults.forEach(searchResult => {
      charactersArea.innerHTML += `
          <div class="character">
            <p class="name">${searchResult.name}</p>
            <a href="#">${searchResult.films}</a>
          </div>
        `
    })
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