import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Sort tasks by due date (upcoming first)
export function sortTasksByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)
    return dateA - dateB
  })
}

// Filter tasks based on criteria
export function filterTasks(tasks, filters) {
  return tasks.filter((task) => {
    // Filter by project
    if (filters.projectId && task.projectId !== filters.projectId) {
      return false
    }

    // Filter by tags (support either task.tagIds or task.tags: [{id}])
    if (filters.tagIds && filters.tagIds.length > 0) {
      const taskTagIds = Array.isArray(task.tagIds)
        ? task.tagIds
        : Array.isArray(task.tags)
        ? task.tags.map((t) => t.id)
        : []
      const hasTag = filters.tagIds.some((tagId) => taskTagIds.includes(tagId))
      if (!hasTag) return false
    }

    // Filter by status
    if (filters.status && task.status !== filters.status) {
      return false
    }

    // Filter by date range
    if (filters.dateRange) {
      const taskDate = new Date(task.dueDate || task.due_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      switch (filters.dateRange) {
        case "today":
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          if (taskDate < today || taskDate >= tomorrow) return false
          break
        case "week":
          const nextWeek = new Date(today)
          nextWeek.setDate(nextWeek.getDate() + 7)
          if (taskDate < today || taskDate >= nextWeek) return false
          break
        case "overdue":
          if (taskDate >= today) return false
          break
      }
    }

    return true
  })
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else if (date < today) {
    return `${Math.ceil((today - date) / (1000 * 60 * 60 * 24))} days overdue`
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }
}

// Check if task is overdue
export function isOverdue(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}
