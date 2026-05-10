import api from '../api/axios';

const getAll = () => {
  return api.get('/client');
};

const create = (data) => {
  return api.post('/client', data);
};

const update = (id, data) => {
  return api.put(`/client/${id}`, data);
};

const remove = (id) => {
  return api.delete(`/client/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove
};
