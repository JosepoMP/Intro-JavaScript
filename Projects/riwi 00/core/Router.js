/**
 * Advanced SPA Router with route protection and dynamic loading
 * Handles client-side routing with authentication guards
 */
export class Router {
  constructor() {
    this.routes = new Map()
    this.currentRoute = null
    this.services = {}
    this.middlewares = []

    // Define application routes
    this.defineRoutes()
  }

  /**
   * Set service dependencies
   */
  setServices(services) {
    this.services = services
  }

  /**
   * Define all application routes with their configurations
   */
  defineRoutes() {
    // Public routes
    this.addRoute("home", {
      path: "/",
      component: () => import("../pages/HomePage.js"),
      title: "Home - Event Management",
      requiresAuth: false,
    })

    this.addRoute("events", {
      path: "/events",
      component: () => import("../pages/EventsPage.js"),
      title: "Events - Event Management",
      requiresAuth: false,
    })

    this.addRoute("login", {
      path: "/login",
      component: () => import("../pages/LoginPage.js"),
      title: "Login - Event Management",
      requiresAuth: false,
      redirectIfAuth: "dashboard",
    })

    this.addRoute("register", {
      path: "/register",
      component: () => import("../pages/RegisterPage.js"),
      title: "Register - Event Management",
      requiresAuth: false,
      redirectIfAuth: "dashboard",
    })

    // Protected routes
    this.addRoute("dashboard", {
      path: "/dashboard",
      component: () => import("../pages/DashboardPage.js"),
      title: "Dashboard - Event Management",
      requiresAuth: true,
    })

    this.addRoute("profile", {
      path: "/profile",
      component: () => import("../pages/ProfilePage.js"),
      title: "Profile - Event Management",
      requiresAuth: true,
    })

    this.addRoute("settings", {
      path: "/settings",
      component: () => import("../pages/SettingsPage.js"),
      title: "Settings - Event Management",
      requiresAuth: true,
    })

    // Admin-only routes
    this.addRoute("admin", {
      path: "/admin",
      component: () => import("../pages/AdminPage.js"),
      title: "Admin Panel - Event Management",
      requiresAuth: true,
      requiresRole: "admin",
    })

    // 404 route
    this.addRoute("404", {
      path: "/404",
      component: () => import("../pages/NotFoundPage.js"),
      title: "Page Not Found - Event Management",
      requiresAuth: false,
    })
  }

  /**
   * Add a route to the router
   */
  addRoute(name, config) {
    this.routes.set(name, config)
  }

  /**
   * Add middleware to the router
   */
  addMiddleware(middleware) {
    this.middlewares.push(middleware)
  }

  /**
   * Initialize the router
   */
  async init() {
    // Get initial route from URL
    const initialRoute = this.getRouteFromURL()
    await this.navigate(initialRoute || "home")
  }

  /**
   * Navigate to a specific route
   */
  async navigate(routeName, params = {}) {
    try {
      const route = this.routes.get(routeName)

      if (!route) {
        console.warn(`Route '${routeName}' not found, redirecting to 404`)
        return this.navigate("404")
      }

      // Run middleware
      for (const middleware of this.middlewares) {
        const result = await middleware(route, params)
        if (result === false) {
          return // Middleware blocked navigation
        }
      }

      // Check authentication requirements
      const authCheck = this.checkAuthRequirements(route)
      if (authCheck !== true) {
        return this.navigate(authCheck)
      }

      // Show loading state
      this.services.ui?.showLoading()

      // Load and render the component
      await this.loadRoute(route, params)

      // Update browser history and URL
      this.updateURL(route, routeName)

      // Update page title
      document.title = route.title

      // Update navigation active states
      this.updateNavigationState(routeName)

      // Hide loading state
      this.services.ui?.hideLoading()

      this.currentRoute = routeName

      console.log(`✅ Navigated to route: ${routeName}`)
    } catch (error) {
      console.error(`❌ Navigation error for route '${routeName}':`, error)
      this.services.ui?.hideLoading()
      this.services.ui?.showToast("Navigation failed", "error")
    }
  }

  /**
   * Check authentication and authorization requirements
   */
  checkAuthRequirements(route) {
    const user = this.services.auth?.getCurrentUser()

    // If route requires authentication and user is not logged in
    if (route.requiresAuth && !user) {
      this.services.ui?.showToast("Please log in to access this page", "warning")
      return "login"
    }

    // If route redirects authenticated users and user is logged in
    if (route.redirectIfAuth && user) {
      return route.redirectIfAuth
    }

    // If route requires specific role
    if (route.requiresRole && (!user || user.role !== route.requiresRole)) {
      this.services.ui?.showToast("Access denied: insufficient permissions", "error")
      return user ? "dashboard" : "login"
    }

    return true
  }

  /**
   * Load and render a route component
   */
  async loadRoute(route, params) {
    try {
      // Dynamic import of the component
      const module = await route.component()
      const Component = module.default

      // Create component instance with dependencies
      const component = new Component({
        services: this.services,
        params: params,
      })

      // Render the component
      const mainContent = document.getElementById("main-content")
      if (mainContent) {
        mainContent.innerHTML = ""
        await component.render(mainContent)
      }
    } catch (error) {
      console.error("Error loading route component:", error)
      throw error
    }
  }

  /**
   * Update browser URL without page reload
   */
  updateURL(route, routeName) {
    const url = route.path
    if (window.location.pathname !== url) {
      window.history.pushState({ route: routeName }, route.title, url)
    }
  }

  /**
   * Update navigation active states
   */
  updateNavigationState(routeName) {
    // Remove active class from all nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    // Add active class to current route link
    const activeLink = document.querySelector(`[data-route="${routeName}"]`)
    if (activeLink) {
      activeLink.classList.add("active")
    }
  }

  /**
   * Get route name from current URL
   */
  getRouteFromURL() {
    const path = window.location.pathname

    for (const [name, route] of this.routes) {
      if (route.path === path) {
        return name
      }
    }

    return null
  }

  /**
   * Handle browser back/forward navigation
   */
  async handlePopState() {
    const routeName = this.getRouteFromURL()
    if (routeName && routeName !== this.currentRoute) {
      await this.navigate(routeName)
    }
  }

  /**
   * Get current route information
   */
  getCurrentRoute() {
    return {
      name: this.currentRoute,
      config: this.routes.get(this.currentRoute),
    }
  }

  /**
   * Check if a route exists
   */
  hasRoute(routeName) {
    return this.routes.has(routeName)
  }

  /**
   * Get all available routes
   */
  getRoutes() {
    return Array.from(this.routes.entries()).map(([name, config]) => ({
      name,
      ...config,
    }))
  }
}
