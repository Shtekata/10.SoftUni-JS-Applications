import { beginRequest, endRequest, showError } from './notification.js';
import API from './api.js';

const endpoints = {
  RECEPES: 'data/recipes',
  RECEPES_BY_ID: 'data/recipes/',
};

const api = new API(
  '369580DB-FF6E-ACA9-FF17-59804B677A00',
  '2FC3B6AF-54C8-4984-9020-2EFFF999E983',
  beginRequest,
  endRequest
);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

export async function getAll() {
  return api.get(endpoints.RECEPES);
}

export async function createRecipe(recipe) {
  return api.post(endpoints.RECEPES, recipe);
}

export async function getRecipeById(id) {
  return api.get(`${endpoints.RECEPES_BY_ID}${id}`);
}

export async function editRecipe(id, recipe) {
  return api.put(`${endpoints.RECEPES_BY_ID}${id}`, recipe);
}

export async function deleteRecipe(id) {
  return api.delete(`${endpoints.RECEPES_BY_ID}${id}`);
}

export async function likeRecipe(id) {
  const recipe = await getRecipeById(id);
  return editRecipe(id, { likes: recipe.likes + 1 });
}

export function checkResult(result) {
  if (result.hasOwnProperty('errorData')) {
    const error = new Error();
    Object.assign(error, result);
    throw error;
  }
}