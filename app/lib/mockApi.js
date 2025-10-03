// Mock data for tasks, projects, and tags
export const mockProjects = [
  { id: 1, name: "Website Redesign", color: "#8B5CF6" },
  { id: 2, name: "Mobile App", color: "#3B82F6" },
  { id: 3, name: "Marketing Campaign", color: "#10B981" },
  { id: 4, name: "Backend API", color: "#F59E0B" },
]

export const mockTags = [
  { id: 1, name: "urgent", color: "#EF4444" },
  { id: 2, name: "design", color: "#8B5CF6" },
  { id: 3, name: "development", color: "#3B82F6" },
  { id: 4, name: "review", color: "#F59E0B" },
  { id: 5, name: "bug", color: "#EF4444" },
  { id: 6, name: "feature", color: "#10B981" },
]

export const mockTasks = [
  {
    id: 1,
    title: "Design homepage mockup",
    description: "Create high-fidelity mockups for the new homepage design",
    projectId: 1,
    tagIds: [2, 6],
    dueDate: "2025-02-15",
    status: "in-progress",
    createdAt: "2025-02-01",
  },
  {
    id: 2,
    title: "Fix login authentication bug",
    description: "Users are unable to login with Google OAuth",
    projectId: 2,
    tagIds: [1, 5, 3],
    dueDate: "2025-02-12",
    status: "todo",
    createdAt: "2025-02-02",
  },
  {
    id: 3,
    title: "Write API documentation",
    description: "Document all REST endpoints for the backend API",
    projectId: 4,
    tagIds: [3],
    dueDate: "2025-02-20",
    status: "todo",
    createdAt: "2025-01-28",
  },
  {
    id: 4,
    title: "Review marketing materials",
    description: "Review and approve Q1 marketing campaign materials",
    projectId: 3,
    tagIds: [4],
    dueDate: "2025-02-10",
    status: "todo",
    createdAt: "2025-02-03",
  },
  {
    id: 5,
    title: "Implement user profile page",
    description: "Build the user profile page with edit functionality",
    projectId: 2,
    tagIds: [3, 6],
    dueDate: "2025-02-18",
    status: "todo",
    createdAt: "2025-02-01",
  },
  {
    id: 6,
    title: "Setup CI/CD pipeline",
    description: "Configure automated testing and deployment",
    projectId: 4,
    tagIds: [3],
    dueDate: "2025-02-08",
    status: "done",
    createdAt: "2025-01-25",
  },
]

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API functions
export const api = {
  // Get all projects
  getProjects: async () => {
    await delay(300)
    return { data: mockProjects, error: null }
  },

  // Get all tasks
  getTasks: async () => {
    await delay(400)
    return { data: mockTasks, error: null }
  },

  // Get all tags
  getTags: async () => {
    await delay(200)
    return { data: mockTags, error: null }
  },

  // Create a new task
  createTask: async (taskData) => {
    await delay(500)
    const newTask = {
      id: Math.max(...mockTasks.map((t) => t.id)) + 1,
      ...taskData,
      createdAt: new Date().toISOString().split("T")[0],
    }
    mockTasks.push(newTask)
    return { data: newTask, error: null }
  },

  // Update a task
  updateTask: async (id, updates) => {
    await delay(500)
    const taskIndex = mockTasks.findIndex((t) => t.id === id)
    if (taskIndex === -1) {
      return { data: null, error: "Task not found" }
    }
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates }
    return { data: mockTasks[taskIndex], error: null }
  },

  // Delete a task
  deleteTask: async (id) => {
    await delay(400)
    const taskIndex = mockTasks.findIndex((t) => t.id === id)
    if (taskIndex === -1) {
      return { data: null, error: "Task not found" }
    }
    mockTasks.splice(taskIndex, 1)
    return { data: { id }, error: null }
  },
}
