import api from "../api/axios";

const createCrud = (basePath) => ({
  getAll: () => api.get(basePath),
  create: (data) => api.post(basePath, data),
  update: (id, data) => api.put(`${basePath}/${id}`, data),
  remove: (id) => api.delete(`${basePath}/${id}`),
});

export default createCrud;
