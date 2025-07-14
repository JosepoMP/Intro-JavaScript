// Authentication Service - Handles user authentication and session management
import { ApiService } from "./api.service.js"
import { ValidationService } from "./validation.service.js"

/**
 * Authentication Service
 * Manages user authentication, session persistence, and role-based access
 */
export class AuthService {
  static currentUser = null
  static sessionKey = "eventapp_session"
  static tokenKey = "eventapp_token"

  /**
   * Initialize authentication service
   * Restore session from localStorage if available
   */
  static async initialize() {
    try {
      const savedSession = localStorage.getItem(this.sessionKey)
      if (savedSession) {
        const sessionData = JSON.parse(savedSession)

        // Validate session expiry
        if (sessionData.expiresAt && new Date(sessionData.expiresAt) > new Date()) {
          this.currentUser = sessionData.user
          console.log("Session restored for user:", this.currentUser.username)
        } else {
          // Session expired, clear it
          this.clearSession()
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth service:", error)
      this.clearSession()
    }
  }

  /**
   * Authenticate user with credentials
   * @param {string} username - User's username or email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User object if successful
   */
  static async login(username, password) {
    try {
      // Validate input
      const validation = ValidationService.validateLoginForm({ username, password })
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      // Fetch users from API
      const users = await ApiService.get("/users")

      // Find user by username or email
      const user = users.find((u) => (u.username === username || u.email === username) && u.password === password)

      if (!user) {
        throw new Error("Invalid credentials")
      }

      // Create session
      const sessionData = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }

      // Save session
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData))
      this.currentUser = sessionData.user

      console.log("User logged in successfully:", user.username)
      return sessionData.user
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user object
   */
  static async register(userData) {
    try {
      // Validate registration data
      const validation = ValidationService.validateRegistrationForm(userData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      // Check if username or email already exists
      const existingUsers = await ApiService.get("/users")
      const userExists = existingUsers.some((u) => u.username === userData.username || u.email === userData.email)

      if (userExists) {
        throw new Error("Username or email already exists")
      }

      // Create new user
      const newUser = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "user", // Default role
        createdAt: new Date().toISOString(),
      }

      const createdUser = await ApiService.post("/users", newUser)
      console.log("User registered successfully:", createdUser.username)

      return createdUser
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  /**
   * Logout current user
   */
  static async logout() {
    try {
      this.clearSession()
      console.log("User logged out successfully")
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user or null if not authenticated
   */
  static getCurrentUser() {
    return this.currentUser
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  static isAuthenticated() {
    return this.currentUser !== null
  }

  /**
   * Check if current user has admin role
   * @returns {boolean} True if user is admin
   */
  static isAdmin() {
    return this.currentUser && this.currentUser.role === "admin"
  }

  /**
   * Check if user has permission for specific action
   * @param {string} permission - Permission to check
   * @returns {boolean} True if user has permission
   */
  static hasPermission(permission) {
    if (!this.currentUser) return false

    const permissions = {
      admin: ["create_event", "edit_event", "delete_event", "view_all_events", "manage_users"],
      user: ["view_events", "register_event", "view_own_registrations"],
    }

    const userPermissions = permissions[this.currentUser.role] || []
    return userPermissions.includes(permission)
  }

  /**
   * Update user profile
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object
   */
  static async updateProfile(updateData) {
    try {
      if (!this.currentUser) {
        throw new Error("No authenticated user")
      }

      // Validate update data
      const validation = ValidationService.validateProfileUpdate(updateData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      // Update user via API
      const updatedUser = await ApiService.put(`/users/${this.currentUser.id}`, {
        ...this.currentUser,
        ...updateData,
      })

      // Update current session
      this.currentUser = {
        ...this.currentUser,
        ...updateData,
      }

      // Update stored session
      const sessionData = JSON.parse(localStorage.getItem(this.sessionKey))
      sessionData.user = this.currentUser
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData))

      console.log("Profile updated successfully")
      return updatedUser
    } catch (error) {
      console.error("Profile update failed:", error)
      throw error
    }
  }

  /**
   * Clear user session
   */
  static clearSession() {
    localStorage.removeItem(this.sessionKey)
    localStorage.removeItem(this.tokenKey)
    this.currentUser = null
  }

  /**
   * Refresh session expiry
   */
  static refreshSession() {
    if (this.currentUser) {
      const sessionData = JSON.parse(localStorage.getItem(this.sessionKey))
      if (sessionData) {
        sessionData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData))
      }
    }
  }

  /**
   * Check if session is valid
   * @returns {boolean} True if session is valid
   */
  static isSessionValid() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey)
      if (!sessionData) return false

      const session = JSON.parse(sessionData)
      return session.expiresAt && new Date(session.expiresAt) > new Date()
    } catch (error) {
      return false
    }
  }
}
