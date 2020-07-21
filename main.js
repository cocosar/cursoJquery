/* Hoja JS de práctica */

// Almacenando listado de peliculas

(async function load() {
  const URL_API = "https://yts.mx/api/v2/";

  async function getData(url) {
    const response = await fetch(url, { mode: "cors" });
    const data = await response.json();
    return data;
  }

  //Listados de peliculas
  const actionList = await getData(
    `${URL_API}list_movies.json?genre=action`
  );
  const dramaList = await getData(`${URL_API}list_movies.json?genre=drama`);
  const animationList = await getData(
    `${URL_API}list_movies.json?genre=animation`
  );

  //Listado de contenedores
  const $actionContainer = document.getElementById("action");
  const $dramaContainer = document.getElementById("drama");
  const $animationContainer = document.getElementById("animation");

  // Custom Elements
  const $home = document.getElementById("home");
  const $overlay = document.getElementById("overlay");
  const $featuringContainer = document.getElementById("featuring");
  const $form = document.getElementById("form");

  // Modals
  const $modal = document.getElementById("modal");
  const $hideModal = document.getElementById("hide-modal");
  const $modalTitle = $modal.querySelector("h1");
  const $modalImg = $modal.querySelector("img");
  const $modalDesc = $modal.querySelector("p");

  //DOM
  html = document.implementation.createHTMLDocument();

  // Escribiendo template
  const movieItemTemplate = (movie) => {
    return `<div class="primaryPlaylistItem">
                <div class="primaryPlaylistItem-image">
                    <img src="${movie.medium_cover_image}">
                </div>
                <h4 class="primaryPlaylistItem-title">
                    ${movie.title}
                </h4>
            </div>
            `;
  };
  // Recorriendo listas y guardando en string el resultado
  const renderMovieList = (list, $container) => {
      $container.children[0].remove(); //Tener cuidado si el elemento no existe retornara error. Es buena practica no asegurar.
    list.data.movies.forEach((movie) => {
      const HTMLString = movieItemTemplate(movie);
      $container.innerHTML += HTMLString;
    //   container.append(html.body.children[0]); // Metodo mejorado
    });
  };

  //Rendering lists of movies
  renderMovieList(actionList, $actionContainer);
  renderMovieList(dramaList, $dramaContainer);
  renderMovieList(animationList, $animationContainer);
  
})();

// medium_cover_image
// title
