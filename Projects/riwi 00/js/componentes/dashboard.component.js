// Dashboard Component - Main user dashboard interface
import { AuthService } from "../../services/auth.service.js"
import { EventService } from "../../services/event.service.js"
import { UIService } from "../../services/ui.service.js"

/**
 * Dashboard Component
 * Provides main dashboard interface with user-specific content and statistics
 */
export class DashboardComponent {
  constructor() {
    this.element = null
    this.currentUser = null
    this.userRegistrations = []
    this.upcomingEvents = []
    this.statistics = {}
  }

  /**
   * Initialize component
   */
  async initialize() {
    try {
      this.currentUser = AuthService.getCurrentUser()

      // Load user data
      await this.loadUserData()

      console.log("Dashboard component initialized")
    } catch (error) {
      console.error("Failed to initialize dashboard:", error)
      throw error
    }
  }

  /**
   * Load user-specific data
   */
  async loadUserData() {
    try {
      // Load user registrations
      this.userRegistrations = EventService.getUserRegistrations()

      // Load upcoming events
      this.upcomingEvents = EventService.getEvents({
        status: "active",
        availableOnly: true,
        sortBy: "date",
        sortOrder: "asc",
      }).slice(0, 6) // Show first 6 upcoming events

      // Load statistics
      this.statistics = EventService.getEventStatistics()
    } catch (error) {
      console.error("Failed to load user data:", error)
      throw error
    }
  }

  /**
   * Render dashboard component
   * @returns {HTMLElement} Dashboard component element
   */
  async render() {
    this.element = document.createElement("div")
    this.element.className = "dashboard-container"
    this.element.innerHTML = this.getTemplate()

    this.setupEventListeners()
    return this.element
  }

  /**
   * Get component HTML template
   * @returns {string} HTML template
   */
  getTemplate() {
    const isAdmin = AuthService.isAdmin()

    return `
            <div class="container py-8">
                <!-- Welcome Header -->
                <div class="dashboard-header mb-8">
                    <h1 class="text-3xl font-bold text-gray-800">
                        Welcome back, ${this.currentUser.firstName}! 👋
                    </h1>
                    <p class="text-gray-600 mt-2">
                        ${isAdmin ? "Manage your events and view system statistics" : "Discover and register for amazing events"}
                    </p>
                </div>

                <!-- Statistics Cards -->
                ${this.renderStatisticsCards()}

                <!-- Quick Actions -->
                <div class="quick-actions mb-8">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="text-xl font-semibold">Quick Actions</h2>
                        </div>
                        <div class="card-body">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button class="btn btn-primary" data-action="browse-events">
                                    📅 Browse Events
                                </button>
                                <button class="btn btn-outline" data-action="view-registrations">
                                    🎫 My Registrations
                                </button>
                                ${
                                  isAdmin
                                    ? `
                                    <button class="btn btn-success" data-action="create-event">
                                        ➕ Create Event
                                    </button>
                                    <button class="btn btn-secondary" data-action="admin-panel">
                                        ⚙️ Admin Panel
                                    </button>
                                `
                                    : `
                                    <button class="btn btn-outline" data-action="update-profile">
                                        👤 Update Profile
                                    </button>
                                    <button class="btn btn-outline" data-action="event-history">
                                        📊 Event History
                                    </button>
                                `
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- User Registrations -->
                    <div class="user-registrations">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-semibold">My Registrations</h2>
                                <span class="badge badge-info">${this.userRegistrations.length} events</span>
                            </div>
                            <div class="card-body">
                                ${this.renderUserRegistrations()}
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Events -->
                    <div class="upcoming-events">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-semibold">Upcoming Events</h2>
                                <a href="#events" class="text-primary hover:underline">View All</a>
                            </div>
                            <div class="card-body">
                                ${this.renderUpcomingEvents()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity (Admin Only) -->
                ${isAdmin ? this.renderAdminSection() : ""}
            </div>
        `
  }

  /**
   * Render statistics cards
   * @returns {string} Statistics cards HTML
   */
  renderStatisticsCards() {
    const isAdmin = AuthService.isAdmin()

    if (isAdmin) {
      return `
                <div class="statistics-cards mb-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-3xl mb-2">📅</div>
                                <div class="text-2xl font-bold text-primary">${this.statistics.totalEvents}</div>
                                <div class="text-gray-600">Total Events</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-3xl mb-2">✅</div>
                                <div class="text-2xl font-bold text-success">${this.statistics.activeEvents}</div>
                                <div class="text-gray-600">Active Events</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-3xl mb-2">🎫</div>
                                <div class="text-2xl font-bold text-warning">${this.statistics.totalRegistrations}</div>
                                <div class="text-gray-600">Total Registrations</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-3xl mb-2">🔥</div>
                                <div class="text-2xl font-bold text-error">${this.statistics.upcomingEvents}</div>
                                <div class="text-gray-600">Upcoming Events</div>
                            </div>
                        </div>
                    </div>
                </div>
            `
    } else {
      return `
                <div class="statistics-cards mb-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-3xl mb-2">🎫</div>
                                <div class="text-2xl font-bold text-primary">${this.userRegistrations.length}</div>
                                <div class="text-gray-600">My Registrations</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-3xl mb-2">📅</div>
                                <div class="text-2xl font-bold text-success">${this.statistics.upcomingEvents}</div>
                                <div class="text-gray-600">Available Events</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="card p-6 text-center">
                                <div class="text-3xl mb-2">🏆</div>
                                <div class="text-2xl font-bold text-warning">${this.userRegistrations.filter((r) => new Date(r.event.date) < new Date()).length}</div>
                                <div class="text-gray-600">Events Attended</div>
                            </div>
                        </div>
                    </div>
                </div>
            `
    }
  }

