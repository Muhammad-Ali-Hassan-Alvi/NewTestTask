# TaskFlow - Task Management Mini-App

A modern, full-featured task management application built with Next.js, JavaScript, and TailwindCSS. This project demonstrates clean component architecture, comprehensive testing practices, and professional software engineering principles.

![TaskFlow Preview](https://via.placeholder.com/1200x600/18181b/ffffff?text=TaskFlow+Task+Management)

## Features

- **Complete Task Management**: Create, read, update, and delete tasks with full CRUD operations
- **Smart Filtering**: Filter tasks by project, tags, status, and due date ranges
- **Automatic Sorting**: Tasks automatically sorted by upcoming due date
- **Modern Dark UI**: Professional interface inspired by Vercel's design system
- **Mock API Layer**: Simulated backend with realistic network delays
- **Fully Responsive**: Seamless experience on desktop, tablet, and mobile
- **Comprehensive Testing**: 70%+ code coverage with Jest and React Testing Library
- **Type-Safe Forms**: Form validation with react-hook-form and Zod
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## Quick Start

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd task-manager

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Complete Setup From Scratch

Want to build this project from scratch? See [SETUP.md](./SETUP.md) for detailed step-by-step instructions including:
- Creating a new Next.js project
- Installing and configuring TailwindCSS v4
- Setting up shadcn/ui components
- Configuring Jest and React Testing Library
- Complete project structure setup

## Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 19** - UI library
- **JavaScript (JSX)** - Programming language

### Styling
- **TailwindCSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Geist Font** - Modern sans-serif and monospace fonts

### Form & Validation
- **react-hook-form** - Performant form library
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation integration

### Testing
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers

### Utilities
- **date-fns** - Modern date utility library
- **clsx** - Conditional className utility
- **tailwind-merge** - Merge Tailwind classes

## Project Structure

\`\`\`
task-manager/
├── app/
│   ├── page.jsx              # Main tasks page with state management
│   ├── layout.tsx            # Root layout with fonts and metadata
│   └── globals.css           # Global styles, theme tokens, and Tailwind
├── components/
│   ├── TaskCard.jsx          # Task display with actions menu
│   ├── TaskForm.jsx          # Create/edit modal with validation
│   ├── FilterBar.jsx         # Advanced filtering controls
│   ├── Sidebar.jsx           # Navigation and statistics
│   └── ui/                   # shadcn/ui component library
├── lib/
│   ├── mockApi.js            # Mock backend API with CRUD operations
│   └── utils.js              # Utility functions (sorting, filtering, dates)
├── __tests__/
│   ├── components/           # Component tests
│   └── lib/                  # Utility and API tests
├── public/                   # Static assets
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup and global mocks
├── next.config.mjs           # Next.js configuration
├── postcss.config.mjs        # PostCSS with TailwindCSS plugin
├── components.json           # shadcn/ui configuration
└── package.json              # Dependencies and scripts
\`\`\`

## Available Scripts

\`\`\`bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm test             # Run tests in watch mode
npm run test:ci      # Run tests once (for CI/CD)
npm run test:coverage # Generate coverage report
\`\`\`

## Usage Guide

### Creating a Task

1. Click the **"New Task"** button in the top right corner
2. Fill in the task details:
   - **Title** (required): Brief task description
   - **Description** (optional): Detailed information
   - **Project** (required): Select from existing projects
   - **Tags** (optional): Add multiple tags for categorization
   - **Due Date** (required): Set a deadline
   - **Status**: Choose todo, in-progress, or done
3. Click **"Create Task"** to save

### Filtering Tasks

Use the comprehensive filter bar to narrow down your task list:

- **Project Filter**: Show tasks from a specific project
- **Status Filter**: Filter by todo, in-progress, or done
- **Date Range**: Quick filters for today, this week, or overdue tasks
- **Tag Filter**: Click tags to filter (supports multiple tags)
- **Clear All**: Remove all active filters at once

### Editing a Task

1. Click the **three-dot menu** (⋮) on any task card
2. Select **"Edit"** from the dropdown
3. Update any task details in the modal
4. Click **"Update Task"** to save changes

### Deleting a Task

1. Click the **three-dot menu** (⋮) on any task card
2. Select **"Delete"** from the dropdown
3. Task is immediately removed (no confirmation dialog)

### Task Status Indicators

- **Todo**: Gray badge - Task not started
- **In Progress**: Blue badge - Task being worked on
- **Done**: Green badge - Task completed

### Overdue Tasks

Tasks past their due date are highlighted with a red date indicator for easy identification.

## Mock API Documentation

The application uses a mock API (`lib/mockApi.js`) that simulates a real backend:

### Available Endpoints

\`\`\`javascript
// GET /projects - Fetch all projects
await mockApi.getProjects()
// Returns: [{ id, name, color }]

// GET /tasks - Fetch all tasks
await mockApi.getTasks()
// Returns: [{ id, title, description, projectId, tagIds, dueDate, status }]

// GET /tags - Fetch all tags
await mockApi.getTags()
// Returns: [{ id, name, color }]

// POST /tasks - Create a new task
await mockApi.createTask(taskData)
// Params: { title, description, projectId, tagIds, dueDate, status }
// Returns: { id, ...taskData, createdAt, updatedAt }

// PUT /tasks/:id - Update a task
await mockApi.updateTask(id, updates)
// Params: id (string), updates (object)
// Returns: { ...task, ...updates, updatedAt }

// DELETE /tasks/:id - Delete a task
await mockApi.deleteTask(id)
// Params: id (string)
// Returns: { success: true }
\`\`\`

### Mock Data Features

- **Realistic Delays**: 200-500ms simulated network latency
- **In-Memory Storage**: Data persists during browser session
- **Sample Data**: Pre-populated with 8 tasks, 3 projects, and 6 tags
- **Error Handling**: Validates required fields and returns errors

### Migrating to Real API

To integrate with a Laravel backend:

\`\`\`javascript
// lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const api = {
  getTasks: async () => {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('Failed to fetch tasks')
    return res.json()
  },
  
  createTask: async (taskData) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    if (!res.ok) throw new Error('Failed to create task')
    return res.json()
  },
  
  // ... implement other methods
}
\`\`\`

## Testing

### Running Tests

\`\`\`bash
# Watch mode (recommended for development)
npm test

# Run once (for CI/CD pipelines)
npm run test:ci

# Generate coverage report
npm run test:coverage
\`\`\`

### Coverage Reports

After running `npm run test:coverage`, open `coverage/lcov-report/index.html` in your browser to view:
- Line-by-line coverage visualization
- Branch coverage analysis
- Function coverage metrics
- Statement coverage details

### Coverage Requirements

The project enforces **70% minimum coverage** across:
- **Branches**: Conditional logic paths
- **Functions**: Function definitions
- **Lines**: Executable code lines
- **Statements**: JavaScript statements

### Test Organization

\`\`\`
__tests__/
├── components/
│   ├── TaskCard.test.jsx       # Task card rendering and interactions
│   ├── TaskForm.test.jsx       # Form validation and submission
│   ├── FilterBar.test.jsx      # Filter controls and state
│   └── Sidebar.test.jsx        # Navigation and statistics
└── lib/
    ├── utils.test.js           # Utility functions (sort, filter, format)
    └── mockApi.test.js         # API operations (CRUD)
\`\`\`

### Testing Best Practices

**Component Tests**
\`\`\`javascript
// Test rendering
it('renders task title correctly', () => {
  render(<TaskCard task={mockTask} />)
  expect(screen.getByText('Task Title')).toBeInTheDocument()
})

// Test user interactions
it('calls onEdit when edit button is clicked', async () => {
  const onEdit = jest.fn()
  render(<TaskCard task={mockTask} onEdit={onEdit} />)
  
  await userEvent.click(screen.getByRole('button', { name: /edit/i }))
  expect(onEdit).toHaveBeenCalledWith(mockTask)
})
\`\`\`

**Utility Tests**
\`\`\`javascript
// Test pure functions
it('sorts tasks by due date ascending', () => {
  const tasks = [
    { dueDate: '2025-02-15' },
    { dueDate: '2025-02-10' },
  ]
  const sorted = sortTasksByDueDate(tasks)
  expect(sorted[0].dueDate).toBe('2025-02-10')
})
\`\`\`

**API Tests**
\`\`\`javascript
// Test async operations
it('creates a task successfully', async () => {
  const taskData = { title: 'New Task', projectId: '1' }
  const result = await mockApi.createTask(taskData)
  
  expect(result).toHaveProperty('id')
  expect(result.title).toBe('New Task')
})
\`\`\`

### Continuous Integration

Example GitHub Actions workflow:

\`\`\`yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
\`\`\`

## Design System

### Color Palette

The app uses a carefully curated dark theme with semantic color tokens:

\`\`\`css
/* Primary Colors */
--background: 0 0% 9%        /* #171717 - Main background */
--foreground: 0 0% 98%       /* #fafafa - Primary text */

/* Accent Colors */
--primary: 0 0% 98%          /* #fafafa - Primary actions */
--primary-foreground: 0 0% 9% /* #171717 - Text on primary */

/* UI Elements */
--card: 0 0% 11%             /* #1c1c1c - Card backgrounds */
--border: 0 0% 20%           /* #333333 - Borders */
--input: 0 0% 20%            /* #333333 - Input borders */
--ring: 0 0% 83%             /* #d4d4d4 - Focus rings */

/* Status Colors */
--destructive: 0 84% 60%     /* #f87171 - Delete/error */
--muted: 0 0% 15%            /* #262626 - Muted backgrounds */
\`\`\`

### Typography

- **Headings**: Geist Sans (600-700 weight)
- **Body**: Geist Sans (400 weight)
- **Code**: Geist Mono (400 weight)
- **Line Height**: 1.5 for body, 1.2 for headings

### Spacing Scale

Following Tailwind's default spacing scale:
- **xs**: 0.5rem (8px)
- **sm**: 0.75rem (12px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### Component Patterns

- **Cards**: Elevated with subtle borders and shadows
- **Buttons**: Clear hierarchy (primary, secondary, ghost, destructive)
- **Forms**: Inline validation with clear error messages
- **Modals**: Centered with backdrop blur
- **Badges**: Color-coded by status or category

## Architecture Decisions

### Component Architecture

**Separation of Concerns**
- Each component has a single, well-defined responsibility
- UI components are pure and reusable
- Business logic separated into utility functions

**Composition Over Inheritance**
- Complex UIs built from simple, composable components
- Props for customization, not inheritance
- Render props and children for flexibility

**State Management**
- Local state with `useState` for component-level data
- Props for parent-child communication
- Future: Context API or Zustand for global state

### File Organization

**Colocation**
- Components near their usage
- Tests alongside source files
- Utilities grouped by domain

**Naming Conventions**
- PascalCase for components: `TaskCard.jsx`
- camelCase for utilities: `sortTasks.js`
- kebab-case for CSS: `task-card.css`

### Performance Considerations

**Optimization Strategies**
- Memoization with `useMemo` for expensive computations
- Callback memoization with `useCallback` to prevent re-renders
- Lazy loading for modals and heavy components
- Debouncing for search and filter inputs

**Bundle Size**
- Tree-shaking with ES modules
- Dynamic imports for code splitting
- Optimized images with Next.js Image component

### Accessibility

**WCAG 2.1 AA Compliance**
- Semantic HTML elements (`<main>`, `<nav>`, `<button>`)
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management in modals
- Color contrast ratios > 4.5:1

## Assumptions & Limitations

### Current Assumptions

1. **Single User**: No authentication or multi-user support
2. **Client-Side Only**: All data stored in memory (resets on page refresh)
3. **Modern Browsers**: Targets latest Chrome, Firefox, Safari, Edge
4. **Desktop-First**: Optimized for desktop, responsive on mobile
5. **English Only**: No internationalization (i18n) support
6. **Mock Backend**: Laravel backend integration handled separately

### Known Limitations

- No data persistence (use localStorage or backend for production)
- No real-time updates (use WebSockets for collaboration)
- No file attachments (add file upload for documents)
- No task comments or activity log
- No email notifications
- No drag-and-drop reordering
- No task search functionality
- No dark/light mode toggle (dark mode only)

## Future Enhancements

### Phase 1: Core Features
- [ ] Integrate with Laravel backend API
- [ ] Add user authentication (JWT or session-based)
- [ ] Implement data persistence with database
- [ ] Add task search functionality
- [ ] Support for task attachments

### Phase 2: Collaboration
- [ ] Real-time updates with WebSockets
- [ ] Task comments and activity log
- [ ] User assignments and mentions
- [ ] Team workspaces
- [ ] Notifications system

### Phase 3: Advanced Features
- [ ] Drag-and-drop task reordering
- [ ] Kanban board view
- [ ] Calendar view
- [ ] Gantt chart for project timelines
- [ ] Time tracking
- [ ] Recurring tasks
- [ ] Task templates

### Phase 4: Polish
- [ ] Dark/light mode toggle
- [ ] Internationalization (i18n)
- [ ] Export tasks to CSV/PDF
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Offline support with PWA

## Backend Integration Guide

### Laravel API Requirements

Your Laravel backend should provide these endpoints:

\`\`\`php
// routes/api.php

// Authentication
POST   /api/login
POST   /api/logout
POST   /api/register

// Projects
GET    /api/projects
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}

// Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}

// Tags
GET    /api/tags
POST   /api/tags
PUT    /api/tags/{id}
DELETE /api/tags/{id}
\`\`\`

### Expected Response Format

\`\`\`json
// GET /api/tasks
{
  "data": [
    {
      "id": "1",
      "title": "Task Title",
      "description": "Task description",
      "project_id": "1",
      "tag_ids": ["1", "2"],
      "due_date": "2025-02-15",
      "status": "todo",
      "created_at": "2025-02-10T10:00:00Z",
      "updated_at": "2025-02-10T10:00:00Z",
      "project": {
        "id": "1",
        "name": "Project Name"
      },
      "tags": [
        { "id": "1", "name": "Tag Name", "color": "#3b82f6" }
      ]
    }
  ]
}
\`\`\`

### Frontend Integration Steps

1. **Create API Client**
\`\`\`javascript
// lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL

class ApiClient {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token')
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    })
    
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'API request failed')
    }
    
    return res.json()
  }
  
  getTasks() {
    return this.request('/api/tasks')
  }
  
  createTask(data) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  // ... other methods
}

export const api = new ApiClient()
\`\`\`

2. **Update Components**
\`\`\`javascript
// app/page.jsx
import { api } from '@/lib/api'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadTasks()
  }, [])
  
  async function loadTasks() {
    try {
      setLoading(true)
      const data = await api.getTasks()
      setTasks(data.data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // ... rest of component
}
\`\`\`

3. **Add Environment Variables**
\`\`\`bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Ensure tests pass: `npm run test:coverage`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow existing code patterns
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Keep components small and focused

### Testing Requirements

- Write tests for new features
- Maintain 70%+ code coverage
- Test user interactions, not implementation details
- Use descriptive test names

## License

This project is created for a technical assessment and is not licensed for commercial use.

## Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and design inspiration
- **shadcn** - Beautiful UI components
- **Tailwind Labs** - Utility-first CSS framework

## Contact & Support

For questions, issues, or contributions:

- **GitHub Issues**: [Open an issue](https://github.com/your-repo/issues)
- **Email**: your-email@example.com
- **Documentation**: See [SETUP.md](./SETUP.md) for detailed setup

---

**Built with ❤️ using Next.js, TailwindCSS, and shadcn/ui**
