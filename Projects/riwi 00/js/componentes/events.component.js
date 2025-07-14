// Events Component - Event browsing and management interface
import { AuthService } from "../../services/auth.service.js"
import { EventService } from "../../services/event.service.js"
import { UIService } from "../../services/ui.service.js"

/**
 * Events Component
 * Provides comprehensive event browsing, filtering, and management interface
 */
export class EventsComponent {
  constructor() {
    this.element = null
    this.events = []
    this.filteredEvents = []
    this.currentFilters = {
      search: "",
      category: "",
      status: "active",
      availableOnly: false,
      sortBy: "date",
      sortOrder: "asc",
    }
    this.currentPage = 1
    this.eventsPerPage = 9
  }

  /**
   * Initialize component
   */
  async initialize() {
    try {
      await this.loadEvents()
      console.log("Events component initialized")
    } catch (error) {
      console.error("Failed to initialize events component:", error)
      throw error
    }
  }

  /**
   * Load events with current filters
   */
  async loadEvents() {
    try {
      this.events = EventService.getEvents(this.currentFilters)
      this.filteredEvents = [...this.events]
      this.currentPage = 1 // Reset to first page when loading new data
    } catch (error) {
      console.error("Failed to load events:", error)
      throw error
    }
  }

  /**
   * Render events component
   * @returns {HTMLElement} Events component element
   */
  async render() {
    this.element = document.createElement("div")
    this.element.className = "events-container"
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
    const totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage)
    const startIndex = (this.currentPage - 1) * this.eventsPerPage
    const endIndex = startIndex + this.eventsPerPage
    const currentPageEvents = this.filteredEvents.slice(startIndex, endIndex)

