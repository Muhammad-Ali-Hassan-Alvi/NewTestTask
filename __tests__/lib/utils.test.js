import { sortTasksByDueDate, filterTasks, formatDate, isOverdue } from "@/app/lib/utils"
import jest from "jest" // Declaring the jest variable

describe("Utils", () => {
  describe("sortTasksByDueDate", () => {
    it("should sort tasks by due date in ascending order", () => {
      const tasks = [
        { id: 1, dueDate: "2025-02-20" },
        { id: 2, dueDate: "2025-02-10" },
        { id: 3, dueDate: "2025-02-15" },
      ]

      const sorted = sortTasksByDueDate(tasks)

      expect(sorted[0].id).toBe(2)
      expect(sorted[1].id).toBe(3)
      expect(sorted[2].id).toBe(1)
    })

    it("should not mutate the original array", () => {
      const tasks = [
        { id: 1, dueDate: "2025-02-20" },
        { id: 2, dueDate: "2025-02-10" },
      ]

      const original = [...tasks]
      sortTasksByDueDate(tasks)

      expect(tasks).toEqual(original)
    })
  })

  describe("filterTasks", () => {
    const tasks = [
      { id: 1, projectId: 1, tagIds: [1, 2], status: "todo", dueDate: "2025-02-15" },
      { id: 2, projectId: 2, tagIds: [2, 3], status: "in-progress", dueDate: "2025-02-10" },
      { id: 3, projectId: 1, tagIds: [1], status: "done", dueDate: "2025-02-20" },
    ]

    it("should filter by project", () => {
      const filtered = filterTasks(tasks, { projectId: 1 })
      expect(filtered).toHaveLength(2)
      expect(filtered.every((t) => t.projectId === 1)).toBe(true)
    })

    it("should filter by tags", () => {
      const filtered = filterTasks(tasks, { tagIds: [1] })
      expect(filtered).toHaveLength(2)
      expect(filtered.every((t) => t.tagIds.includes(1))).toBe(true)
    })

    it("should filter by status", () => {
      const filtered = filterTasks(tasks, { status: "todo" })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].status).toBe("todo")
    })

    it("should return all tasks when no filters applied", () => {
      const filtered = filterTasks(tasks, {})
      expect(filtered).toHaveLength(3)
    })

    it("should apply multiple filters", () => {
      const filtered = filterTasks(tasks, { projectId: 1, status: "todo" })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe(1)
    })
  })

  describe("formatDate", () => {
    beforeEach(() => {
      // Mock current date to 2025-02-10
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2025-02-10"))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return "Today" for today\'s date', () => {
      expect(formatDate("2025-02-10")).toBe("Today")
    })

    it('should return "Tomorrow" for tomorrow\'s date', () => {
      expect(formatDate("2025-02-11")).toBe("Tomorrow")
    })

    it('should return "Yesterday" for yesterday\'s date', () => {
      expect(formatDate("2025-02-09")).toBe("Yesterday")
    })

    it("should return days overdue for past dates", () => {
      expect(formatDate("2025-02-08")).toBe("2 days overdue")
    })

    it("should return formatted date for future dates", () => {
      const result = formatDate("2025-02-15")
      expect(result).toContain("Feb")
      expect(result).toContain("15")
    })
  })

  describe("isOverdue", () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2025-02-10"))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it("should return true for past dates", () => {
      expect(isOverdue("2025-02-09")).toBe(true)
    })

    it("should return false for today", () => {
      expect(isOverdue("2025-02-10")).toBe(false)
    })

    it("should return false for future dates", () => {
      expect(isOverdue("2025-02-11")).toBe(false)
    })
  })
})
