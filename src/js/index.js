import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likesView from './views/likesView';

/** Global state of the app
 * - Search object
 * - Curret recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async (e) => {
  e.preventDefault();
  //1. Get query from the view

  // const query = searchView.getInput();
  //For Test
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
    //searchView.highlightSelected(id);
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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert(`We can't get the recipe, Sorry`);
    }
  }
};

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));

/**
 * List CONTROLLER
 */

// When click the Shopping List
const controlList = () => {
  // Create list
  if (!state.list) state.list = new List();
  listView.clearList();
  // Add the ingredient item to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Delete the Shopping item
const deleteList = (event) => {
  const id = event.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (event.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
    // Handle the count update
  } else if (event.target.matches('.shopping__count-value')) {
    if (event.target.value > 0) {
      const val = parseFloat(event.target.value, 10);
      state.list.updateCount(id, val);
      console.log(state.list);
    }
  }
};

/**
 * LIKES CONTROLLER
 */

const controlLike = () => {
  // Create new Likes in the Global state Object
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //* User has NOT yet liked current recipt
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state.likes
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add like from UI list
    likesView.renderLike(newLike);
  }
  //* User HAS liked current recipt
  else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// When recipe serving button clicks
elements.recipe.addEventListener('click', (event) => {
  // Serving button decrease
  if (event.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    // Serving button increase
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (event.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});

elements.shopping.addEventListener('click', deleteList);

window.l = new List();
