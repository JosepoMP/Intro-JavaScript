// Main Application Class - Orchestrates the entire SPA
import { Router } from "./router/router.js"
import { AuthService } from "./services/auth.service.js"
import { UIService } from "./services/ui.service.js"
import { EventService } from "./services/event.service.js"

/**
 * Main Application Class
 * Manages the overall application state and coordinates between services
 */
export class App {
  constructor() {
    this.router = null
    this.currentUser = null
    this.isInitialized = false
  }

  /**
   * Initialize the application
   * Sets up services, router, and event listeners
   */
  async initialize() {
    try {
      console.log("Initializing Event Management SPA...")

      // Initialize services
      await this.initializeServices()

      // Setup router
      this.setupRouter()

      // Setup global event listeners
      this.setupEventListeners()

      // Check authentication status
      await this.checkAuthenticationStatus()

      // Mark as initialized
      this.isInitialized = true

      console.log("Application initialized successfully")
    } catch (error) {
      console.error("Application initialization failed:", error)
      throw error
    }
  }

  /**
   * Initialize all application services
   */
  async initializeServices() {
    try {
      // Initialize Event Service
      await EventService.initialize()

      // Initialize UI Service
      UIService.initialize()

      console.log("Services initialized successfully")
    } catch (error) {
      console.error("Service initialization failed:", error)
      throw error
    }
  }

  /**
   * Setup the application router
   */
  setupRouter() {
    this.router = new Router()
    this.router.initialize()
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Logout button handler
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", this.handleLogout.bind(this))
    }

    // Navigation link handlers
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-route]")) {
        e.preventDefault()
        const route = e.target.getAttribute("data-route")
        this.router.navigate(route)
      }
    })

    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => {
      this.router.handleRouteChange()
    })

    // Handle online/offline status
    window.addEventListener("online", () => {
      UIService.showToast("Connection restored", "success")
    })

    window.addEventListener("offline", () => {
      UIService.showToast("Connection lost. Some features may not work.", "warning")
    })
  }

  /**
   * Check current authentication status
   */
  async checkAuthenticationStatus() {
    try {
      this.currentUser = AuthService.getCurrentUser()

      if (this.currentUser) {
        this.showAuthenticatedUI()
        // Navigate to dashboard if on login page
        if (window.location.hash === "#login" || window.location.hash === "") {
          this.router.navigate("dashboard")
        }
      } else {
        this.showUnauthenticatedUI()
        // Navigate to login if not authenticated
        this.router.navigate("login")
      }
    } catch (error) {
      console.error("Authentication check failed:", error)
      this.showUnauthenticatedUI()
      this.router.navigate("login")
    }
  }

  /**
   * Show UI elements for authenticated users
   */
  showAuthenticatedUI() {
    const header = document.getElementById("header")
    const userNameElement = document.getElementById("user-name")
    const adminMenu = document.getElementById("admin-menu")

    if (header) header.classList.remove("hidden")

    if (userNameElement && this.currentUser) {
      userNameElement.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`
    }

    // Show admin menu for admin users
    if (adminMenu && this.currentUser && this.currentUser.role === "admin") {
      adminMenu.classList.remove("hidden")
    }
  }

  /**
   * Show UI elements for unauthenticated users
   */
  showUnauthenticatedUI() {
    const header = document.getElementById("header")
    const adminMenu = document.getElementById("admin-menu")

    if (header) header.classList.add("hidden")
    if (adminMenu) adminMenu.classList.add("hidden")
  }

  /**
   * Handle user logout
   */
  async handleLogout() {
    try {
      await AuthService.logout()
      this.currentUser = null
      this.showUnauthenticatedUI()
      this.router.navigate("login")
      UIService.showToast("Logged out successfully", "success")
    } catch (error) {
      console.error("Logout failed:", error)
      UIService.showToast("Logout failed", "error")
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * Update current user
   */
  setCurrentUser(user) {
    this.currentUser = user
    if (user) {
      this.showAuthenticatedUI()
    } else {
      this.showUnauthenticatedUI()
    }
  }
}
