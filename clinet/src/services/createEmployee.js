import api from "../api/axios";

export const getCreateEmployeeData = async (params = {}) => {
  const response = await api.get("/CreateEmployee", { params });
  return response.data;
};