import { render, screen, fireEvent } from "@testing-library/react"
import FilterBar from "@/app/components/FilterBar"
import jest from "jest" // Added import for jest

describe("FilterBar", () => {
  const mockProjects = [
    { id: 1, name: "Project A" },
    { id: 2, name: "Project B" },
  ]

  const mockTags = [
    { id: 1, name: "urgent", color: "#EF4444" },
    { id: 2, name: "design", color: "#8B5CF6" },
  ]

  const mockFilters = {
    projectId: null,
    tagIds: null,
    status: null,
    dateRange: null,
  }

  const mockOnFilterChange = jest.fn()
  const mockOnClearFilters = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render all filter controls", () => {
    render(
      <FilterBar
        filters={mockFilters}
        projects={mockProjects}
        tags={mockTags}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    )

    expect(screen.getByText("Filters:")).toBeInTheDocument()
  })

  it("should render all tags", () => {
    render(
      <FilterBar
        filters={mockFilters}
        projects={mockProjects}
        tags={mockTags}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    )

    expect(screen.getByText("urgent")).toBeInTheDocument()
    expect(screen.getByText("design")).toBeInTheDocument()
  })

  it("should call onFilterChange when tag is clicked", () => {
    render(
      <FilterBar
        filters={mockFilters}
        projects={mockProjects}
        tags={mockTags}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    )

    const urgentTag = screen.getByText("urgent")
    fireEvent.click(urgentTag)

    expect(mockOnFilterChange).toHaveBeenCalledWith({ tagIds: [1] })
  })

  it("should show clear filters button when filters are active", () => {
    const activeFilters = { ...mockFilters, projectId: 1 }

    render(
      <FilterBar
        filters={activeFilters}
        projects={mockProjects}
        tags={mockTags}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    )

    expect(screen.getByText("Clear Filters")).toBeInTheDocument()
  })

  it("should call onClearFilters when clear button is clicked", () => {
    const activeFilters = { ...mockFilters, projectId: 1 }

    render(
      <FilterBar
        filters={activeFilters}
        projects={mockProjects}
        tags={mockTags}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />,
    )

    const clearButton = screen.getByText("Clear Filters")
    fireEvent.click(clearButton)

    expect(mockOnClearFilters).toHaveBeenCalled()
  })
})
