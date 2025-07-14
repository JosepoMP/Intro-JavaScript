// Validation Service - Handles all form and data validation
/**
 * Validation Service
 * Provides comprehensive validation for forms, user input, and data integrity
 * Includes both client-side validation and business logic validation
 */
export class ValidationService {
  /**
   * Validate login form data
   * @param {Object} data - Login form data
   * @returns {Object} Validation result
   */
  static validateLoginForm(data) {
    const errors = []

    // Username/Email validation
    if (!data.username || data.username.trim().length === 0) {
      errors.push("Username or email is required")
    } else if (data.username.trim().length < 3) {
      errors.push("Username must be at least 3 characters long")
    }

    // Password validation
    if (!data.password || data.password.length === 0) {
      errors.push("Password is required")
    } else if (data.password.length < 6) {
      errors.push("Password must be at least 6 characters long")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate registration form data
   * @param {Object} data - Registration form data
   * @returns {Object} Validation result
   */
  static validateRegistrationForm(data) {
    const errors = []

    // First name validation
    if (!data.firstName || data.firstName.trim().length === 0) {
      errors.push("First name is required")
    } else if (data.firstName.trim().length < 2) {
      errors.push("First name must be at least 2 characters long")
    } else if (!/^[a-zA-Z\s]+$/.test(data.firstName.trim())) {
      errors.push("First name can only contain letters and spaces")
    }

    // Last name validation
    if (!data.lastName || data.lastName.trim().length === 0) {
      errors.push("Last name is required")
    } else if (data.lastName.trim().length < 2) {
      errors.push("Last name must be at least 2 characters long")
    } else if (!/^[a-zA-Z\s]+$/.test(data.lastName.trim())) {
      errors.push("Last name can only contain letters and spaces")
    }

    // Username validation
    if (!data.username || data.username.trim().length === 0) {
      errors.push("Username is required")
    } else if (data.username.trim().length < 3) {
      errors.push("Username must be at least 3 characters long")
    } else if (data.username.trim().length > 20) {
      errors.push("Username must be less than 20 characters long")
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username.trim())) {
      errors.push("Username can only contain letters, numbers, and underscores")
    }

    // Email validation
    if (!data.email || data.email.trim().length === 0) {
      errors.push("Email is required")
    } else if (!this.isValidEmail(data.email.trim())) {
      errors.push("Please enter a valid email address")
    }

    // Password validation
    if (!data.password || data.password.length === 0) {
      errors.push("Password is required")
    } else {
      const passwordValidation = this.validatePassword(data.password)
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors)
      }
    }

