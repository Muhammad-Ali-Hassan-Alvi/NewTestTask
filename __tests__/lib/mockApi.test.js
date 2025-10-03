import { api, mockProjects, mockTags } from "@/app/lib/mockApi"

describe("Mock API", () => {
  describe("getProjects", () => {
    it("should return all projects", async () => {
      const { data, error } = await api.getProjects()
      expect(error).toBeNull()
      expect(data).toEqual(mockProjects)
      expect(data.length).toBeGreaterThan(0)
    })
  })

  describe("getTasks", () => {
    it("should return all tasks", async () => {
      const { data, error } = await api.getTasks()
      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })
  })

  describe("getTags", () => {
    it("should return all tags", async () => {
      const { data, error } = await api.getTags()
      expect(error).toBeNull()
      expect(data).toEqual(mockTags)
      expect(data.length).toBeGreaterThan(0)
    })
  })

  describe("createTask", () => {
    it("should create a new task", async () => {
      const newTask = {
        title: "Test Task",
        description: "Test Description",
        projectId: 1,
        tagIds: [1, 2],
        dueDate: "2025-02-20",
        status: "todo",
      }

      const { data, error } = await api.createTask(newTask)
      expect(error).toBeNull()
      expect(data).toMatchObject(newTask)
      expect(data.id).toBeDefined()
      expect(data.createdAt).toBeDefined()
    })
  })

  describe("updateTask", () => {
    it("should update an existing task", async () => {
      const updates = { title: "Updated Title", status: "done" }
      const { data, error } = await api.updateTask(1, updates)

      expect(error).toBeNull()
      expect(data.title).toBe("Updated Title")
      expect(data.status).toBe("done")
    })

    it("should return error for non-existent task", async () => {
      const { data, error } = await api.updateTask(99999, { title: "Test" })
      expect(error).toBe("Task not found")
      expect(data).toBeNull()
    })
  })

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const taskId = 1
      const { data, error } = await api.deleteTask(taskId)

      expect(error).toBeNull()
      expect(data.id).toBe(taskId)
    })

    it("should return error for non-existent task", async () => {
      const { data, error } = await api.deleteTask(99999)
      expect(error).toBe("Task not found")
      expect(data).toBeNull()
    })
  })
})
