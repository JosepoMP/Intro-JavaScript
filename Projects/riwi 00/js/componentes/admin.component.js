// Admin Component - Administrative interface for system management
import { AuthService } from "../../services/auth.service.js"
import { EventService } from "../../services/event.service.js"
import { UIService } from "../../services/ui.service.js"

/**
 * Admin Component
 * Provides administrative interface for managing events, users, and system statistics
 */
export class AdminComponent {
  constructor() {
    this.element = null
    this.statistics = {}
    this.recentEvents = []
    this.recentRegistrations = []
  }

  /**
   * Initialize component
   */
  async initialize() {
    try {
      // Check admin permissions
      if (!AuthService.isAdmin()) {
        throw new Error("Access denied. Admin privileges required.")
      }

      await this.loadAdminData()
      console.log("Admin component initialized")
    } catch (error) {
      console.error("Failed to initialize admin component:", error)
      throw error
    }
  }

  /**
   * Load admin-specific data
   */
  async loadAdminData() {
    try {
      // Load statistics
      this.statistics = EventService.getEventStatistics()

      // Load recent events
      this.recentEvents = EventService.getEvents({
        sortBy: "createdAt",
        sortOrder: "desc",
      }).slice(0, 10)
    } catch (error) {
      console.error("Failed to load admin data:", error)
      throw error
    }
  }

  /**
   * Render admin component
   * @returns {HTMLElement} Admin component element
   */
  async render() {
    this.element = document.createElement("div")
    this.element.className = "admin-container"
    this.element.innerHTML = this.getTemplate()

    this.setupEventListeners()
    return this.element
  }