  /**
   * Render user registrations
   * @returns {string} User registrations HTML
   */
  renderUserRegistrations() {
    if (this.userRegistrations.length === 0) {
      return `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">🎫</div>
                    <h3 class="text-lg font-semibold mb-2">No Registrations Yet</h3>
                    <p class="text-gray-600 mb-4">You haven't registered for any events yet.</p>
                    <button class="btn btn-primary" data-action="browse-events">
                        Browse Events
                    </button>
                </div>
            `
    }

    return `
            <div class="registrations-list">
                ${this.userRegistrations
                  .slice(0, 5)
                  .map(
                    (registration) => `
                    <div class="registration-item p-4 border-b border-gray-200 last:border-b-0">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800">${registration.event.title}</h4>
                                <div class="text-sm text-gray-600 mt-1">
                                    📅 ${this.formatDate(registration.event.date)} at ${this.formatTime(registration.event.time)}
                                </div>
                                <div class="text-sm text-gray-600">
                                    📍 ${registration.event.location}
                                </div>
                                <div class="text-xs text-gray-500 mt-2">
                                    Registered: ${this.formatDate(registration.registeredAt)}
                                </div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                                <span class="badge badge-success">Confirmed</span>
                                <button 
                                    class="btn btn-sm btn-outline text-error" 
                                    data-action="unregister" 
                                    data-event-id="${registration.event.id}"
                                    title="Unregister from event"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
                
                ${
                  this.userRegistrations.length > 5
                    ? `
                    <div class="text-center pt-4">
                        <button class="btn btn-outline" data-action="view-all-registrations">
                            View All ${this.userRegistrations.length} Registrations
                        </button>
                    </div>
                `
                    : ""
                }
            </div>
        `
  }

  /**
   * Render upcoming events
   * @returns {string} Upcoming events HTML
   */
  renderUpcomingEvents() {
    if (this.upcomingEvents.length === 0) {
      return `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">📅</div>
                    <h3 class="text-lg font-semibold mb-2">No Upcoming Events</h3>
                    <p class="text-gray-600">Check back later for new events!</p>
                </div>
            `
    }

    return `
            <div class="events-list">
                ${this.upcomingEvents
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
                                ${
                                  event.price > 0
                                    ? `
                                    <div class="text-sm font-semibold text-primary mt-1">
                                        💰 $${event.price}
                                    </div>
                                `
                                    : ""
                                }
                            </div>
                            <div class="flex flex-col items-end gap-2">
                                <span class="badge ${event.registeredAttendees >= event.capacity ? "badge-error" : "badge-success"}">
                                    ${event.registeredAttendees >= event.capacity ? "Full" : "Available"}
                                </span>
                                ${
                                  !EventService.isUserRegistered(event.id) && event.registeredAttendees < event.capacity
                                    ? `
                                    <button 
                                        class="btn btn-sm btn-primary" 
                                        data-action="register" 
                                        data-event-id="${event.id}"
                                    >
                                        Register
                                    </button>
                                `
                                    : EventService.isUserRegistered(event.id)
                                      ? `
                                    <span class="text-sm text-success">✓ Registered</span>
                                `
                                      : `
                                    <span class="text-sm text-gray-500">Full</span>
                                `
                                }
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
   * Render admin section
   * @returns {string} Admin section HTML
   */
  renderAdminSection() {
    return `
            <div class="admin-section mt-8">
                <div class="card">
                    <div class="card-header">
                        <h2 class="text-xl font-semibold">Admin Overview</h2>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="font-semibold mb-3">Event Categories</h3>
                                <div class="space-y-2">
                                    ${Object.entries(this.statistics.categoryStats || {})
                                      .map(
                                        ([category, count]) => `
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600">${category}</span>
                                            <span class="badge badge-info">${count}</span>
                                        </div>
                                    `,
                                      )
                                      .join("")}
                                </div>
                            </div>
                            <div>
                                <h3 class="font-semibold mb-3">Quick Admin Actions</h3>
                                <div class="space-y-2">
                                    <button class="btn btn-outline w-full" data-action="create-event">
                                        ➕ Create New Event
                                    </button>
                                    <button class="btn btn-outline w-full" data-action="manage-events">
                                        📝 Manage Events
                                    </button>
                                    <button class="btn btn-outline w-full" data-action="view-registrations">
                                        👥 View All Registrations
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Quick action buttons
    this.element.addEventListener("click", async (e) => {
      const action = e.target.getAttribute("data-action")
      const eventId = e.target.getAttribute("data-event-id")

      switch (action) {
        case "browse-events":
          window.location.hash = "events"
          break

        case "view-registrations":
        case "view-all-registrations":
          this.showRegistrationsModal()
          break

        case "create-event":
          this.showCreateEventModal()
          break

        case "admin-panel":
          window.location.hash = "admin"
          break

        case "update-profile":
          this.showUpdateProfileModal()
          break

        case "register":
          if (eventId) {
            await this.handleEventRegistration(eventId)
          }
          break

        case "unregister":
          if (eventId) {
            await this.handleEventUnregistration(eventId)
          }
          break
      }
    })
  }

  /**
   * Handle event registration
   * @param {string} eventId - Event ID
   */
  async handleEventRegistration(eventId) {
    try {
      const confirmed = await UIService.showConfirmation(
        "Are you sure you want to register for this event?",
        "Confirm Registration",
      )

      if (confirmed) {
        await EventService.registerForEvent(Number.parseInt(eventId))
        UIService.showToast("Successfully registered for event!", "success")

        // Refresh dashboard data
        await this.loadUserData()
        this.refreshContent()
      }
    } catch (error) {
      console.error("Registration failed:", error)
      UIService.showToast(error.message || "Registration failed", "error")
    }
  }

  /**
   * Handle event unregistration
   * @param {string} eventId - Event ID
   */
  async handleEventUnregistration(eventId) {
    try {
      const confirmed = await UIService.showConfirmation(
        "Are you sure you want to unregister from this event?",
        "Confirm Unregistration",
      )

      if (confirmed) {
        await EventService.unregisterFromEvent(Number.parseInt(eventId))
        UIService.showToast("Successfully unregistered from event", "success")

        // Refresh dashboard data
        await this.loadUserData()
        this.refreshContent()
      }
    } catch (error) {
      console.error("Unregistration failed:", error)
      UIService.showToast(error.message || "Unregistration failed", "error")
    }
  }

  /**
   * Show registrations modal
   */
  async showRegistrationsModal() {
    const modalContent = `
            <div class="registrations-modal">
                <h3 class="text-lg font-semibold mb-4">My Event Registrations</h3>
                ${
                  this.userRegistrations.length === 0
                    ? `
                    <div class="text-center py-8">
                        <p class="text-gray-600">You haven't registered for any events yet.</p>
                    </div>
                `
                    : `
                    <div class="space-y-4 max-h-96 overflow-y-auto">
                        ${this.userRegistrations
                          .map(
                            (registration) => `
                            <div class="border border-gray-200 rounded-lg p-4">
                                <h4 class="font-semibold">${registration.event.title}</h4>
                                <div class="text-sm text-gray-600 mt-2">
                                    <div>📅 ${this.formatDate(registration.event.date)} at ${this.formatTime(registration.event.time)}</div>
                                    <div>📍 ${registration.event.location}</div>
                                    <div>🎫 Registered: ${this.formatDate(registration.registeredAt)}</div>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                }
            </div>
        `

    await UIService.showModal({
      title: "My Registrations",
      content: modalContent,
      buttons: [{ text: "Close", primary: true }],
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

        // Refresh dashboard
        await this.loadUserData()
        this.refreshContent()
      } catch (error) {
        console.error("Failed to create event:", error)
        UIService.showToast(error.message || "Failed to create event", "error")
      }
    }
  }

  /**
   * Show update profile modal
   */
  async showUpdateProfileModal() {
    const formData = await UIService.showForm({
      title: "Update Profile",
      fields: [
        { name: "firstName", label: "First Name", type: "text", required: true, value: this.currentUser.firstName },
        { name: "lastName", label: "Last Name", type: "text", required: true, value: this.currentUser.lastName },
        { name: "email", label: "Email", type: "email", required: true, value: this.currentUser.email },
      ],
      submitText: "Update Profile",
      cancelText: "Cancel",
    })

    if (formData) {
      try {
        await AuthService.updateProfile(formData)
        UIService.showToast("Profile updated successfully!", "success")

        // Update current user
        this.currentUser = AuthService.getCurrentUser()
        this.refreshContent()
      } catch (error) {
        console.error("Failed to update profile:", error)
        UIService.showToast(error.message || "Failed to update profile", "error")
      }
    }
  }

  /**
   * Refresh dashboard content
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
   * Cleanup component
   */
  destroy() {
    if (this.element) {
      this.element = null
    }
  }
}
