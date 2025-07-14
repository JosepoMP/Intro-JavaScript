// Event Service - Handles event-related operations and business logic
import { ApiService } from "./api.service.js"
import { AuthService } from "./auth.service.js"
import { ValidationService } from "./validation.service.js"

/**
 * Event Service
 * Manages event CRUD operations, registrations, and business logic
 * Handles data consistency and validation for event-related operations
 */
export class EventService {
  static events = []
  static registrations = []
  static categories = [
    "Technology",
    "Business",
    "Music",
    "Sports",
    "Education",
    "Health",
    "Arts",
    "Food",
    "Travel",
    "Other",
  ]

  /**
   * Initialize Event Service
   */
  static async initialize() {
    try {
      await this.loadEvents()
      await this.loadRegistrations()
      console.log("Event Service initialized")
    } catch (error) {
      console.error("Failed to initialize Event Service:", error)
      throw error
    }
  }

  /**
   * Load all events from API
   */
  static async loadEvents() {
    try {
      this.events = await ApiService.get("/events")
      console.log(`Loaded ${this.events.length} events`)
    } catch (error) {
      console.error("Failed to load events:", error)
      this.events = []
      throw error
    }
  }

  /**
   * Load all registrations from API
   */
  static async loadRegistrations() {
    try {
      this.registrations = await ApiService.get("/registrations")
      console.log(`Loaded ${this.registrations.length} registrations`)
    } catch (error) {
      console.error("Failed to load registrations:", error)
      this.registrations = []
      throw error
    }
  }

