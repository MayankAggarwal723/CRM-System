import api from "../api/axios";

export const getEmployeeTasks = async () => {
  const response = await api.get("/employee/EmployeeTasks");
  return response.data;
};