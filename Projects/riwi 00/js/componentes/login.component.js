// Login Component - Handles user authentication interface
import { AuthService } from "../../services/auth.service.js"
import { ValidationService } from "../../services/validation.service.js"
import { UIService } from "../../services/ui.service.js"

/**
 * Login Component
 * Provides user authentication interface with form validation
 */
export class LoginComponent {
  constructor() {
    this.element = null
    this.form = null
    this.isLoading = false
  }

  /**
   * Initialize component
   */
  async initialize() {
    // Component initialization logic
    console.log("Login component initialized")
  }

  /**
   * Render login component
   * @returns {HTMLElement} Login component element
   */
  async render() {
    this.element = document.createElement("div")
    this.element.className = "login-container"
    this.element.innerHTML = this.getTemplate()

    // Setup event listeners
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
                <div class="grid grid-cols-1" style="max-width: 400px; margin: 0 auto;">
                    <div class="card">
                        <div class="card-header text-center">
                            <h1 class="text-3xl font-bold text-primary">Welcome Back</h1>
                            <p class="text-gray-600 mt-2">Sign in to your EventHub account</p>
                        </div>
                        <div class="card-body">
                            <form id="login-form" class="login-form">
                                <div class="form-group">
                                    <label for="username" class="form-label">Username or Email</label>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        class="form-input" 
                                        placeholder="Enter your username or email"
                                        required
                                        autocomplete="username"
                                    >
                                    <div class="form-error" id="username-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="password" class="form-label">Password</label>
                                    <div style="position: relative;">
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            class="form-input" 
                                            placeholder="Enter your password"
                                            required
                                            autocomplete="current-password"
                                        >
                                        <button 
                                            type="button" 
                                            id="toggle-password" 
                                            class="password-toggle"
                                            style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--gray-500);"
                                        >
                                            👁️
                                        </button>
                                    </div>
                                    <div class="form-error" id="password-error"></div>
                                </div>

                                <div class="form-group">
                                    <label class="flex items-center">
                                        <input type="checkbox" id="remember-me" name="rememberMe" class="mr-2">
                                        <span class="text-sm text-gray-600">Remember me</span>
                                    </label>
                                </div>

                                <button 
                                    type="submit" 
                                    id="login-btn" 
                                    class="btn btn-primary btn-lg w-full"
                                    style="width: 100%;"
                                >
                                    <span id="login-btn-text">Sign In</span>
                                    <div id="login-spinner" class="loading-spinner hidden" style="width: 20px; height: 20px; margin-left: 8px;"></div>
                                </button>
                            </form>

                            <div class="mt-6 text-center">
                                <p class="text-gray-600">
                                    Don't have an account? 
                                    <a href="#register" class="text-primary font-semibold hover:underline">Sign up here</a>
                                </p>
                            </div>

