import { beginRequest, endRequest } from './notification.js';
import API from './api.js';

const endpoints = {
  COLLECTION: 'data/articles',
};

const api = new API(
  'D004A31B-2761-33E6-FF63-988A10D5C600',
  '2CF7DF12-0924-45FA-B1DB-6F1605F2255E',
  beginRequest,
  endRequest
);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

export async function getAllEntities() {
  return api.get(endpoints.COLLECTION);
}

export async function createEntity(entity) {
  return api.post(endpoints.COLLECTION, entity);
}

export async function getEntityById(id) {
  return api.get(`${endpoints.COLLECTION}/${id}`);
}

export async function editEntity(id, entity) {
  return api.put(`${endpoints.COLLECTION}/${id}`, entity);
}

export async function deleteEntity(id) {
  return api.delete(`${endpoints.COLLECTION}/${id}`);
}

export async function collectEntity(entity, userEmail) {
  const id = entity.objectId;
  entity.peoplesGetThisItem.push(userEmail);
  entity.volume = entity.peoplesGetThisItem.length + 1;

  return editEntity(id, entity);
}

export function checkResult(result) {
  if (result.hasOwnProperty('errorData')) {
    const error = new Error();
    Object.assign(error, result);
    throw error;
  }
}
