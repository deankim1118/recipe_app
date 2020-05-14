import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/** Global state of the app
 * - Search object
 * - Curret recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async (e) => {
  e.preventDefault();
  //1. Get query from the view

  // const query = searchView.getInput();
  // For Test
  const query = 'pizza';

  if (query) {
    //2. New search object and add to state
    state.search = new Search(query);
    //3. Prepare UI for result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);

    try {
      //4. Get the recipes
      await state.search.getResults();
      //5. Render results on UI
      clearLoader();
      searchView.rederResults(state.search.result);
    } catch (err) {
      alert(`We can't search now, Sorry`);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', controlSearch);
//For Test
window.addEventListener('load', controlSearch);

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.rederResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare the UI
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // Highlight Selected search item
    searchView.highlightSelected(id);
    // Create new Recipe constructor
    state.recipe = new Recipe(id);

    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredient();
      // Calculte time and Servings
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render the data UI
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert(`We can't get the recipe, Sorry`);
    }
  }
};

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));
