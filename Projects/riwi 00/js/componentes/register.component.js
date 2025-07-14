// Register Component - Handles user registration interface
import { AuthService } from "../../services/auth.service.js"
import { ValidationService } from "../../services/validation.service.js"
import { UIService } from "../../services/ui.service.js"

/**
 * Register Component
 * Provides user registration interface with comprehensive validation
 */
export class RegisterComponent {
  constructor() {
    this.element = null
    this.form = null
    this.isLoading = false
    this.passwordStrength = 0
  }

  /**
   * Initialize component
   */
  async initialize() {
    console.log("Register component initialized")
  }

  /**
   * Render register component
   * @returns {HTMLElement} Register component element
   */
  async render() {
    this.element = document.createElement("div")
    this.element.className = "register-container"
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
                <div class="grid grid-cols-1" style="max-width: 500px; margin: 0 auto;">
                    <div class="card">
                        <div class="card-header text-center">
                            <h1 class="text-3xl font-bold text-primary">Create Account</h1>
                            <p class="text-gray-600 mt-2">Join EventHub and start discovering amazing events</p>
                        </div>
                        <div class="card-body">
                            <form id="register-form" class="register-form">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="form-group">
                                        <label for="firstName" class="form-label">First Name</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            name="firstName" 
                                            class="form-input" 
                                            placeholder="Enter your first name"
                                            required
                                            autocomplete="given-name"
                                        >
                                        <div class="form-error" id="firstName-error"></div>
                                    </div>

                                    <div class="form-group">
                                        <label for="lastName" class="form-label">Last Name</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            name="lastName" 
                                            class="form-input" 
                                            placeholder="Enter your last name"
                                            required
                                            autocomplete="family-name"
                                        >
                                        <div class="form-error" id="lastName-error"></div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="username" class="form-label">Username</label>
                                    <input 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        class="form-input" 
                                        placeholder="Choose a unique username"
                                        required
                                        autocomplete="username"
                                    >
                                    <div class="form-error" id="username-error"></div>
                                    <div class="text-sm text-gray-500 mt-1">
                                        Username must be 3-20 characters long and contain only letters, numbers, and underscores
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        class="form-input" 
                                        placeholder="Enter your email address"
                                        required
                                        autocomplete="email"
                                    >
                                    <div class="form-error" id="email-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="password" class="form-label">Password</label>
                                    <div style="position: relative;">
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password" 
                                            class="form-input" 
                                            placeholder="Create a strong password"
                                            required
                                            autocomplete="new-password"
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
                                    
                                    <!-- Password Strength Indicator -->
                                    <div class="password-strength mt-2">
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="text-sm text-gray-600">Password Strength:</span>
                                            <span id="strength-text" class="text-sm font-medium">Weak</span>
                                        </div>
                                        <div class="strength-bar bg-gray-200 rounded-full h-2">
                                            <div id="strength-fill" class="strength-fill h-2 rounded-full transition-all duration-300" style="width: 0%; background-color: #ef4444;"></div>
                                        </div>
                                        <div id="password-suggestions" class="text-xs text-gray-500 mt-1"></div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        class="form-input" 
                                        placeholder="Confirm your password"
                                        required
                                        autocomplete="new-password"
                                    >
                                    <div class="form-error" id="confirmPassword-error"></div>
                                </div>

                                <div class="form-group">
                                    <label class="flex items-start">
                                        <input type="checkbox" id="terms" name="terms" class="mr-2 mt-1" required>
                                        <span class="text-sm text-gray-600">
                                            I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a> 
                                            and <a href="#" class="text-primary hover:underline">Privacy Policy</a>
                                        </span>
                                    </label>
                                    <div class="form-error" id="terms-error"></div>
                                </div>

                                <button 
                                    type="submit" 
                                    id="register-btn" 
                                    class="btn btn-primary btn-lg"
                                    style="width: 100%;"
                                >
                                    <span id="register-btn-text">Create Account</span>
                                    <div id="register-spinner" class="loading-spinner hidden" style="width: 20px; height: 20px; margin-left: 8px;"></div>
                                </button>
                            </form>

                            <div class="mt-6 text-center">
                                <p class="text-gray-600">
                                    Already have an account? 
                                    <a href="#login" class="text-primary font-semibold hover:underline">Sign in here</a>
                                </p>
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
    this.form = this.element.querySelector("#register-form")
    const togglePasswordBtn = this.element.querySelector("#toggle-password")
    const passwordInput = this.element.querySelector("#password")

    // Form submission
    this.form.addEventListener("submit", this.handleSubmit.bind(this))

    // Real-time validation
    const inputs = this.form.querySelectorAll("input[required]")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => {
        this.clearFieldError(input)
        if (input.name === "password") {
          this.updatePasswordStrength(input.value)
        }
      })
    })

    // Password toggle
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener("click", this.togglePassword.bind(this))
    }

    // Password strength checking
    if (passwordInput) {
      passwordInput.addEventListener("input", (e) => {
        this.updatePasswordStrength(e.target.value)
      })
    }
  }

  /**
   * Handle form submission
   * @param {Event} event - Form submit event
   */
  async handleSubmit(event) {
    event.preventDefault()

    if (this.isLoading) return

    const formData = new FormData(this.form)
    const registerData = {
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      username: formData.get("username").trim(),
      email: formData.get("email").trim(),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      terms: formData.get("terms"),
    }

    // Validate form
    if (!this.validateForm(registerData)) {
      return
    }

    try {
      this.setLoadingState(true)

      // Attempt registration
      const user = await AuthService.register(registerData)

      // Auto-login after successful registration
      const loginUser = await AuthService.login(registerData.username, registerData.password)

      // Update app state
      const app = window.app
      if (app) {
        app.setCurrentUser(loginUser)
      }

      // Show success message
      UIService.showToast(`Welcome to EventHub, ${user.firstName}!`, "success")

      // Navigate to dashboard
      window.location.hash = "dashboard"
    } catch (error) {
      console.error("Registration failed:", error)
      UIService.showToast(error.message || "Registration failed", "error")
    } finally {
      this.setLoadingState(false)
    }
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
   * Update password strength indicator
   * @param {string} password - Password to check
   */
  updatePasswordStrength(password) {
    const strengthResult = ValidationService.validatePassword(password)
    const strengthFill = this.element.querySelector("#strength-fill")
    const strengthText = this.element.querySelector("#strength-text")
    const suggestions = this.element.querySelector("#password-suggestions")

    this.passwordStrength = strengthResult.strength

    // Update strength bar
    const percentage = (strengthResult.strength / 5) * 100
    strengthFill.style.width = `${percentage}%`

    // Update colors and text
    if (strengthResult.strength <= 1) {
      strengthFill.style.backgroundColor = "#ef4444" // Red
      strengthText.textContent = "Weak"
      strengthText.className = "text-sm font-medium text-error"
    } else if (strengthResult.strength <= 2) {
      strengthFill.style.backgroundColor = "#f59e0b" // Orange
      strengthText.textContent = "Fair"
      strengthText.className = "text-sm font-medium text-warning"
    } else if (strengthResult.strength <= 3) {
      strengthFill.style.backgroundColor = "#eab308" // Yellow
      strengthText.textContent = "Good"
      strengthText.className = "text-sm font-medium text-warning"
    } else if (strengthResult.strength <= 4) {
      strengthFill.style.backgroundColor = "#22c55e" // Green
      strengthText.textContent = "Strong"
      strengthText.className = "text-sm font-medium text-success"
    } else {
      strengthFill.style.backgroundColor = "#10b981" // Dark Green
      strengthText.textContent = "Very Strong"
      strengthText.className = "text-sm font-medium text-success"
    }

    // Show suggestions
    if (strengthResult.errors && strengthResult.errors.length > 0) {
      suggestions.textContent = strengthResult.errors.slice(0, 2).join(", ")
    } else {
      suggestions.textContent = "Password meets all requirements"
    }
  }

  /**
   * Validate entire form
   * @param {Object} data - Form data
   * @returns {boolean} True if form is valid
   */
  validateForm(data) {
    const validation = ValidationService.validateRegistrationForm(data)

    if (!validation.isValid) {
      // Show first error
      UIService.showToast(validation.errors[0], "error")

      // Highlight fields with errors
      validation.errors.forEach((error) => {
        if (error.includes("First name")) {
          this.showFieldError("firstName", error)
        } else if (error.includes("Last name")) {
          this.showFieldError("lastName", error)
        } else if (error.includes("Username")) {
          this.showFieldError("username", error)
        } else if (error.includes("Email")) {
          this.showFieldError("email", error)
        } else if (error.includes("Password")) {
          this.showFieldError("password", error)
        } else if (error.includes("match")) {
          this.showFieldError("confirmPassword", error)
        }
      })

      return false
    }

    // Check terms acceptance
    if (!data.terms) {
      this.showFieldError("terms", "You must accept the terms and conditions")
      UIService.showToast("Please accept the terms and conditions", "error")
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

    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (!value) {
          this.showFieldError(fieldName, `${fieldName === "firstName" ? "First" : "Last"} name is required`)
        } else if (value.length < 2) {
          this.showFieldError(
            fieldName,
            `${fieldName === "firstName" ? "First" : "Last"} name must be at least 2 characters long`,
          )
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          this.showFieldError(
            fieldName,
            `${fieldName === "firstName" ? "First" : "Last"} name can only contain letters and spaces`,
          )
        }
        break

      case "username":
        if (!value) {
          this.showFieldError(fieldName, "Username is required")
        } else if (value.length < 3) {
          this.showFieldError(fieldName, "Username must be at least 3 characters long")
        } else if (value.length > 20) {
          this.showFieldError(fieldName, "Username must be less than 20 characters long")
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          this.showFieldError(fieldName, "Username can only contain letters, numbers, and underscores")
        }
        break

      case "email":
        if (!value) {
          this.showFieldError(fieldName, "Email is required")
        } else if (!ValidationService.isValidEmail(value)) {
          this.showFieldError(fieldName, "Please enter a valid email address")
        }
        break

      case "password":
        const passwordValidation = ValidationService.validatePassword(value)
        if (!passwordValidation.isValid) {
          this.showFieldError(fieldName, passwordValidation.errors[0])
        }
        break

      case "confirmPassword":
        const password = this.form.querySelector("#password").value
        if (!value) {
          this.showFieldError(fieldName, "Password confirmation is required")
        } else if (value !== password) {
          this.showFieldError(fieldName, "Passwords do not match")
        }
        break
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
    const submitBtn = this.element.querySelector("#register-btn")
    const btnText = this.element.querySelector("#register-btn-text")
    const spinner = this.element.querySelector("#register-spinner")

    if (loading) {
      submitBtn.disabled = true
      btnText.textContent = "Creating Account..."
      spinner.classList.remove("hidden")
    } else {
      submitBtn.disabled = false
      btnText.textContent = "Create Account"
      spinner.classList.add("hidden")
    }
  }

  /**
   * Cleanup component
   */
  destroy() {
    if (this.element) {
      this.element = null
      this.form = null
    }
  }
}