    return `
            <div class="container py-8">
                <!-- Header -->
                <div class="events-header mb-8">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800">Events</h1>
                            <p class="text-gray-600 mt-2">Discover and register for amazing events</p>
                        </div>
                        ${
                          isAdmin
                            ? `
                            <button class="btn btn-primary" data-action="create-event">
                                ➕ Create Event
                            </button>
                        `
                            : ""
                        }
                    </div>

                    <!-- Filters and Search -->
                    <div class="filters-section">
                        <div class="card">
                            <div class="card-body">
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <!-- Search -->
                                    <div class="form-group">
                                        <label class="form-label">Search Events</label>
                                        <input 
                                            type="text" 
                                            id="search-input" 
                                            class="form-input" 
                                            placeholder="Search by title, description, or location..."
                                            value="${this.currentFilters.search}"
                                        >
                                    </div>

                                    <!-- Category Filter -->
                                    <div class="form-group">
                                        <label class="form-label">Category</label>
                                        <select id="category-filter" class="form-select">
                                            <option value="">All Categories</option>
                                            ${EventService.getCategories()
                                              .map(
                                                (category) => `
                                                <option value="${category}" ${this.currentFilters.category === category ? "selected" : ""}>
                                                    ${category}
                                                </option>
                                            `,
                                              )
                                              .join("")}
                                        </select>
                                    </div>

                                    <!-- Availability Filter -->
                                    <div class="form-group">
                                        <label class="form-label">Availability</label>
                                        <select id="availability-filter" class="form-select">
                                            <option value="false" ${!this.currentFilters.availableOnly ? "selected" : ""}>All Events</option>
                                            <option value="true" ${this.currentFilters.availableOnly ? "selected" : ""}>Available Only</option>
                                        </select>
                                    </div>

                                    <!-- Sort Options -->
                                    <div class="form-group">
                                        <label class="form-label">Sort By</label>
                                        <select id="sort-filter" class="form-select">
                                            <option value="date-asc" ${this.currentFilters.sortBy === "date" && this.currentFilters.sortOrder === "asc" ? "selected" : ""}>Date (Earliest First)</option>
                                            <option value="date-desc" ${this.currentFilters.sortBy === "date" && this.currentFilters.sortOrder === "desc" ? "selected" : ""}>Date (Latest First)</option>
                                            <option value="title-asc" ${this.currentFilters.sortBy === "title" && this.currentFilters.sortOrder === "asc" ? "selected" : ""}>Title (A-Z)</option>
                                            <option value="title-desc" ${this.currentFilters.sortBy === "title" && this.currentFilters.sortOrder === "desc" ? "selected" : ""}>Title (Z-A)</option>
                                            <option value="price-asc" ${this.currentFilters.sortBy === "price" && this.currentFilters.sortOrder === "asc" ? "selected" : ""}>Price (Low to High)</option>
                                            <option value="price-desc" ${this.currentFilters.sortBy === "price" && this.currentFilters.sortOrder === "desc" ? "selected" : ""}>Price (High to Low)</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="flex justify-between items-center mt-4">
                                    <div class="text-sm text-gray-600">
                                        Showing ${currentPageEvents.length} of ${this.filteredEvents.length} events
                                    </div>
                                    <button class="btn btn-outline btn-sm" data-action="clear-filters">
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Events Grid -->
                <div class="events-grid mb-8">
                    ${this.renderEventsGrid(currentPageEvents)}
                </div>

                <!-- Pagination -->
                ${totalPages > 1 ? this.renderPagination(totalPages) : ""}
            </div>
        `
  }

  /**
   * Render events grid
   * @param {Array} events - Events to render
   * @returns {string} Events grid HTML
   */
  renderEventsGrid(events) {
    if (events.length === 0) {
      return `
                <div class="no-events text-center py-12">
                    <div class="text-6xl mb-4">📅</div>
                    <h3 class="text-xl font-semibold mb-2">No Events Found</h3>
                    <p class="text-gray-600 mb-6">
                        ${this.hasActiveFilters() ? "Try adjusting your filters to see more events." : "No events are currently available."}
                    </p>
                    ${
                      this.hasActiveFilters()
                        ? `
                        <button class="btn btn-primary" data-action="clear-filters">
                            Clear Filters
                        </button>
                    `
                        : ""
                    }
                </div>
            `
    }

    return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${events.map((event) => this.renderEventCard(event)).join("")}
            </div>
        `
  }

  /**
   * Render individual event card
   * @param {Object} event - Event object
   * @returns {string} Event card HTML
   */
  renderEventCard(event) {
    const isRegistered = EventService.isUserRegistered(event.id)
    const isFull = event.registeredAttendees >= event.capacity
    const isPastEvent = new Date(event.date + " " + event.time) < new Date()
    const isAdmin = AuthService.isAdmin()
    const canRegister = !isRegistered && !isFull && !isPastEvent

    return `
            <div class="event-card card hover:shadow-lg transition-all duration-300">
                <!-- Event Image Placeholder -->
                <div class="event-image bg-gradient-to-br from-blue-500 to-purple-600 h-48 relative">
                    <div class="absolute inset-0 flex items-center justify-center text-white text-4xl">
                        ${this.getCategoryIcon(event.category)}
                    </div>
                    <div class="absolute top-4 right-4 bg-white rounded-lg p-2 text-center shadow-md">
                        <div class="text-lg font-bold text-primary">${new Date(event.date).getDate()}</div>
                        <div class="text-xs text-gray-600">${new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</div>
                    </div>
                    ${
                      isPastEvent
                        ? `
                        <div class="absolute top-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                            Past Event
                        </div>
                    `
                        : isFull
                          ? `
                        <div class="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
                            Full
                        </div>
                    `
                          : ""
                    }
                </div>

                <div class="card-body">
                    <!-- Event Title and Category -->
                    <div class="mb-3">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-semibold text-gray-800 line-clamp-2">${event.title}</h3>
                            <span class="badge badge-info ml-2">${event.category}</span>
                        </div>
                        <p class="text-gray-600 text-sm line-clamp-2">${event.description}</p>
                    </div>

                    <!-- Event Details -->
                    <div class="event-details space-y-2 mb-4">
                        <div class="flex items-center text-sm text-gray-600">
                            <span class="mr-2">📅</span>
                            <span>${this.formatDate(event.date)} at ${this.formatTime(event.time)}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <span class="mr-2">📍</span>
                            <span class="line-clamp-1">${event.location}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <span class="mr-2">👥</span>
                            <span>${event.registeredAttendees}/${event.capacity} registered</span>
                        </div>
                        ${
                          event.price > 0
                            ? `
                            <div class="flex items-center text-sm font-semibold text-primary">
                                <span class="mr-2">💰</span>
                                <span>$${event.price}</span>
                            </div>
                        `
                            : `
                            <div class="flex items-center text-sm text-success">
                                <span class="mr-2">🆓</span>
                                <span>Free Event</span>
                            </div>
                        `
                        }
                    </div>

                    <!-- Progress Bar -->
                    <div class="mb-4">
                        <div class="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Registration Progress</span>
                            <span>${Math.round((event.registeredAttendees / event.capacity) * 100)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                class="h-2 rounded-full transition-all duration-300 ${
                                  event.registeredAttendees / event.capacity > 0.8
                                    ? "bg-red-500"
                                    : event.registeredAttendees / event.capacity > 0.6
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }" 
                                style="width: ${Math.min((event.registeredAttendees / event.capacity) * 100, 100)}%"
                            ></div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2">
                        ${
                          canRegister
                            ? `
                            <button 
                                class="btn btn-primary flex-1" 
                                data-action="register" 
                                data-event-id="${event.id}"
                            >
                                Register
                            </button>
                        `
                            : isRegistered
                              ? `
                            <button 
                                class="btn btn-success flex-1" 
                                disabled
                            >
                                ✓ Registered
                            </button>
                        `
                              : isFull
                                ? `
                            <button 
                                class="btn btn-secondary flex-1" 
                                disabled
                            >
                                Full
                            </button>
                        `
                                : isPastEvent
                                  ? `
                            <button 
                                class="btn btn-secondary flex-1" 
                                disabled
                            >
                                Past Event
                            </button>
                        `
                                  : ""
                        }

                        <button 
                            class="btn btn-outline" 
                            data-action="view-details" 
                            data-event-id="${event.id}"
                            title="View Details"
                        >
                            👁️
                        </button>

                        ${
                          isRegistered && !isPastEvent
                            ? `
                            <button 
                                class="btn btn-outline text-error" 
                                data-action="unregister" 
                                data-event-id="${event.id}"
                                title="Unregister"
                            >
                                ❌
                            </button>
                        `
                            : ""
                        }

                        ${
                          isAdmin
                            ? `
                            <button 
                                class="btn btn-outline" 
                                data-action="edit-event" 
                                data-event-id="${event.id}"
                                title="Edit Event"
                            >
                                ✏️
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        `
  }

  /**
   * Render pagination
   * @param {number} totalPages - Total number of pages
   * @returns {string} Pagination HTML
   */
  renderPagination(totalPages) {
    const maxVisiblePages = 5
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    let paginationHTML = `
            <div class="pagination flex justify-center items-center gap-2">
                <button 
                    class="btn btn-outline" 
                    data-action="page" 
                    data-page="${this.currentPage - 1}"
                    ${this.currentPage === 1 ? "disabled" : ""}
                >
                    ← Previous
                </button>
        `

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
                <button 
                    class="btn ${i === this.currentPage ? "btn-primary" : "btn-outline"}" 
                    data-action="page" 
                    data-page="${i}"
                >
                    ${i}
                </button>
            `
    }

    paginationHTML += `
                <button 
                    class="btn btn-outline" 
                    data-action="page" 
                    data-page="${this.currentPage + 1}"
                    ${this.currentPage === totalPages ? "disabled" : ""}
                >
                    Next →
                </button>
            </div>
        `

    return paginationHTML
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Search input
    const searchInput = this.element.querySelector("#search-input")
    if (searchInput) {
      let searchTimeout
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          this.currentFilters.search = e.target.value
          this.applyFilters()
        }, 300)
      })
    }

    // Filter selects
    const categoryFilter = this.element.querySelector("#category-filter")
    const availabilityFilter = this.element.querySelector("#availability-filter")
    const sortFilter = this.element.querySelector("#sort-filter")

    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        this.currentFilters.category = e.target.value
        this.applyFilters()
      })
    }

    if (availabilityFilter) {
      availabilityFilter.addEventListener("change", (e) => {
        this.currentFilters.availableOnly = e.target.value === "true"
        this.applyFilters()
      })
    }

    if (sortFilter) {
      sortFilter.addEventListener("change", (e) => {
        const [sortBy, sortOrder] = e.target.value.split("-")
        this.currentFilters.sortBy = sortBy
        this.currentFilters.sortOrder = sortOrder
        this.applyFilters()
      })
    }

    // Action buttons
    this.element.addEventListener("click", async (e) => {
      const action = e.target.getAttribute("data-action")
      const eventId = e.target.getAttribute("data-event-id")
      const page = e.target.getAttribute("data-page")

      switch (action) {
        case "create-event":
          await this.showCreateEventModal()
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

        case "view-details":
          if (eventId) {
            await this.showEventDetails(eventId)
          }
          break

        case "edit-event":
          if (eventId) {
            await this.showEditEventModal(eventId)
          }
          break

        case "clear-filters":
          this.clearFilters()
          break

        case "page":
          if (page) {
            this.currentPage = Number.parseInt(page)
            this.refreshContent()
          }
          break
      }
    })
  }

  /**
   * Apply current filters
   */
  async applyFilters() {
    try {
      await this.loadEvents()
      this.refreshContent()
    } catch (error) {
      console.error("Failed to apply filters:", error)
      UIService.showToast("Failed to apply filters", "error")
    }
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.currentFilters = {
      search: "",
      category: "",
      status: "active",
      availableOnly: false,
      sortBy: "date",
      sortOrder: "asc",
    }
    this.applyFilters()
  }

  /**
   * Check if any filters are active
   * @returns {boolean} True if filters are active
   */
  hasActiveFilters() {
    return (
      this.currentFilters.search !== "" ||
      this.currentFilters.category !== "" ||
      this.currentFilters.availableOnly !== false ||
      this.currentFilters.sortBy !== "date" ||
      this.currentFilters.sortOrder !== "asc"
    )
  }

  /**
   * Handle event registration
   * @param {string} eventId - Event ID
   */
  async handleEventRegistration(eventId) {
    try {
      const event = EventService.getEventById(Number.parseInt(eventId))
      if (!event) {
        throw new Error("Event not found")
      }

      const confirmed = await UIService.showConfirmation(
        `Are you sure you want to register for "${event.title}"?`,
        "Confirm Registration",
      )

      if (confirmed) {
        await EventService.registerForEvent(Number.parseInt(eventId))
        UIService.showToast("Successfully registered for event!", "success")

        // Refresh events
        await this.loadEvents()
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
      const event = EventService.getEventById(Number.parseInt(eventId))
      if (!event) {
        throw new Error("Event not found")
      }

      const confirmed = await UIService.showConfirmation(
        `Are you sure you want to unregister from "${event.title}"?`,
        "Confirm Unregistration",
      )

      if (confirmed) {
        await EventService.unregisterFromEvent(Number.parseInt(eventId))
        UIService.showToast("Successfully unregistered from event", "success")

        // Refresh events
        await this.loadEvents()
        this.refreshContent()
      }
    } catch (error) {
      console.error("Unregistration failed:", error)
      UIService.showToast(error.message || "Unregistration failed", "error")
    }
  }

  /**
   * Show event details modal
   * @param {string} eventId - Event ID
   */
  async showEventDetails(eventId) {
    const event = EventService.getEventById(Number.parseInt(eventId))
    if (!event) {
      UIService.showToast("Event not found", "error")
      return
    }

    const isRegistered = EventService.isUserRegistered(event.id)
    const registrations = EventService.getEventRegistrations(event.id)

    const modalContent = `
            <div class="event-details-modal">
                <div class="mb-6">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-2xl font-bold text-gray-800">${event.title}</h3>
                        <span class="badge badge-info">${event.category}</span>
                    </div>
                    <p class="text-gray-600 mb-4">${event.description}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h4 class="font-semibold mb-3">Event Information</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-center">
                                <span class="mr-2">📅</span>
                                <span>${this.formatDate(event.date)} at ${this.formatTime(event.time)}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="mr-2">📍</span>
                                <span>${event.location}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="mr-2">👥</span>
                                <span>${event.registeredAttendees}/${event.capacity} registered</span>
                            </div>
                            <div class="flex items-center">
                                <span class="mr-2">💰</span>
                                <span>${event.price > 0 ? `$${event.price}` : "Free"}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="mr-2">📊</span>
                                <span class="badge ${event.status === "active" ? "badge-success" : "badge-warning"}">${event.status}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-semibold mb-3">Registration Status</h4>
                        <div class="space-y-3">
                            ${
                              isRegistered
                                ? `
                                <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div class="flex items-center text-green-800">
                                        <span class="mr-2">✅</span>
                                        <span class="font-medium">You are registered for this event</span>
                                    </div>
                                </div>
                            `
                                : `
                                <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div class="flex items-center text-gray-600">
                                        <span class="mr-2">ℹ️</span>
                                        <span>You are not registered for this event</span>
                                    </div>
                                </div>
                            `
                            }
                            
                            <div class="registration-progress">
                                <div class="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Capacity</span>
                                    <span>${event.registeredAttendees}/${event.capacity}</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        class="h-2 rounded-full ${
                                          event.registeredAttendees / event.capacity > 0.8
                                            ? "bg-red-500"
                                            : event.registeredAttendees / event.capacity > 0.6
                                              ? "bg-yellow-500"
                                              : "bg-green-500"
                                        }" 
                                        style="width: ${Math.min((event.registeredAttendees / event.capacity) * 100, 100)}%"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${
                  AuthService.isAdmin()
                    ? `
                    <div class="admin-info">
                        <h4 class="font-semibold mb-3">Admin Information</h4>
                        <div class="text-sm text-gray-600 space-y-1">
                            <div>Created: ${this.formatDate(event.createdAt)}</div>
                            <div>Event ID: ${event.id}</div>
                            <div>Registrations: ${registrations.length}</div>
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `

    await UIService.showModal({
      title: "Event Details",
      content: modalContent,
      size: "large",
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

        // Refresh events
        await this.loadEvents()
        this.refreshContent()
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

        // Refresh events
        await this.loadEvents()
        this.refreshContent()
      } catch (error) {
        console.error("Failed to update event:", error)
        UIService.showToast(error.message || "Failed to update event", "error")
      }
    }
  }

  /**
   * Get category icon
   * @param {string} category - Event category
   * @returns {string} Category icon
   */
  getCategoryIcon(category) {
    const icons = {
      Technology: "💻",
      Business: "💼",
      Music: "🎵",
      Sports: "⚽",
      Education: "📚",
      Health: "🏥",
      Arts: "🎨",
      Food: "🍽️",
      Travel: "✈️",
      Other: "📅",
    }
    return icons[category] || "📅"
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
      month: "long",
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
