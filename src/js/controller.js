import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import todaysView from './views/todaysRecipeView.js';
import { MODAL_CLOSE_SEC, QUERYS } from './config.js';

// import corejs and regenerator-runtime
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Fraction } from 'fractional';
import { random } from 'core-js/core/number';

if (module.hot) {
  module.hot.accept();
}

//////////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // Update resultsView and bookmarksView to mark selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    await recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search query
    await model.loadSearchResults(query);

    // 3) render search results
    await resultsView.render(model.getSearchResultsPage(1));

    // 4) Render initial pagination  buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPages = function (goToPage) {
  // 3) render NEW search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW initial pagination  buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe;
    recipeView.render(model.state.recipe);

    // render success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change url id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err);
  }
};

const controlTodaysRecipe = async function () {
  try {
    todaysView.renderSpinner();

    const query = QUERYS[Math.floor(Math.random() * QUERYS.length)];
    if (!query) return;

    // 1) load todays recipe
    await model.loadTodaysRecipe(query);

    // 2) render todays recipe
    todaysView.render(model.state.todayRecipe);

    window.location.hash = model.state.todayRecipe.id;
  } catch (err) {
    todaysView.renderError();
  }
};

const controlTodaysRecipeView = async function () {
  try {
    recipeView.renderSpinner();
    const id = model.state.todayRecipe.id;

    // go to todays recipe
    await model.loadRecipe(id);
    await recipeView.render(model.state.todayRecipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const init = function () {
  window.location.hash = '';

  todaysView.addHandlerRender(controlTodaysRecipe);
  todaysView.addHandlerClick(controlTodaysRecipeView);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBoookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPages);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
