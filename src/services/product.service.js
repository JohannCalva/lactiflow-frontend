import api from '../api/axios';

const getAll = () => {
  return api.get('/product');
};

const create = (data) => {
  return api.post('/product', data);
};

const update = (id, data) => {
  return api.put(`/product/${id}`, data);
};

const remove = (id) => {
  return api.delete(`/product/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove
};
