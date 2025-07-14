// Main application entry point
import { Router } from "./core/Router.js"
import { AuthService } from "./services/AuthService.js"
import { EventService } from "./services/EventService.js"
import { UIService } from "./services/UIService.js"
import { ValidationService } from "./services/ValidationService.js"

/**
 * Main Application Class
 * Handles application initialization and coordination between services
 */
class App {
  constructor() {
    this.router = new Router()
    this.authService = new AuthService()
    this.eventService = new EventService()
    this.uiService = new UIService()
    this.validationService = new ValidationService()
  }

  /**
   * Initialize the application
   * Sets up event listeners, routes, and initial state
   */
  async initialize() {
    try {
      // Show loading spinner during initialization
      this.uiService.showLoading()

      // Initialize services
      await this.initializeServices()

      // Set up navigation event listeners
      this.setupNavigation()

      // Set up global event listeners
      this.setupGlobalEventListeners()

      // Initialize router and load initial route
      await this.router.init()

      // Update UI based on authentication state
      this.updateAuthUI()

      // Hide loading spinner
      this.uiService.hideLoading()

      console.log("✅ Application initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize application:", error)
      this.uiService.showToast("Failed to initialize application", "error")
      this.uiService.hideLoading()
    }
  }

  /**
   * Initialize all application services
   */
  async initializeServices() {
    // Initialize authentication service
    await this.authService.init()

    // Initialize event service
    await this.eventService.init()

    // Set up service cross-references for dependency injection
    this.router.setServices({
      auth: this.authService,
      event: this.eventService,
      ui: this.uiService,
      validation: this.validationService,
    })
  }

  /**
   * Set up navigation event listeners
   */
  setupNavigation() {
    // Handle navigation link clicks
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-route]")
      if (link) {
        e.preventDefault()
        const route = link.getAttribute("data-route")
        this.router.navigate(route)
      }
    })

    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => {
      this.router.handlePopState()
    })

    // Handle mobile navigation toggle
    const navToggle = document.getElementById("nav-toggle")
    const navMenu = document.getElementById("nav-menu")

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active")
        navMenu.classList.toggle("show")
      })
    }

    // Handle user dropdown
    const userBtn = document.getElementById("user-btn")
    const dropdownMenu = document.getElementById("dropdown-menu")

    if (userBtn && dropdownMenu) {
      userBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        dropdownMenu.classList.toggle("show")
      })

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        dropdownMenu.classList.remove("show")
      })
    }

    // Handle logout
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.handleLogout()
      })
    }
  }

  /**
   * Set up global event listeners
   */
  setupGlobalEventListeners() {
    // Handle authentication state changes
    document.addEventListener("auth:login", (e) => {
      this.updateAuthUI()
      this.uiService.showToast(`Welcome back, ${e.detail.user.firstName}!`, "success")
      this.router.navigate("dashboard")
    })

    document.addEventListener("auth:logout", () => {
      this.updateAuthUI()
      this.uiService.showToast("You have been logged out", "info")
      this.router.navigate("home")
    })

    document.addEventListener("auth:register", (e) => {
      this.updateAuthUI()
      this.uiService.showToast(`Welcome, ${e.detail.user.firstName}!`, "success")
      this.router.navigate("dashboard")
    })

    // Handle modal close events
    const modalOverlay = document.getElementById("modal-overlay")
    const modalClose = document.getElementById("modal-close")

    if (modalOverlay && modalClose) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          this.uiService.hideModal()
        }
      })

      modalClose.addEventListener("click", () => {
        this.uiService.hideModal()
      })
    }

    // Handle keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Escape key closes modals
      if (e.key === "Escape") {
        this.uiService.hideModal()
      }
    })

    // Handle form submissions globally
    document.addEventListener("submit", (e) => {
      const form = e.target
      if (form.classList.contains("needs-validation")) {
        e.preventDefault()
        this.handleFormSubmission(form)
      }
    })
  }

  /**
   * Update UI based on authentication state
   */
  updateAuthUI() {
    const user = this.authService.getCurrentUser()
    const navUser = document.getElementById("nav-user")
    const navAuth = document.getElementById("nav-auth")
    const userName = document.getElementById("user-name")

    if (user) {
      // User is logged in
      if (navUser) navUser.style.display = "flex"
      if (navAuth) navAuth.style.display = "none"
      if (userName) userName.textContent = user.firstName
    } else {
      // User is not logged in
      if (navUser) navUser.style.display = "none"
      if (navAuth) navAuth.style.display = "flex"
    }
  }

  /**
   * Handle user logout
   */
  async handleLogout() {
    try {
      await this.authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
      this.uiService.showToast("Error during logout", "error")
    }
  }

  /**
   * Handle form submissions with validation
   */
  async handleFormSubmission(form) {
    try {
      // Clear previous validation errors
      this.validationService.clearFormErrors(form)

      // Get form data
      const formData = new FormData(form)
      const data = Object.fromEntries(formData.entries())

      // Validate form based on its type
      const formType = form.getAttribute("data-form-type")
      let isValid = false

      switch (formType) {
        case "login":
          isValid = this.validationService.validateLoginForm(data, form)
          break
        case "register":
          isValid = this.validationService.validateRegisterForm(data, form)
          break
        case "event":
          isValid = this.validationService.validateEventForm(data, form)
          break
        default:
          isValid = true
      }

      if (isValid) {
        // Form is valid, proceed with submission
        const submitEvent = new CustomEvent("form:submit", {
          detail: { formType, data, form },
        })
        document.dispatchEvent(submitEvent)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      this.uiService.showToast("Form submission failed", "error")
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Show loading screen
    const loadingScreen = document.getElementById("loading-screen")

    // Initialize authentication service
    await AuthService.initialize()

    // Initialize main application
    const app = new App()
    await app.initialize()

    // Hide loading screen after initialization
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 300)
    }, 1000)
  } catch (error) {
    console.error("Failed to initialize application:", error)
    // Show error message to user
    document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
                <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
                <p>Failed to load the application. Please refresh the page.</p>
                <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `
  }
})

// Export for testing purposes
export { App }