    // Confirm password validation
    if (!data.confirmPassword || data.confirmPassword.length === 0) {
      errors.push("Password confirmation is required")
    } else if (data.password !== data.confirmPassword) {
      errors.push("Passwords do not match")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate event form data
   * @param {Object} data - Event form data
   * @returns {Object} Validation result
   */
  static validateEventForm(data) {
    const errors = []

    // Title validation
    if (!data.title || data.title.trim().length === 0) {
      errors.push("Event title is required")
    } else if (data.title.trim().length < 5) {
      errors.push("Event title must be at least 5 characters long")
    } else if (data.title.trim().length > 100) {
      errors.push("Event title must be less than 100 characters long")
    }

    // Description validation
    if (!data.description || data.description.trim().length === 0) {
      errors.push("Event description is required")
    } else if (data.description.trim().length < 20) {
      errors.push("Event description must be at least 20 characters long")
    } else if (data.description.trim().length > 1000) {
      errors.push("Event description must be less than 1000 characters long")
    }

    // Date validation
    if (!data.date || data.date.trim().length === 0) {
      errors.push("Event date is required")
    } else {
      const eventDate = new Date(data.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (isNaN(eventDate.getTime())) {
        errors.push("Please enter a valid date")
      } else if (eventDate < today) {
        errors.push("Event date cannot be in the past")
      }
    }

    // Time validation
    if (!data.time || data.time.trim().length === 0) {
      errors.push("Event time is required")
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
      errors.push("Please enter a valid time (HH:MM format)")
    }

    // Location validation
    if (!data.location || data.location.trim().length === 0) {
      errors.push("Event location is required")
    } else if (data.location.trim().length < 5) {
      errors.push("Event location must be at least 5 characters long")
    } else if (data.location.trim().length > 200) {
      errors.push("Event location must be less than 200 characters long")
    }

    // Capacity validation
    if (!data.capacity || data.capacity.toString().trim().length === 0) {
      errors.push("Event capacity is required")
    } else {
      const capacity = Number.parseInt(data.capacity)
      if (isNaN(capacity) || capacity <= 0) {
        errors.push("Event capacity must be a positive number")
      } else if (capacity > 10000) {
        errors.push("Event capacity cannot exceed 10,000")
      }
    }

    // Category validation
    if (!data.category || data.category.trim().length === 0) {
      errors.push("Event category is required")
    }

    // Price validation
    if (data.price !== undefined && data.price !== null && data.price.toString().trim().length > 0) {
      const price = Number.parseFloat(data.price)
      if (isNaN(price) || price < 0) {
        errors.push("Event price must be a non-negative number")
      } else if (price > 10000) {
        errors.push("Event price cannot exceed $10,000")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate profile update data
   * @param {Object} data - Profile update data
   * @returns {Object} Validation result
   */
  static validateProfileUpdate(data) {
    const errors = []

    // First name validation (if provided)
    if (data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim().length === 0) {
        errors.push("First name cannot be empty")
      } else if (data.firstName.trim().length < 2) {
        errors.push("First name must be at least 2 characters long")
      } else if (!/^[a-zA-Z\s]+$/.test(data.firstName.trim())) {
        errors.push("First name can only contain letters and spaces")
      }
    }

    // Last name validation (if provided)
    if (data.lastName !== undefined) {
      if (!data.lastName || data.lastName.trim().length === 0) {
        errors.push("Last name cannot be empty")
      } else if (data.lastName.trim().length < 2) {
        errors.push("Last name must be at least 2 characters long")
      } else if (!/^[a-zA-Z\s]+$/.test(data.lastName.trim())) {
        errors.push("Last name can only contain letters and spaces")
      }
    }

    // Email validation (if provided)
    if (data.email !== undefined) {
      if (!data.email || data.email.trim().length === 0) {
        errors.push("Email cannot be empty")
      } else if (!this.isValidEmail(data.email.trim())) {
        errors.push("Please enter a valid email address")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with strength score
   */
  static validatePassword(password) {
    const errors = []
    let strength = 0

    if (!password || password.length === 0) {
      errors.push("Password is required")
      return { isValid: false, errors, strength: 0 }
    }

    // Length check
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    } else {
      strength += 1
    }

    // Uppercase letter check
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    } else {
      strength += 1
    }

    // Lowercase letter check
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    } else {
      strength += 1
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number")
    } else {
      strength += 1
    }

    // Special character check
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("Password must contain at least one special character")
    } else {
      strength += 1
    }

    // Common password check
    const commonPasswords = ["password", "123456", "qwerty", "abc123", "password123"]
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Please choose a less common password")
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: Math.min(strength, 5), // Max strength of 5
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate date format and range
   * @param {string} date - Date string to validate
   * @param {boolean} allowPast - Whether to allow past dates
   * @returns {Object} Validation result
   */
  static validateDate(date, allowPast = false) {
    const errors = []

    if (!date || date.trim().length === 0) {
      errors.push("Date is required")
      return { isValid: false, errors }
    }

    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
      errors.push("Please enter a valid date")
      return { isValid: false, errors }
    }

    if (!allowPast) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dateObj < today) {
        errors.push("Date cannot be in the past")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Sanitize HTML input to prevent XSS
   * @param {string} input - Input string to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeHtml(input) {
    if (typeof input !== "string") return input

    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  }

  /**
   * Validate and sanitize form data
   * @param {Object} data - Form data to validate and sanitize
   * @param {Array} stringFields - Fields that should be sanitized
   * @returns {Object} Sanitized data
   */
  static sanitizeFormData(data, stringFields = []) {
    const sanitized = { ...data }

    stringFields.forEach((field) => {
      if (sanitized[field] && typeof sanitized[field] === "string") {
        sanitized[field] = this.sanitizeHtml(sanitized[field].trim())
      }
    })

    return sanitized
  }

  /**
   * Validate file upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  static validateFile(file, options = {}) {
    const errors = []
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ["image/jpeg", "image/png", "image/gif"],
      required = false,
    } = options

    if (required && !file) {
      errors.push("File is required")
      return { isValid: false, errors }
    }

    if (file) {
      // Size validation
      if (file.size > maxSize) {
        errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      }

      // Type validation
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File type must be one of: ${allowedTypes.join(", ")}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
