const API_KEY = "f3e43c9e4e82d85a24170e837345bbec";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
    language: "es",
  },
});

//Utils

function createMovie(container, movies) {
  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(container, categories) {
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");

    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryTitle.setAttribute("id", `id${category.id}`);
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

//Llamados a la api

async function getTrendingMoviePreview() {
  const respuesta = await api(`trending/movie/day`);

  const movies = respuesta.data.results;

  createMovie(trendingMoviesPreviewList, movies);
}

async function getCategoriesPreview() {
  const respuesta = await api("genre/movie/list");

  const categories = respuesta.data.genres;

  createCategories(categoriesPreviewSection, categories);
}

async function getMoviesByCategory(id) {
  const respuesta = await api(`/discover/movie`, {
    params: {
      with_genres: id,
    },
  });

  const moviesGeneric = respuesta.data.results;

  createMovie(genericSection, moviesGeneric);
}

async function getMoviesBySearch(query) {
  const respuesta = await api(`search/movie`, {
    params: {
      query,
    },
  });

  const searchMovie = respuesta.data.results;

  createMovie(genericSection, searchMovie);
}

async function getTrendingMoviesPreview() {
  const { data } = await api("/trending/movie/day");

  const trendingMovies = data.results;

  createMovie(genericSection, trendingMovies);
}

async function getMovieById(id) {
  const { data: movie } = await api(`movie/${id}`);
  const movieImg = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

  headerSection.style.background = `url(${movieImg})`;
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movieDetailCategoriesList, movie.genres);
  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);

  const relatedMovies = data.results;

  createMovie(relatedMoviesContainer, relatedMovies);
}