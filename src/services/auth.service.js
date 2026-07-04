import api from "../api/axios";

const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export default {
  login,
};