                            <div class="mt-6 pt-6 border-t border-gray-200">
                                <h3 class="text-lg font-semibold mb-3">Demo Accounts</h3>
                                <div class="grid grid-cols-1 gap-3">
                                    <div class="demo-account p-3 bg-gray-50 rounded-md">
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <strong>Administrator</strong>
                                                <div class="text-sm text-gray-600">Username: admin | Password: admin123</div>
                                            </div>
                                            <button type="button" class="btn btn-sm btn-outline demo-login" data-username="admin" data-password="admin123">
                                                Use
                                            </button>
                                        </div>
                                    </div>
                                    <div class="demo-account p-3 bg-gray-50 rounded-md">
                                        <div class="flex justify-between items-center">
                                            <div>
                                                <strong>Regular User</strong>
                                                <div class="text-sm text-gray-600">Username: user | Password: user123</div>
                                            </div>
                                            <button type="button" class="btn btn-sm btn-outline demo-login" data-username="user" data-password="user123">
                                                Use
                                            </button>
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
   * Setup event listeners
   */
  setupEventListeners() {
    this.form = this.element.querySelector("#login-form")
    const togglePasswordBtn = this.element.querySelector("#toggle-password")
    const demoLoginBtns = this.element.querySelectorAll(".demo-login")

    // Form submission
    this.form.addEventListener("submit", this.handleSubmit.bind(this))

    // Real-time validation
    const inputs = this.form.querySelectorAll("input[required]")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input))
    })

    // Password toggle
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener("click", this.togglePassword.bind(this))
    }

    // Demo login buttons
    demoLoginBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleDemoLogin.bind(this))
    })
  }

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  async handleSubmit(event) {
    event.preventDefault()

    if (this.isLoading) return

    const formData = new FormData(this.form)
    const loginData = {
      username: formData.get("username").trim(),
      password: formData.get("password"),
    }

    // Validate form
    if (!this.validateForm(loginData)) {
      return
    }

    try {
      this.setLoadingState(true)

      // Attempt login
      const user = await AuthService.login(loginData.username, loginData.password)

      // Update app state
      const app = window.app
      if (app) {
        app.setCurrentUser(user)
      }

      // Show success message
      UIService.showToast(`Welcome back, ${user.firstName}!`, "success")

      // Navigate to dashboard
      window.location.hash = "dashboard"
    } catch (error) {
      console.error("Login failed:", error)
      UIService.showToast(error.message || "Login failed", "error")

      // Focus on username field for retry
      this.form.querySelector("#username").focus()
    } finally {
      this.setLoadingState(false)
    }
  }

  /**
   * Handle demo login
   * @param {Event} event - Click event
   */
  async handleDemoLogin(event) {
    const button = event.target
    const username = button.getAttribute("data-username")
    const password = button.getAttribute("data-password")

    // Fill form with demo credentials
    this.form.querySelector("#username").value = username
    this.form.querySelector("#password").value = password

    // Submit form
    this.form.dispatchEvent(new Event("submit"))
  }

  /**
   * Toggle password visibility
   */
  togglePassword() {
    const passwordInput = this.element.querySelector("#password")
    const toggleBtn = this.element.querySelector("#toggle-password")

    if (passwordInput.type === "password") {
      passwordInput.type = "text"
      toggleBtn.textContent = "🙈"
    } else {
      passwordInput.type = "password"
      toggleBtn.textContent = "👁️"
    }
  }

  /**
   * Validate entire form
   * @param {Object} data - Form data
   * @returns {boolean} True if form is valid
   */
  validateForm(data) {
    const validation = ValidationService.validateLoginForm(data)

    if (!validation.isValid) {
      // Show first error
      UIService.showToast(validation.errors[0], "error")

      // Highlight fields with errors
      if (validation.errors.some((error) => error.includes("Username"))) {
        this.showFieldError(
          "username",
          validation.errors.find((error) => error.includes("Username")),
        )
      }

      if (validation.errors.some((error) => error.includes("Password"))) {
        this.showFieldError(
          "password",
          validation.errors.find((error) => error.includes("Password")),
        )
      }

      return false
    }

    return true
  }

  /**
   * Validate individual field
   * @param {HTMLElement} field - Input field to validate
   */
  validateField(field) {
    const value = field.value.trim()
    const fieldName = field.name

    this.clearFieldError(field)

    if (fieldName === "username") {
      if (!value) {
        this.showFieldError(fieldName, "Username or email is required")
      } else if (value.length < 3) {
        this.showFieldError(fieldName, "Username must be at least 3 characters long")
      }
    } else if (fieldName === "password") {
      if (!value) {
        this.showFieldError(fieldName, "Password is required")
      } else if (value.length < 6) {
        this.showFieldError(fieldName, "Password must be at least 6 characters long")
      }
    }
  }

  /**
   * Show field error
   * @param {string} fieldName - Field name
   * @param {string} message - Error message
   */
  showFieldError(fieldName, message) {
    const field = this.element.querySelector(`[name="${fieldName}"]`)
    const errorElement = this.element.querySelector(`#${fieldName}-error`)

    if (field && errorElement) {
      field.classList.add("error")
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
  }

  /**
   * Clear field error
   * @param {HTMLElement} field - Input field
   */
  clearFieldError(field) {
    const fieldName = field.name
    const errorElement = this.element.querySelector(`#${fieldName}-error`)

    field.classList.remove("error")
    if (errorElement) {
      errorElement.textContent = ""
      errorElement.style.display = "none"
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoadingState(loading) {
    this.isLoading = loading
    const submitBtn = this.element.querySelector("#login-btn")
    const btnText = this.element.querySelector("#login-btn-text")
    const spinner = this.element.querySelector("#login-spinner")

    if (loading) {
      submitBtn.disabled = true
      btnText.textContent = "Signing In..."
      spinner.classList.remove("hidden")
    } else {
      submitBtn.disabled = false
      btnText.textContent = "Sign In"
      spinner.classList.add("hidden")
    }
  }

  /**
   * Cleanup component
   */
  destroy() {
    if (this.element) {
      // Remove event listeners
      const form = this.element.querySelector("#login-form")
      if (form) {
        form.removeEventListener("submit", this.handleSubmit)
      }

      // Clear element
      this.element = null
      this.form = null
    }
  }
}
