"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FilterBar({ filters, projects, tags, onFilterChange, onClearFilters }) {
  const hasActiveFilters = filters.projectId || filters.tagIds?.length > 0 || filters.status || filters.dateRange

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg">
      <span className="text-sm font-medium text-foreground">Filters:</span>

      <Select
        value={filters.projectId?.toString() || "all"}
        onValueChange={(value) => onFilterChange({ projectId: value === "all" ? null : Number.parseInt(value) })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id.toString()}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status || "all"}
        onValueChange={(value) => onFilterChange({ status: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.dateRange || "all"}
        onValueChange={(value) => onFilterChange({ dateRange: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Dates" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = filters.tagIds?.includes(tag.id)
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer"
              style={isSelected ? { backgroundColor: tag.color } : { borderColor: tag.color, color: tag.color }}
              onClick={() => {
                const newTagIds = isSelected
                  ? filters.tagIds.filter((id) => id !== tag.id)
                  : [...(filters.tagIds || []), tag.id]
                onFilterChange({ tagIds: newTagIds.length > 0 ? newTagIds : null })
              }}
            >
              {tag.name}
            </Badge>
          )
        })}
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="ml-auto">
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
