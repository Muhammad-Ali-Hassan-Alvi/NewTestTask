import { render, screen, fireEvent } from "@testing-library/react"
import TaskCard from "@/app/components/TaskCard"
import jest from "jest" // Import jest to fix the undeclared variable error

describe("TaskCard", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    projectId: 1,
    tagIds: [1, 2],
    dueDate: "2025-02-15",
    status: "todo",
  }

  const mockProject = {
    id: 1,
    name: "Test Project",
    color: "#8B5CF6",
  }

  const mockTags = [
    { id: 1, name: "urgent", color: "#EF4444" },
    { id: 2, name: "design", color: "#8B5CF6" },
  ]

  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render task title and description", () => {
    render(
      <TaskCard task={mockTask} project={mockProject} tags={mockTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )

    expect(screen.getByText("Test Task")).toBeInTheDocument()
    expect(screen.getByText("Test Description")).toBeInTheDocument()
  })

  it("should render project badge", () => {
    render(
      <TaskCard task={mockTask} project={mockProject} tags={mockTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )

    expect(screen.getByText("Test Project")).toBeInTheDocument()
  })

  it("should render task tags", () => {
    render(
      <TaskCard task={mockTask} project={mockProject} tags={mockTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )

    expect(screen.getByText("urgent")).toBeInTheDocument()
    expect(screen.getByText("design")).toBeInTheDocument()
  })

  it("should render status badge", () => {
    render(
      <TaskCard task={mockTask} project={mockProject} tags={mockTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )

    expect(screen.getByText("todo")).toBeInTheDocument()
  })

  it("should call onEdit when edit is clicked", () => {
    render(
      <TaskCard task={mockTask} project={mockProject} tags={mockTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )

    // Open dropdown menu
    const menuButton = screen.getByRole("button")
    fireEvent.click(menuButton)

    // Click edit
    const editButton = screen.getByText("Edit")
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it("should call onDelete when delete is clicked", () => {
    render(
      <TaskCard task={mockTask} project={mockProject} tags={mockTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    )

    // Open dropdown menu
    const menuButton = screen.getByRole("button")
    fireEvent.click(menuButton)

    // Click delete
    const deleteButton = screen.getByText("Delete")
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })
})
