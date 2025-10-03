"use client"

import { Calendar, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatDate, isOverdue } from "../lib/utils"

export default function TaskCard({ task, project, tags, onEdit, onDelete }) {
  const taskTags = task.tags ? task.tags : tags.filter((tag) => task.tagIds?.includes(tag.id))

  const dueDate = task.due_date || task.dueDate
  const overdue = isOverdue(dueDate)

  const normalizedStatus = task.status?.replace("_", "-") || "todo"

  const statusColors = {
    todo: "bg-muted text-muted-foreground",
    "in-progress": "bg-primary/20 text-primary",
    done: "bg-chart-3/20 text-chart-3",
  }

  return (
    <Card className="p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-foreground truncate">{task.title}</h3>
            <Badge variant="outline" className={statusColors[normalizedStatus]}>
              {normalizedStatus.replace("-", " ")}
            </Badge>
          </div>

          {task.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}

          <div className="flex flex-wrap items-center gap-2">
            {project && (
              <Badge variant="outline" className="text-xs" style={{ borderColor: project.color, color: project.color }}>
                {project.name}
              </Badge>
            )}

            {taskTags &&
              taskTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}

            <div
              className={`flex items-center gap-1 text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}
            >
              <Calendar className="h-3 w-3" />
              <span>{formatDate(dueDate)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" aria-label="Edit task" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete task"
            className="text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
