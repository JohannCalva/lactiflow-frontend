import api from '../api/axios';

const getAll = () => {
  return api.get('/user');
};

const create = (data) => {
  return api.post('/user', data);
};

const update = (id, data) => {
  return api.put(`/user/${id}`, data);
};

const remove = (id) => {
  return api.delete(`/user/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove
};
