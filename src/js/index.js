import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

/** Global state of the app
 * - Search object
 * - Curret recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async (e) => {
  e.preventDefault();
  //1. Get query from the view

  const query = searchView.getInput();

  if (query) {
    //2. New search object and add to state
    state.search = new Search(query);

    //3. Prepare UI for result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);
    //4. Get the recipes
    await state.search.getResults();
    //5. Render results on UI
    clearLoader();
    searchView.rederResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', controlSearch);

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.rederResults(state.search.result, goToPage);
  }
});
