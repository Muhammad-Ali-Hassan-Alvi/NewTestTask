// The API's base URL from your environment variables or the provided ngrok URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://chary-unarrogant-annamaria.ngrok-free.dev";

// Helper function to get the authentication token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// A centralized helper for making API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      Accept: "application/json",
      // --- THIS IS THE FIX ---
      // Add the ngrok header to ALL requests made through this function
      "ngrok-skip-browser-warning": "true",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // IMPORTANT: Do NOT set Content-Type for FormData.
    // The browser sets it automatically with the correct boundary.
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
      return { data: null, error: "Unauthorized. Please log in again." };
    }

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
      const errorMessage =
        errorData.message ||
        JSON.stringify(errorData.errors) ||
        "An unknown error occurred.";
      return { data: null, error: errorMessage };
    }

    if (response.status === 204) {
      // Handle successful No Content responses (like DELETE)
      return { data: { success: true }, error: null };
    }

    const responseData = await response.json();
    return { data: responseData.data || responseData, error: null };
  } catch (error) {
    return { data: null, error: error.message || "A network error occurred." };
  }
};

export const api = {
  // These GET endpoints are standard
  getTasks: () => apiRequest("/api/tasks"),
  getProjects: () => apiRequest("/api/projects"),

  // CREATE uses a custom endpoint and FormData
  createTask: (taskData) => {
    const formData = new FormData();
    formData.append("title", taskData.title);
    formData.append("description", taskData.description || "");
    formData.append("project_id", taskData.projectId);
    formData.append("due_date", taskData.dueDate);
    // Backend expects status as: "todo" | "in-progress" | "done"
    formData.append("status", taskData.status);

    // Handle tags array as per Postman collection `tags[0]`, `tags[1]`
    if (taskData.tagIds && Array.isArray(taskData.tagIds)) {
      taskData.tagIds.forEach((tagId, index) => {
        formData.append(`tags[${index}]`, tagId);
      });
    }

    return apiRequest("/api/add-tasks", {
      method: "POST",
      body: formData,
    });
  },

  // UPDATE uses a custom endpoint and JSON
  updateTask: (taskId, taskData) => {
    const payload = {
      title: taskData.title,
      description: taskData.description,
      project_id: taskData.projectId,
      due_date: taskData.dueDate,
      // Send status exactly as selected: "todo" | "in-progress" | "done"
      status: taskData.status,
      tags: taskData.tagIds, // Laravel can often handle 'tags' as an array in JSON
    };
    return apiRequest(`/api/update-tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // DELETE uses a custom endpoint
  deleteTask: (taskId) => {
    return apiRequest(`/api/delete-tasks/${taskId}`, {
      method: "DELETE",
    });
  },
};
