// Router - Handles SPA routing and navigation
import { AuthService } from "../services/auth.service.js"
import { LoginComponent } from "../components/auth/login.component.js"
import { RegisterComponent } from "../components/auth/register.component.js"
import { DashboardComponent } from "../components/dashboard/dashboard.component.js"
import { EventsComponent } from "../components/events/events.component.js"
import { AdminComponent } from "../components/admin/admin.component.js"
import { UIService } from "../services/ui.service.js"

/**
 * Router Class
 * Handles client-side routing for the SPA
 * Manages route protection, navigation, and component rendering
 */
export class Router {
  constructor() {
    this.routes = new Map()
    this.currentRoute = null
    this.currentComponent = null
    this.appContainer = document.getElementById("app")

    // Initialize routes
    this.initializeRoutes()
  }

  /**
   * Initialize all application routes
   */
  initializeRoutes() {
    // Public routes (accessible without authentication)
    this.addRoute("login", {
      component: LoginComponent,
      requiresAuth: false,
      title: "Login - EventHub",
    })

    this.addRoute("register", {
      component: RegisterComponent,
      requiresAuth: false,
      title: "Register - EventHub",
    })

    // Protected routes (require authentication)
    this.addRoute("dashboard", {
      component: DashboardComponent,
      requiresAuth: true,
      title: "Dashboard - EventHub",
    })

    this.addRoute("events", {
      component: EventsComponent,
      requiresAuth: true,
      title: "Events - EventHub",
    })

    // Admin-only routes
    this.addRoute("admin", {
      component: AdminComponent,
      requiresAuth: true,
      requiresAdmin: true,
      title: "Admin Panel - EventHub",
    })

    // Default route
    this.addRoute("", {
      redirect: "dashboard",
    })
  }

  /**
   * Add a route to the router
   * @param {string} path - Route path
   * @param {Object} config - Route configuration
   */
  addRoute(path, config) {
    this.routes.set(path, config)
  }

  /**
   * Initialize the router
   */
  initialize() {
    // Handle initial route
    this.handleRouteChange()

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      this.handleRouteChange()
    })
  }

  /**
   * Handle route changes
   */
  async handleRouteChange() {
    try {
      const hash = window.location.hash.slice(1) || ""
      const route = this.routes.get(hash)

      // Handle unknown routes
      if (!route) {
        this.navigate("dashboard")
        return
      }

      // Handle redirects
      if (route.redirect) {
        this.navigate(route.redirect)
        return
      }

      // Check authentication requirements
      if (route.requiresAuth && !AuthService.isAuthenticated()) {
        this.navigate("login")
        UIService.showToast("Please log in to access this page", "warning")
        return
      }

      // Check admin requirements
      if (route.requiresAdmin && !AuthService.isAdmin()) {
        this.navigate("dashboard")
        UIService.showToast("Access denied. Admin privileges required.", "error")
        return
      }

      // Check if user is logged in but trying to access auth pages
      if (!route.requiresAuth && AuthService.isAuthenticated() && ["login", "register"].includes(hash)) {
        this.navigate("dashboard")
        return
      }

      // Update page title
      if (route.title) {
        document.title = route.title
      }

      // Update active navigation
      this.updateActiveNavigation(hash)

      // Render the component
      await this.renderComponent(route.component, hash)
    } catch (error) {
      console.error("Route handling failed:", error)
      UIService.showToast("Navigation error occurred", "error")
    }
  }

  /**
   * Navigate to a specific route
   * @param {string} path - Route path to navigate to
   * @param {boolean} replace - Whether to replace current history entry
   */
  navigate(path, replace = false) {
    const url = path ? `#${path}` : "#"

    if (replace) {
      window.location.replace(url)
    } else {
      window.location.hash = path
    }
  }

  /**
   * Render a component
   * @param {Class} ComponentClass - Component class to render
   * @param {string} routePath - Current route path
   */
  async renderComponent(ComponentClass, routePath) {
    try {
      // Cleanup previous component
      if (this.currentComponent && typeof this.currentComponent.destroy === "function") {
        this.currentComponent.destroy()
      }

      // Clear app container
      this.appContainer.innerHTML = ""

      // Create and render new component
      this.currentComponent = new ComponentClass()
      this.currentRoute = routePath

      // Initialize component
      if (typeof this.currentComponent.initialize === "function") {
        await this.currentComponent.initialize()
      }

      // Render component
      const componentElement = await this.currentComponent.render()
      this.appContainer.appendChild(componentElement)

      // Add fade-in animation
      this.appContainer.classList.add("fade-in")

      console.log(`Rendered component for route: ${routePath}`)
    } catch (error) {
      console.error("Component rendering failed:", error)
      this.renderErrorPage(error)
    }
  }

  /**
   * Update active navigation links
   * @param {string} currentRoute - Current active route
   */
  updateActiveNavigation(currentRoute) {
    // Remove active class from all nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    // Add active class to current route link
    const activeLink = document.querySelector(`[data-route="${currentRoute}"]`)
    if (activeLink) {
      activeLink.classList.add("active")
    }
  }

  /**
   * Render error page
   * @param {Error} error - Error that occurred
   */
  renderErrorPage(error) {
    this.appContainer.innerHTML = `
            <div class="container py-8">
                <div class="card">
                    <div class="card-body text-center">
                        <h1 class="text-2xl font-bold text-error mb-4">Oops! Something went wrong</h1>
                        <p class="text-gray-600 mb-6">${error.message || "An unexpected error occurred"}</p>
                        <button onclick="window.location.reload()" class="btn btn-primary">
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        `
  }

  /**
   * Get current route
   * @returns {string} Current route path
   */
  getCurrentRoute() {
    return this.currentRoute
  }

  /**
   * Get current component
   * @returns {Object} Current component instance
   */
  getCurrentComponent() {
    return this.currentComponent
  }

  /**
   * Check if route exists
   * @param {string} path - Route path to check
   * @returns {boolean} True if route exists
   */
  hasRoute(path) {
    return this.routes.has(path)
  }

  /**
   * Go back in history
   */
  goBack() {
    window.history.back()
  }

  /**
   * Go forward in history
   */
  goForward() {
    window.history.forward()
  }
}
