/* Hoja JS de práctica */

// Almacenando listado de peliculas

(async function load() {
    const URL_API = "https://yts.mx/api/v2/";

    async function getData(url) {
        const response = await fetch(url, { mode: "cors" });
        const data = await response.json();
        if(data.data.movie_count > 0) {
            return data;    
        } else {
            throw new Error('No se encontró ningún resultado');
        }
    }

    //Listados de peliculas


    //Listado de contenedores

    // Custom Elements
    const $home = document.getElementById("home");
    const $featuringContainer = document.getElementById("featuring");


    //DOM

    // Escribiendo template
    const movieItemTemplate = (movie, category) => {
        return `
        <div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
        <div class="primaryPlaylistItem-image">
        <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
        ${movie.title}
        </h4>
        </div>
        `;
    };

    // DOM y Template
    const createTemplate = (HTMLString) => {
        html = document.implementation.createHTMLDocument();
        html.body.innerHTML = HTMLString;
        return html.body.children[0];
    }
    // Modals & Overlay
    const $modal = document.getElementById("modal");
    const $hideModal = document.getElementById("hide-modal");
    const $modalTitle = $modal.querySelector("h1");
    const $modalImg = $modal.querySelector("img");
    const $modalDesc = $modal.querySelector("p");
    const $overlay = document.getElementById("overlay");


    //Funcion de buscar pelicula
    const findById = (list, id) => {
        return list.find(movie => movie.id === parseInt(id, 10));
    }
    const findMovie = (id, category) => {
        switch (category) {
            case 'action':
                return findById(actionList, id);
                break;
            case 'drama':
                return findById(dramaList, id)
                break;
            case 'animation':
                return findById(animationList, id)
                break;
            default:
                console.log('not found')
                break;
        }
    }

    //Reemplazando lorem por info de la peli en el modal


    //Creando evento en JS
    const showModal = ($element) => {
        $element.addEventListener('click', () => {
            $overlay.classList.add('active');
            $modal.style.animation = 'modalIn .8s forwards';
            const id = $element.dataset.id;
            const category = $element.dataset.category;
            const data = findMovie(id, category);
            $modalTitle.textContent = data.title;
            $modalImg.setAttribute('src', data.medium_cover_image);
            $modalDesc.textContent = data.description_full;
        })
    }
    const hideModal = ($element) => {
        $element.addEventListener('click', () => {
            $overlay.classList.remove('active');
            $modal.style.animation = 'modalOut .8s forwards';
        })
    }


    hideModal($hideModal);
    //Creando evento en jQuery
    // $('element').on('click', () => {
    //     alert('click')
    // })



    // Recorriendo listas y guardando en string el resultado
    const renderMovieList = (list, $container, category) => {
        $container.children[0].remove(); //Tener cuidado si el elemento no existe retornara error. Es buena practica no asegurar.
        list.forEach((movie) => {
            const HTMLString = movieItemTemplate(movie, category);
            const movieElement = createTemplate(HTMLString);
            $container.append(movieElement);
            const image = movieElement.querySelector('img');
            image.addEventListener('load', (event) => {
                event.target.classList.add('fadeIn');
            })
            showModal(movieElement);
        });
    };
    
    const cacheExist = async (category) => {
        const listName = `${category}List`;
        const cacheList = localStorage.getItem(listName);
        
        if(cacheList){
            return JSON.parse(cacheList);
        } else {
            const { data: { movies: data } } = await getData(`${URL_API}list_movies.json?genre=${category}`);
            localStorage.setItem(listName, JSON.stringify(data))
            return data;
        }
    }
    
    const actionList = await cacheExist('action');
    const $actionContainer = document.getElementById("action");
    renderMovieList(actionList, $actionContainer, 'action');
    
    const dramaList = await cacheExist('drama');
    const $dramaContainer = document.getElementById("drama");
    renderMovieList(dramaList, $dramaContainer, 'drama');
    
    const animationList = await cacheExist('animation');
    const $animationContainer = document.getElementById("animation");
    renderMovieList(animationList, $animationContainer, 'animation');
    
    //Rendering lists of movies
    
    
    // Add event on submit
    const setAttributes = ($element, attributes) => {
        for (let atts in attributes) {
            $element.setAttribute(atts, attributes[atts]);
        }
    }

    const featuringTemplate = (peli) => {
        return (`
        <div class="featuring">
            <div class="featuring-image">
                <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
            </div>
            <div class="featuring-content">
                <p class="featuring-title">Pelicula encontrada</p>
                <p class="featuring-album">${peli.title}</p>
            </div>
        </div>
        `)
    }

    const $form = document.getElementById("form");
    $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        $home.classList.add('search-active')
        const $loader = document.createElement('img');
        setAttributes($loader, {
            src: 'src/images/loader.gif',
            height: 50,
            width: 50
        })
        $featuringContainer.append($loader);
        const data = new FormData($form);
        try {
            const { data: { movies: pelicula } } = await getData(`${URL_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
            const HTMLString = featuringTemplate(pelicula[0]);
            $featuringContainer.innerHTML = HTMLString;

        } catch(error){
            $home.classList.remove('search-active');
            $loader.remove();
            alert(error);
        };
    })

    console.log('Req finished')

})();

// medium_cover_image
// title
