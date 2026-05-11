import api from '../api/axios';

const getAll = () => {
  return api.get('/delivery');
};

const create = (data) => {
  return api.post('/delivery', data);
};

const update = (id, data) => {
  return api.put(`/delivery/${id}`, data);
};

const remove = (id) => {
  return api.delete(`/delivery/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove
};
