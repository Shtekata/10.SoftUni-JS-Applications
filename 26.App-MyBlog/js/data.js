import API from './api.js';
import { beginRequest, endRequest } from './notification.js';

const endpoints = {
  POSTS: 'data/posts',
  POSTS_BY_ID: 'data/posts/',
};

const api = new API(
  '1251986A-9A39-747C-FF7E-34A202FDE900',
  'F9E50D55-251B-47B0-A1D4-B690571BA2E4',
  beginRequest,
  endRequest
);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

export async function getAll() {
  return api.get(endpoints.POSTS);
}

export async function createPost(post) {
  return api.post(endpoints.POSTS, post);
}

export async function getPostById(id) {
  return api.get(`${endpoints.POSTS_BY_ID}${id}`);
}

export async function editPost(id, post) {
  return api.put(`${endpoints.POSTS_BY_ID}${id}`, post);
}

export async function deletePost(id) {
  return api.delete(`${endpoints.POSTS_BY_ID}${id}`);
}

export async function likePost(id) {
  const post = await getPostById(id);
  post.likes = post.likes + 1;
  return editPost(id, post);
}

export function checkResult(result) {
  if (result.hasOwnProperty('errorData')) {
    const error = new Error();
    Object.assign(error, result);
    throw error;
  }
}
