import { beginRequest, endRequest } from './notification.js';
import API from './api.js';

const endpoints = {
  COLLECTION: 'data/shoes',
};

const api = new API(
  '572C10CF-3211-B056-FF0F-99CD4E246300',
  '8DF49870-F356-4B05-BD8F-1708B309E51D',
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

export async function collectEntity(id, userEmail) {
  const entity = await getEntityById(id);
  const peoplesGetThisItem = entity.peoplesGetThisItem.join(', ');
  if (peoplesGetThisItem.includes(userEmail)) return;

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