  /**
   * Get component HTML template
   * @returns {string} HTML template
   */
  getTemplate() {
    return `
            <div class="container py-8">
                <!-- Admin Header -->
                <div class="admin-header mb-8">
                    <h1 class="text-3xl font-bold text-gray-800">Admin Panel</h1>
                    <p class="text-gray-600 mt-2">Manage events, users, and system settings</p>
                </div>

                <!-- Statistics Overview -->
                <div class="statistics-overview mb-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-4xl mb-3">📅</div>
                                <div class="text-3xl font-bold text-primary">${this.statistics.totalEvents}</div>
                                <div class="text-gray-600">Total Events</div>
                                <div class="text-sm text-gray-500 mt-1">${this.statistics.activeEvents} active</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-4xl mb-3">🎫</div>
                                <div class="text-3xl font-bold text-success">${this.statistics.totalRegistrations}</div>
                                <div class="text-gray-600">Total Registrations</div>
                                <div class="text-sm text-gray-500 mt-1">All time</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-4xl mb-3">🔥</div>
                                <div class="text-3xl font-bold text-warning">${this.statistics.upcomingEvents}</div>
                                <div class="text-gray-600">Upcoming Events</div>
                                <div class="text-sm text-gray-500 mt-1">Next 30 days</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-4xl mb-3">📊</div>
                                <div class="text-3xl font-bold text-error">${Object.keys(this.statistics.categoryStats || {}).length}</div>
                                <div class="text-gray-600">Categories</div>
                                <div class="text-sm text-gray-500 mt-1">Active categories</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions mb-8">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="text-xl font-semibold">Quick Actions</h2>
                        </div>
                        <div class="card-body">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button class="btn btn-primary" data-action="create-event">
                                    ➕ Create Event
                                </button>
                                <button class="btn btn-outline" data-action="manage-events">
                                    📝 Manage Events
                                </button>
                                <button class="btn btn-outline" data-action="view-registrations">
                                    👥 View Registrations
                                </button>
                                <button class="btn btn-outline" data-action="export-data">
                                    📊 Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Recent Events -->
                    <div class="recent-events">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-semibold">Recent Events</h2>
                                <button class="btn btn-sm btn-outline" data-action="refresh-events">
                                    🔄 Refresh
                                </button>
                            </div>
                            <div class="card-body">
                                ${this.renderRecentEvents()}
                            </div>
                        </div>
                    </div>

                    <!-- Category Statistics -->
                    <div class="category-stats">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-semibold">Category Distribution</h2>
                            </div>
                            <div class="card-body">
                                ${this.renderCategoryStats()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- System Information -->
                <div class="system-info mt-8">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="text-xl font-semibold">System Information</h2>
                        </div>
                        <div class="card-body">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <h3 class="font-semibold mb-3">Application Status</h3>
                                    <div class="space-y-2 text-sm">
                                        <div class="flex justify-between">
                                            <span>Status:</span>
                                            <span class="badge badge-success">Online</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Version:</span>
                                            <span>1.0.0</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Environment:</span>
                                            <span>Development</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="font-semibold mb-3">Database Status</h3>
                                    <div class="space-y-2 text-sm">
                                        <div class="flex justify-between">
                                            <span>Connection:</span>
                                            <span class="badge badge-success">Connected</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Type:</span>
                                            <span>JSON Server</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Port:</span>
                                            <span>3001</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="font-semibold mb-3">Performance</h3>
                                    <div class="space-y-2 text-sm">
                                        <div class="flex justify-between">
                                            <span>Load Time:</span>
                                            <span class="text-success">Fast</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Memory Usage:</span>
                                            <span class="text-success">Normal</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Response Time:</span>
                                            <span class="text-success">&lt; 100ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
  }

  /**
   * Render recent events
   * @returns {string} Recent events HTML
   */
  renderRecentEvents() {
    if (this.recentEvents.length === 0) {
      return `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">📅</div>
                    <p class="text-gray-600">No events found</p>
                </div>
            `
    }

    return `
            <div class="events-list max-h-96 overflow-y-auto">
                ${this.recentEvents
                  .map(
                    (event) => `
                    <div class="event-item p-4 border-b border-gray-200 last:border-b-0">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800">${event.title}</h4>
                                <div class="text-sm text-gray-600 mt-1">
                                    📅 ${this.formatDate(event.date)} at ${this.formatTime(event.time)}
                                </div>
                                <div class="text-sm text-gray-600">
                                    📍 ${event.location}
                                </div>
                                <div class="text-sm text-gray-600">
                                    👥 ${event.registeredAttendees}/${event.capacity} registered
                                </div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                                <span class="badge ${event.status === "active" ? "badge-success" : "badge-warning"}">
                                    ${event.status}
                                </span>
                                <div class="flex gap-1">
                                    <button 
                                        class="btn btn-sm btn-outline" 
                                        data-action="edit-event" 
                                        data-event-id="${event.id}"
                                        title="Edit Event"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        class="btn btn-sm btn-outline text-error" 
                                        data-action="delete-event" 
                                        data-event-id="${event.id}"
                                        title="Delete Event"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `
  }

  /**
   * Render category statistics
   * @returns {string} Category stats HTML
   */
  renderCategoryStats() {
    const categoryStats = this.statistics.categoryStats || {}
    const totalEvents = Object.values(categoryStats).reduce((sum, count) => sum + count, 0)

    if (totalEvents === 0) {
      return `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">📊</div>
                    <p class="text-gray-600">No category data available</p>
                </div>
            `
    }

    return `
            <div class="category-list space-y-4">
                ${Object.entries(categoryStats)
                  .map(([category, count]) => {
                    const percentage = Math.round((count / totalEvents) * 100)
                    return `
                        <div class="category-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-medium">${category}</span>
                                <span class="text-sm text-gray-600">${count} events (${percentage}%)</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    class="h-2 rounded-full bg-primary transition-all duration-300" 
                                    style="width: ${percentage}%"
                                ></div>
                            </div>
                        </div>
                    `
                  })
                  .join("")}
            </div>
        `
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.element.addEventListener("click", async (e) => {
      const action = e.target.getAttribute("data-action")
      const eventId = e.target.getAttribute("data-event-id")

      switch (action) {
        case "create-event":
          await this.showCreateEventModal()
          break

        case "manage-events":
          window.location.hash = "events"
          break

        case "view-registrations":
          await this.showRegistrationsModal()
          break

        case "export-data":
          await this.exportData()
          break

        case "refresh-events":
          await this.refreshData()
          break

        case "edit-event":
          if (eventId) {
            await this.showEditEventModal(eventId)
          }
          break

        case "delete-event":
          if (eventId) {
            await this.handleDeleteEvent(eventId)
          }
          break
      }
    })
  }

  /**
   * Show create event modal
   */
  async showCreateEventModal() {
    const formData = await UIService.showForm({
      title: "Create New Event",
      fields: [
        { name: "title", label: "Event Title", type: "text", required: true, placeholder: "Enter event title" },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Describe your event",
        },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "time", label: "Time", type: "time", required: true },
        { name: "location", label: "Location", type: "text", required: true, placeholder: "Event location" },
        { name: "capacity", label: "Capacity", type: "number", required: true, placeholder: "Maximum attendees" },
        { name: "price", label: "Price ($)", type: "number", placeholder: "0.00" },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: EventService.getCategories().map((cat) => ({ value: cat, text: cat })),
        },
      ],
      submitText: "Create Event",
      cancelText: "Cancel",
    })

