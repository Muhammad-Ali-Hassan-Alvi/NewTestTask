"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TaskForm from "@/app/components/TaskForm"
import jest from "jest" // Import jest to fix the undeclared variable error

describe("TaskForm", () => {
  const mockProjects = [
    { id: 1, name: "Project A" },
    { id: 2, name: "Project B" },
  ]

  const mockTags = [
    { id: 1, name: "urgent", color: "#EF4444" },
    { id: 2, name: "design", color: "#8B5CF6" },
  ]

  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render create form when no task provided", () => {
    render(
      <TaskForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        task={null}
        projects={mockProjects}
        tags={mockTags}
        isLoading={false}
      />,
    )

    expect(screen.getByText("Create New Task")).toBeInTheDocument()
    expect(screen.getByText("Fill in the details to create a new task.")).toBeInTheDocument()
  })

  it("should render edit form when task provided", () => {
    const mockTask = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      projectId: 1,
      tagIds: [1],
      dueDate: "2025-02-15",
      status: "todo",
    }

    render(
      <TaskForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        isLoading={false}
      />,
    )

    expect(screen.getByText("Edit Task")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument()
  })

  it("should call onSubmit with form data", async () => {
    const user = userEvent.setup()

    render(
      <TaskForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        task={null}
        projects={mockProjects}
        tags={mockTags}
        isLoading={false}
      />,
    )

    // Fill in form
    await user.type(screen.getByLabelText(/title/i), "New Task")
    await user.type(screen.getByLabelText(/description/i), "New Description")
    await user.type(screen.getByLabelText(/due date/i), "2025-02-20")

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create task/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  it("should call onClose when cancel is clicked", () => {
    render(
      <TaskForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        task={null}
        projects={mockProjects}
        tags={mockTags}
        isLoading={false}
      />,
    )

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it("should disable buttons when loading", () => {
    render(
      <TaskForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        task={null}
        projects={mockProjects}
        tags={mockTags}
        isLoading={true}
      />,
    )

    const submitButton = screen.getByRole("button", { name: /saving/i })
    const cancelButton = screen.getByRole("button", { name: /cancel/i })

    expect(submitButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })
})
