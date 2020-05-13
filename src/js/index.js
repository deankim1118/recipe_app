import Search from './models/Search';
import { elements } from './views/base';
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
    //4. Get the recipes
    await state.search.getResults();
    //5. Render results on UI
    searchView.rederResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', controlSearch);