    if (formData) {
      try {
        await EventService.createEvent(formData)
        UIService.showToast("Event created successfully!", "success")
        await this.refreshData()
      } catch (error) {
        console.error("Failed to create event:", error)
        UIService.showToast(error.message || "Failed to create event", "error")
      }
    }
  }

  /**
   * Show edit event modal
   * @param {string} eventId - Event ID
   */
  async showEditEventModal(eventId) {
    const event = EventService.getEventById(Number.parseInt(eventId))
    if (!event) {
      UIService.showToast("Event not found", "error")
      return
    }

    const formData = await UIService.showForm({
      title: "Edit Event",
      fields: [
        { name: "title", label: "Event Title", type: "text", required: true, value: event.title },
        { name: "description", label: "Description", type: "textarea", required: true, value: event.description },
        { name: "date", label: "Date", type: "date", required: true, value: event.date },
        { name: "time", label: "Time", type: "time", required: true, value: event.time },
        { name: "location", label: "Location", type: "text", required: true, value: event.location },
        { name: "capacity", label: "Capacity", type: "number", required: true, value: event.capacity },
        { name: "price", label: "Price ($)", type: "number", value: event.price },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          value: event.category,
          options: EventService.getCategories().map((cat) => ({ value: cat, text: cat })),
        },
      ],
      submitText: "Update Event",
      cancelText: "Cancel",
    })

    if (formData) {
      try {
        await EventService.updateEvent(Number.parseInt(eventId), formData)
        UIService.showToast("Event updated successfully!", "success")
        await this.refreshData()
      } catch (error) {
        console.error("Failed to update event:", error)
        UIService.showToast(error.message || "Failed to update event", "error")
      }
    }
  }

  /**
   * Handle delete event
   * @param {string} eventId - Event ID
   */
  async handleDeleteEvent(eventId) {
    const event = EventService.getEventById(Number.parseInt(eventId))
    if (!event) {
      UIService.showToast("Event not found", "error")
      return
    }

    const confirmed = await UIService.showConfirmation(
      `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      "Delete Event",
    )

    if (confirmed) {
      try {
        await EventService.deleteEvent(Number.parseInt(eventId))
        UIService.showToast("Event deleted successfully", "success")
        await this.refreshData()
      } catch (error) {
        console.error("Failed to delete event:", error)
        UIService.showToast(error.message || "Failed to delete event", "error")
      }
    }
  }

  /**
   * Show registrations modal
   */
  async showRegistrationsModal() {
    // This would show all registrations across all events
    UIService.showToast("Registrations view coming soon!", "info")
  }

  /**
   * Export data
   */
  async exportData() {
    try {
      const data = {
        events: EventService.getEvents(),
        statistics: this.statistics,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `events-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      UIService.showToast("Data exported successfully!", "success")
    } catch (error) {
      console.error("Failed to export data:", error)
      UIService.showToast("Failed to export data", "error")
    }
  }

  /**
   * Refresh admin data
   */
  async refreshData() {
    try {
      await this.loadAdminData()
      this.refreshContent()
      UIService.showToast("Data refreshed successfully", "success")
    } catch (error) {
      console.error("Failed to refresh data:", error)
      UIService.showToast("Failed to refresh data", "error")
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  /**
   * Format time for display
   * @param {string} timeString - Time string
   * @returns {string} Formatted time
   */
  formatTime(timeString) {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  /**
   * Refresh component content
   */
  refreshContent() {
    if (this.element) {
      const newElement = document.createElement("div")
      newElement.innerHTML = this.getTemplate()
      this.element.innerHTML = newElement.innerHTML
      this.setupEventListeners()
    }
  }

  /**
   * Cleanup component
   */
  destroy() {
    if (this.element) {
      this.element = null
    }
  }
}
