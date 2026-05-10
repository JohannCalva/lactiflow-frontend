import api from '../api/axios';

const getAll = () => {
  return api.get('/business_type');
};

const create = (data) => {
  return api.post('/business_type', data);
};

const update = (id, data) => {
  return api.put(`/business_type/${id}`, data);
};

const remove = (id) => {
  return api.delete(`/business_type/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove
};