  /**
   * Get all events with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered events
   */
  static getEvents(filters = {}) {
    let filteredEvents = [...this.events]

    // Filter by status
    if (filters.status) {
      filteredEvents = filteredEvents.filter((event) => event.status === filters.status)
    }

    // Filter by category
    if (filters.category) {
      filteredEvents = filteredEvents.filter((event) => event.category === filters.category)
    }

    // Filter by date range
    if (filters.startDate) {
      filteredEvents = filteredEvents.filter((event) => new Date(event.date) >= new Date(filters.startDate))
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter((event) => new Date(event.date) <= new Date(filters.endDate))
    }

    // Search by title or description
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.location.toLowerCase().includes(searchTerm),
      )
    }

    // Filter by availability
    if (filters.availableOnly) {
      filteredEvents = filteredEvents.filter((event) => event.registeredAttendees < event.capacity)
    }

    // Sort events
    const sortBy = filters.sortBy || "date"
    const sortOrder = filters.sortOrder || "asc"

    filteredEvents.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      // Handle date sorting
      if (sortBy === "date") {
        aValue = new Date(a.date + " " + a.time)
        bValue = new Date(b.date + " " + b.time)
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filteredEvents
  }

  /**
   * Get event by ID
   * @param {number} eventId - Event ID
   * @returns {Object|null} Event object or null if not found
   */
  static getEventById(eventId) {
    return this.events.find((event) => event.id === Number.parseInt(eventId)) || null
  }

  /**
   * Create new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Created event
   */
  static async createEvent(eventData) {
    try {
      // Check permissions
      if (!AuthService.hasPermission("create_event")) {
        throw new Error("Insufficient permissions to create events")
      }

      // Validate event data
      const validation = ValidationService.validateEventForm(eventData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      // Sanitize data
      const sanitizedData = ValidationService.sanitizeFormData(eventData, [
        "title",
        "description",
        "location",
        "category",
      ])

      // Prepare event object
      const newEvent = {
        ...sanitizedData,
        capacity: Number.parseInt(sanitizedData.capacity),
        price: Number.parseFloat(sanitizedData.price) || 0,
        registeredAttendees: 0,
        status: "active",
        createdBy: AuthService.getCurrentUser().id,
        createdAt: new Date().toISOString(),
      }

      // Create event via API
      const createdEvent = await ApiService.post("/events", newEvent)

      // Update local cache
      this.events.push(createdEvent)

      console.log("Event created successfully:", createdEvent.title)
      return createdEvent
    } catch (error) {
      console.error("Failed to create event:", error)
      throw error
    }
  }

  /**
   * Update existing event
   * @param {number} eventId - Event ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated event
   */
  static async updateEvent(eventId, updateData) {
    try {
      const existingEvent = this.getEventById(eventId)
      if (!existingEvent) {
        throw new Error("Event not found")
      }

      // Check permissions
      const currentUser = AuthService.getCurrentUser()
      if (!AuthService.hasPermission("edit_event") && existingEvent.createdBy !== currentUser.id) {
        throw new Error("Insufficient permissions to edit this event")
      }

      // Validate update data
      const validation = ValidationService.validateEventForm({ ...existingEvent, ...updateData })
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      // Sanitize data
      const sanitizedData = ValidationService.sanitizeFormData(updateData, [
        "title",
        "description",
        "location",
        "category",
      ])

      // Prepare updated event
      const updatedEventData = {
        ...existingEvent,
        ...sanitizedData,
        capacity: Number.parseInt(sanitizedData.capacity),
        price: Number.parseFloat(sanitizedData.price) || 0,
        updatedAt: new Date().toISOString(),
      }

      // Update via API
      const updatedEvent = await ApiService.put(`/events/${eventId}`, updatedEventData)

      // Update local cache
      const eventIndex = this.events.findIndex((event) => event.id === eventId)
      if (eventIndex !== -1) {
        this.events[eventIndex] = updatedEvent
      }

      console.log("Event updated successfully:", updatedEvent.title)
      return updatedEvent
    } catch (error) {
      console.error("Failed to update event:", error)
      throw error
    }
  }

  /**
   * Delete event
   * @param {number} eventId - Event ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  static async deleteEvent(eventId) {
    try {
      const existingEvent = this.getEventById(eventId)
      if (!existingEvent) {
        throw new Error("Event not found")
      }

      // Check permissions
      const currentUser = AuthService.getCurrentUser()
      if (!AuthService.hasPermission("delete_event") && existingEvent.createdBy !== currentUser.id) {
        throw new Error("Insufficient permissions to delete this event")
      }

      // Check if event has registrations
      const eventRegistrations = this.getEventRegistrations(eventId)
      if (eventRegistrations.length > 0) {
        throw new Error("Cannot delete event with existing registrations")
      }

      // Delete via API
      await ApiService.delete(`/events/${eventId}`)

      // Update local cache
      this.events = this.events.filter((event) => event.id !== eventId)

      console.log("Event deleted successfully")
      return true
    } catch (error) {
      console.error("Failed to delete event:", error)
      throw error
    }
  }

  /**
   * Register user for event
   * @param {number} eventId - Event ID
   * @param {number} userId - User ID (optional, defaults to current user)
   * @returns {Promise<Object>} Registration object
   */
  static async registerForEvent(eventId, userId = null) {
    try {
      const event = this.getEventById(eventId)
      if (!event) {
        throw new Error("Event not found")
      }

      const currentUser = AuthService.getCurrentUser()
      const targetUserId = userId || currentUser.id

      // Check if event is active
      if (event.status !== "active") {
        throw new Error("Event is not available for registration")
      }

      // Check event capacity
      if (event.registeredAttendees >= event.capacity) {
        throw new Error("Event is fully booked")
      }

      // Check if user is already registered
      const existingRegistration = this.registrations.find(
        (reg) => reg.eventId === eventId && reg.userId === targetUserId,
      )

      if (existingRegistration) {
        throw new Error("User is already registered for this event")
      }

      // Check event date
      const eventDateTime = new Date(event.date + " " + event.time)
      if (eventDateTime < new Date()) {
        throw new Error("Cannot register for past events")
      }

      // Create registration
      const registration = {
        eventId: eventId,
        userId: targetUserId,
        registeredAt: new Date().toISOString(),
        status: "confirmed",
      }

      const createdRegistration = await ApiService.post("/registrations", registration)

      // Update event attendee count
      await this.updateEventAttendeeCount(eventId, event.registeredAttendees + 1)

      // Update local cache
      this.registrations.push(createdRegistration)

      console.log("User registered for event successfully")
      return createdRegistration
    } catch (error) {
      console.error("Failed to register for event:", error)
      throw error
    }
  }

  /**
   * Unregister user from event
   * @param {number} eventId - Event ID
   * @param {number} userId - User ID (optional, defaults to current user)
   * @returns {Promise<boolean>} True if unregistered successfully
   */
  static async unregisterFromEvent(eventId, userId = null) {
    try {
      const event = this.getEventById(eventId)
      if (!event) {
        throw new Error("Event not found")
      }

      const currentUser = AuthService.getCurrentUser()
      const targetUserId = userId || currentUser.id

      // Find registration
      const registration = this.registrations.find((reg) => reg.eventId === eventId && reg.userId === targetUserId)

      if (!registration) {
        throw new Error("Registration not found")
      }

      // Check if event has already started
      const eventDateTime = new Date(event.date + " " + event.time)
      const now = new Date()
      const hoursUntilEvent = (eventDateTime - now) / (1000 * 60 * 60)

      if (hoursUntilEvent < 24) {
        throw new Error("Cannot unregister less than 24 hours before the event")
      }

      // Delete registration
      await ApiService.delete(`/registrations/${registration.id}`)

      // Update event attendee count
      await this.updateEventAttendeeCount(eventId, event.registeredAttendees - 1)

      // Update local cache
      this.registrations = this.registrations.filter((reg) => reg.id !== registration.id)

      console.log("User unregistered from event successfully")
      return true
    } catch (error) {
      console.error("Failed to unregister from event:", error)
      throw error
    }
  }

  /**
   * Get user's registrations
   * @param {number} userId - User ID (optional, defaults to current user)
   * @returns {Array} User's registrations with event details
   */
  static getUserRegistrations(userId = null) {
    const currentUser = AuthService.getCurrentUser()
    const targetUserId = userId || currentUser.id

    const userRegistrations = this.registrations.filter((reg) => reg.userId === targetUserId)

    return userRegistrations
      .map((registration) => ({
        ...registration,
        event: this.getEventById(registration.eventId),
      }))
      .filter((reg) => reg.event) // Filter out registrations for deleted events
  }

  /**
   * Get event registrations
   * @param {number} eventId - Event ID
   * @returns {Array} Event registrations
   */
  static getEventRegistrations(eventId) {
    return this.registrations.filter((reg) => reg.eventId === eventId)
  }

  /**
   * Update event attendee count
   * @param {number} eventId - Event ID
   * @param {number} newCount - New attendee count
   * @returns {Promise<Object>} Updated event
   */
  static async updateEventAttendeeCount(eventId, newCount) {
    try {
      const event = this.getEventById(eventId)
      if (!event) {
        throw new Error("Event not found")
      }

      const updatedEvent = await ApiService.patch(`/events/${eventId}`, {
        registeredAttendees: newCount,
      })

      // Update local cache
      const eventIndex = this.events.findIndex((e) => e.id === eventId)
      if (eventIndex !== -1) {
        this.events[eventIndex] = updatedEvent
      }

      return updatedEvent
    } catch (error) {
      console.error("Failed to update attendee count:", error)
      throw error
    }
  }

  /**
   * Get event statistics
   * @returns {Object} Event statistics
   */
  static getEventStatistics() {
    const totalEvents = this.events.length
    const activeEvents = this.events.filter((e) => e.status === "active").length
    const totalRegistrations = this.registrations.length
    const upcomingEvents = this.events.filter((e) => {
      const eventDate = new Date(e.date + " " + e.time)
      return eventDate > new Date() && e.status === "active"
    }).length

    const categoryStats = {}
    this.events.forEach((event) => {
      categoryStats[event.category] = (categoryStats[event.category] || 0) + 1
    })

    return {
      totalEvents,
      activeEvents,
      totalRegistrations,
      upcomingEvents,
      categoryStats,
    }
  }

  /**
   * Get available categories
   * @returns {Array} Available categories
   */
  static getCategories() {
    return [...this.categories]
  }

  /**
   * Check if user is registered for event
   * @param {number} eventId - Event ID
   * @param {number} userId - User ID (optional, defaults to current user)
   * @returns {boolean} True if user is registered
   */
  static isUserRegistered(eventId, userId = null) {
    const currentUser = AuthService.getCurrentUser()
    const targetUserId = userId || currentUser.id

    return this.registrations.some((reg) => reg.eventId === eventId && reg.userId === targetUserId)
  }

  /**
   * Get events created by user
   * @param {number} userId - User ID (optional, defaults to current user)
   * @returns {Array} Events created by user
   */
  static getUserCreatedEvents(userId = null) {
    const currentUser = AuthService.getCurrentUser()
    const targetUserId = userId || currentUser.id

    return this.events.filter((event) => event.createdBy === targetUserId)
  }
}
