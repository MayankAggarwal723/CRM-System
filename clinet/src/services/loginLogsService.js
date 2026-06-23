import api from "../api/axios";

export const getLoginLogsData = async (params = {}) => {
  const response = await api.get("/logs", { params });
  return response.data;
};