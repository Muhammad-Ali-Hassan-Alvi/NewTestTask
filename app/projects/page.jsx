"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import FilterBar from "../components/FilterBar"
import Sidebar from "../components/Sidebar"
import { api } from "../lib/api"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({ projectId: null, tagIds: null, status: null, dateRange: null })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) router.push("/login")
  }, [router])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const [projectsRes, tasksRes] = await Promise.all([api.getProjects(), api.getTasks()])
      if (projectsRes.error || tasksRes.error) {
        toast({
          title: "Error",
          description: projectsRes.error || tasksRes.error,
          variant: "destructive",
        })
      } else {
        setProjects(projectsRes.data)
        setTasks(tasksRes.data)
      }
      setLoading(false)
    })()
  }, [])

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
            <h2 className="text-3xl font-bold text-foreground">Projects</h2>
          </div>

          <div className="mb-6">
            <FilterBar
              filters={filters}
              projects={projects}
              tags={[]}
              onFilterChange={(nf) => setFilters((p) => ({ ...p, ...nf }))}
              onClearFilters={() => setFilters({ projectId: null, tagIds: null, status: null, dateRange: null })}
            />
          </div>

          <div className="grid gap-4">
            {projects
              .filter((p) => (filters.projectId ? p.id === filters.projectId : true))
              .map((p) => (
                <div key={p.id} className="rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-foreground truncate">{p.name}</h3>
                      </div>
                      {p.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" aria-label="Edit project">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete project" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}


