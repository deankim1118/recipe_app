import Search from './models/Search';

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
  const query = 'pizza';

  if (query) {
    //2. New search object and add to state
    state.search = new Search(query);

    //3. Prepare UI for result
    //4. Get the recipes
    await state.search.getResults();
    //5. Render results on UI
    console.log(state.search.result);
  }
};

document.querySelector('.search').addEventListener('submit', controlSearch);
