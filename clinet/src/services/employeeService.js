// src/services/employeeService.js

export const getEmployees = async (params) => {
  const query = new URLSearchParams(params);

  const response = await fetch(
    `http://localhost:5000/api/admin/employees?${query}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json();
};