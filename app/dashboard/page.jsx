"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TaskCard from "../components/TaskCard"
import TaskForm from "../components/TaskForm"
import FilterBar from "../components/FilterBar"
import Sidebar from "../components/Sidebar"
import { api } from "../lib/api"
import { sortTasksByDueDate, filterTasks } from "../lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [filters, setFilters] = useState({
    projectId: null,
    tagIds: null,
    status: null,
    dateRange: null,
  })
  const { toast } = useToast()
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [tasksRes, projectsRes] = await Promise.all([api.getTasks(), api.getProjects()])

      if (tasksRes.error || projectsRes.error) {
        throw new Error("Failed to load data")
      }

      setTasks(tasksRes.data)
      setProjects(projectsRes.data)

      // Extract unique tags from tasks
      const allTags = new Set()
      tasksRes.data.forEach((task) => {
        if (task.tags && Array.isArray(task.tags)) {
          task.tags.forEach((tag) => allTags.add(JSON.stringify(tag)))
        }
      })
      setTags(Array.from(allTags).map((tag) => JSON.parse(tag)))
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData) => {
    setFormLoading(true)
    try {
      const { data, error } = await api.createTask(taskData)
      if (error) throw new Error(error)

      setTasks((prev) => [...prev, data])
      setFormOpen(false)
      toast({
        title: "Success",
        description: "Task created successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTask = async (taskData) => {
    setFormLoading(true)
    try {
      const { data, error } = await api.updateTask(editingTask.id, taskData)
      if (error) throw new Error(error)

      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data : t)))
      setFormOpen(false)
      setEditingTask(null)
      toast({
        title: "Success",
        description: "Task updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await api.deleteTask(taskId)
      if (error) throw new Error(error)

      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({
      projectId: null,
      tagIds: null,
      status: null,
      dateRange: null,
    })
  }

  const openCreateForm = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEditForm = (task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTask(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    router.push("/login")
  }

  // Apply filters and sorting
  const filteredTasks = filterTasks(tasks, filters)
  const sortedTasks = sortTasksByDueDate(filteredTasks)

  // Calculate stats
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "in-progress" || t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "done" || t.status === "completed").length,
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar stats={stats} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Tasks</h2>
              <p className="text-muted-foreground mt-1">
                {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"} found
              </p>
            </div>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          <div className="mb-6">
            <FilterBar
              filters={filters}
              projects={projects}
              tags={tags}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="grid gap-4">
            {sortedTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
              </div>
            ) : (
              sortedTasks.map((task) => {
                const project = projects.find((p) => p.id === (task.project_id || task.projectId))
                return (
                  <TaskCard
                    key={task.id}
                    task={{
                      ...task,
                      // Normalize fields for UI rendering
                      projectId: task.project_id || task.projectId,
                      dueDate: task.due_date || task.dueDate,
                      status: (task.status || "").replace("_", "-"),
                      tagIds: Array.isArray(task.tagIds)
                        ? task.tagIds
                        : Array.isArray(task.tags)
                        ? task.tags.map((t) => t.id)
                        : [],
                    }}
                    project={project}
                    tags={tags}
                    onEdit={openEditForm}
                    onDelete={handleDeleteTask}
                  />
                )
              })
            )}
          </div>
        </div>
      </main>

      <TaskForm
        open={formOpen}
        onClose={closeForm}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projects={projects}
        tags={tags}
        isLoading={formLoading}
      />

      <Toaster />
    </div>
  )
}
