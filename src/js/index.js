import axios from 'axios';

async function getResult(query) {
  try {
    const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
    const recipe = res.data.recipes;
    console.log(recipe);
  } catch (error) {
    alert(error);
  }
}

getResult('pizza');
