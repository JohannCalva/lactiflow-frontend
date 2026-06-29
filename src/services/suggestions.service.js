import api from "../api/axios";

const get = (date) => api.get("/suggestions", { params: { date } });

const summary = (date) => api.get("/suggestions/summary", { params: { date } });

const generate = () => api.post("/suggestions/generate");

export default {
  get,
  summary,
  generate,
};
