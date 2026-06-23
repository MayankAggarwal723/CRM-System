import api from "../api/axios";

export const getSettingsData = async (params = {}) => {
  const response = await api.get("/settings", { params });
  return response.data;
};