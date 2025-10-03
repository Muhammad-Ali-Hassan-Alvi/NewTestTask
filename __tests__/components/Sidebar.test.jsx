import { render, screen } from "@testing-library/react"
import Sidebar from "@/app/components/Sidebar"

describe("Sidebar", () => {
  const mockStats = {
    total: 10,
    inProgress: 3,
    completed: 5,
  }

  it("should render app title", () => {
    render(<Sidebar stats={mockStats} />)
    expect(screen.getByText("TaskFlow")).toBeInTheDocument()
  })

  it("should render navigation links", () => {
    render(<Sidebar stats={mockStats} />)
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("My Tasks")).toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
  })

  it("should render stats when provided", () => {
    render(<Sidebar stats={mockStats} />)
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("should render without stats", () => {
    render(<Sidebar />)
    expect(screen.getByText("TaskFlow")).toBeInTheDocument()
    expect(screen.queryByText("Overview")).not.toBeInTheDocument()
  })
})
