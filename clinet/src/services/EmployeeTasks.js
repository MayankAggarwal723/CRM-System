import api from "../api/axios";

export const getMyTasksData = async (params = {}) => {
  const response = await api.get("/employee/EmployeeTasks", { params });
  return response.data;
};

export const updateTask = async (taskId, data) => {
  const response = await api.put(`/employee/tasks/${taskId}`, data);
  return response.data;
};