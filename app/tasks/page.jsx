"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import TaskCard from "../components/TaskCard"
import Sidebar from "../components/Sidebar"
import FilterBar from "../components/FilterBar"
import TaskForm from "../components/TaskForm"
import { api } from "../lib/api"
import { filterTasks, sortTasksByDueDate } from "../lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [filters, setFilters] = useState({ projectId: null, tagIds: null, status: null, dateRange: null })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) router.push("/login")
  }, [router])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const [tasksRes, projectsRes] = await Promise.all([api.getTasks(), api.getProjects()])
      if (tasksRes.error || projectsRes.error) {
        toast({ title: "Error", description: tasksRes.error || projectsRes.error, variant: "destructive" })
      } else {
        setTasks(tasksRes.data)
        setProjects(projectsRes.data)
        const allTags = new Set()
        tasksRes.data.forEach((task) => {
          const tagIds = Array.isArray(task.tagIds) ? task.tagIds : Array.isArray(task.tags) ? task.tags.map((t) => t.id) : []
          tagIds.forEach((id) => allTags.add(JSON.stringify({ id })))
        })
        setTags(Array.from(allTags).map((s) => JSON.parse(s)))
      }
      setLoading(false)
    })()
  }, [])

  const handleCreateTask = async (taskData) => {
    setFormLoading(true)
    const { data, error } = await api.createTask(taskData)
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
    } else {
      setTasks((prev) => [...prev, data])
      setFormOpen(false)
      toast({ title: "Success", description: "Task created successfully!" })
    }
    setFormLoading(false)
  }

  const handleUpdateTask = async (taskData) => {
    setFormLoading(true)
    const { data, error } = await api.updateTask(editingTask.id, taskData)
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
    } else {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data : t)))
      setFormOpen(false)
      setEditingTask(null)
      toast({ title: "Success", description: "Task updated successfully!" })
    }
    setFormLoading(false)
  }

  const handleDeleteTask = async (taskId) => {
    const { error } = await api.deleteTask(taskId)
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      toast({ title: "Success", description: "Task deleted successfully!" })
    }
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

  const filtered = sortTasksByDueDate(filterTasks(tasks, filters))
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => (t.status || "").includes("progress")).length,
    completed: tasks.filter((t) => (t.status || "").includes("done")).length,
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
      <Sidebar stats={stats} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Tasks</h2>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" /> New Task
            </Button>
          </div>
          <div className="mb-6">
            <FilterBar
              filters={filters}
              projects={projects}
              tags={tags}
              onFilterChange={(nf) => setFilters((p) => ({ ...p, ...nf }))}
              onClearFilters={() => setFilters({ projectId: null, tagIds: null, status: null, dateRange: null })}
            />
          </div>
          <div className="grid gap-4">
            {filtered.map((task) => {
              const project = projects.find((p) => p.id === (task.project_id || task.projectId))
              return (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
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
            })}
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


