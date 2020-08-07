import {
  getAll,
  createRecipe,
  checkResult,
  getRecipeById,
  editRecipe,
  likeRecipe,
  deleteRecipe as apiDelete,
} from '../data.js';
import { showInfo, showError } from '../notification.js';

export default async function home() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    catalog: await this.load('./templates/catalog/catalog.hbs'),
    recipe: await this.load('./templates/catalog/recipe.hbs'),
  };

  const context = Object.assign({}, this.app.userData);
  if (this.app.userData.username) {
    const recipes = await getAll();
    context.recipes = recipes;
  }

  this.partial('./templates/home.hbs', context);
}

export async function createPage() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  this.partial('./templates/catalog/create.hbs', this.app.userData);
}

export async function editPage() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  const recipe = await getRecipeById(this.params.id);
  recipe.ingredients = recipe.ingredients.join(', ');
  const context = Object.assign({ recipe }, this.app.userData);

  await this.partial('./templates/catalog/edit.hbs', context);

  document.querySelectorAll('select[name=category]>option').forEach((x) => {
    if (x.textContent == recipe.category) {
      x.selected = true;
    }
  });
}

export async function detailsPage() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  const id = this.params.id;
  const recipe = await getRecipeById(id);
  const context = Object.assign({ recipe }, this.app.userData);
  if (recipe.ownerId === this.app.userData.userId) {
    recipe.canEdit = true;
  }

  await this.partial('./templates/catalog/details.hbs', context);

  const likeBtn = document.querySelector('#likeBtn');
  likeBtn.addEventListener('click', async (x) => {
    x.preventDefault();
    try {
      const result = await likeRecipe(id);
      checkResult(result);
      likeBtn.textContent = `${result.likes} likes`;
      showInfo('You liked that recipe.');
    } catch (x) {
      showError(x.message);
    }
  });
}

export async function like() {
  const id = this.params.id;
  try {
    const result = await likeRecipe(id);
    checkResult(result);
    showInfo('You liked that recipe.');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function deleteRecipe() {
  const id = this.params.id;
  try {
    const result = await apiDelete(id);
    checkResult(result);
    showInfo('Your recipe was archived.');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function createPost() {
  const recipe = {
    meal: this.params.meal,
    ingredients: this.params.ingredients.split(',').map((x) => x.trim()),
    prepMethod: this.params.prepMethod,
    description: this.params.description,
    foodImageURL: this.params.foodImageURL,
    category: this.params.category,
    likes: 0,
    categoryImageURL:
      'https://i2.wp.com/butterwithasideofbread.com/wp-content/uploads/2012/07/Easiest-Best-Homemade-Bread.BSB_.IMG_6014.jpg?ssl=1',
  };
  try {
    if (recipe.meal.length < 4) {
      throw new Error('Meal name mast be at least 4 characters long');
    }
    if (recipe.ingredients.length < 2) {
      throw new Error('There must be at least 2 ingredients');
    }
    if (recipe.prepMethod.length < 10) {
      throw new Error('Preparation method mast be at least 10 characters long');
    }
    if (recipe.description.length < 10) {
      throw new Error('Description name mast be at least 10 characters long');
    }
    if (
      recipe.foodImageURL.slice(0, 7) != 'http://' &&
      recipe.foodImageURL.slice(0, 8) != 'https://'
    ) {
      throw new Error('Invalid image URL');
    }
    if (recipe.category == 'Select category...') {
      throw new Error('Please select category from the list');
    }

    const result = await createRecipe(recipe);
    checkResult(result);

    showInfo('Recipe shared successfully!');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}

export async function editPost() {
  const id = this.params.id;
  const recipe = await getRecipeById(id);

  recipe.meal = this.params.meal;
  recipe.ingredients = this.params.ingredients.split(',').map((x) => x.trim());
  recipe.prepMethod = this.params.prepMethod;
  recipe.description = this.params.description;
  recipe.foodImageURL = this.params.foodImageURL;
  recipe.category = this.params.category;

  try {
    if (recipe.meal.length < 4) {
      throw new Error('Meal name mast be at least 4 characters long');
    }
    if (recipe.ingredients.length < 2) {
      throw new Error('There must be at least 2 ingredients');
    }
    if (recipe.prepMethod.length < 10) {
      throw new Error('Preparation method mast be at least 10 characters long');
    }
    if (recipe.description.length < 10) {
      throw new Error('Description name mast be at least 10 characters long');
    }
    if (
      recipe.foodImageURL.slice(0, 7) != 'http://' &&
      recipe.foodImageURL.slice(0, 8) != 'https://'
    ) {
      throw new Error('Invalid image URL');
    }
    if (recipe.category == 'Select category...') {
      throw new Error('Please select category from the list');
    }

    const result = await editRecipe(id, recipe);
    checkResult(result);

    showInfo('Recipe edited successfully!');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}
