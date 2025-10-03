"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input as TextInput } from "@/components/ui/input"

export default function TaskForm({ open, onClose, onSubmit, task, projects, tags, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    tagIds: [],
    dueDate: "",
    status: "todo",
  })

  useEffect(() => {
    if (task) {
      const taskProjectId = task.project_id || task.projectId
      const taskTagIds = task.tags ? task.tags.map((tag) => tag.id) : task.tagIds || []
      const taskDueDate = task.due_date || task.dueDate
      const taskStatus = task.status?.replace("_", "-") || "todo"

      setFormData({
        title: task.title,
        description: task.description || "",
        projectId: taskProjectId?.toString() || "",
        tagIds: taskTagIds,
        dueDate: taskDueDate,
        status: taskStatus,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        projectId: "",
        tagIds: [],
        dueDate: "",
        status: "todo",
      })
    }
  }, [task, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      projectId: Number.parseInt(formData.projectId),
    })
  }

  const toggleTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId) ? prev.tagIds.filter((id) => id !== tagId) : [...prev.tagIds, tagId],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update the task details below." : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, projectId: value }))}
                required
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <TextInput
                placeholder="Add tag ID and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    const value = Number.parseInt(e.currentTarget.value)
                    if (!Number.isNaN(value)) {
                      toggleTag(value)
                      e.currentTarget.value = ""
                    }
                  }
                }}
              />
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = formData.tagIds.includes(tag.id)
                  return (
                    <Badge
                      key={tag.id}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      style={isSelected ? { backgroundColor: tag.color } : { borderColor: tag.color, color: tag.color }}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  )
                })}
              </div>
            )}
            {formData.tagIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tagIds
                  .filter((id) => !tags?.some((t) => t.id === id))
                  .map((id) => (
                    <Badge key={id} variant="secondary" className="cursor-pointer" onClick={() => toggleTag(id)}>
                      {id}
                    </Badge>
                  ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
