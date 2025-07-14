// API Service - Handles all HTTP requests to the JSON server
/**
 * API Service
 * Centralized service for making HTTP requests to the JSON server
 * Includes error handling, request/response interceptors, and retry logic
 */
export class ApiService {
  static baseURL = "http://localhost:3001"
  static timeout = 10000 // 10 seconds
  static retryAttempts = 3

  /**
   * Make HTTP GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  static async get(endpoint, options = {}) {
    return this.request("GET", endpoint, null, options)
  }

  /**
   * Make HTTP POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  static async post(endpoint, data, options = {}) {
    return this.request("POST", endpoint, data, options)
  }

  /**
   * Make HTTP PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  static async put(endpoint, data, options = {}) {
    return this.request("PUT", endpoint, data, options)
  }

  /**
   * Make HTTP PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  static async patch(endpoint, data, options = {}) {
    return this.request("PATCH", endpoint, data, options)
  }

  /**
   * Make HTTP DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  static async delete(endpoint, options = {}) {
    return this.request("DELETE", endpoint, null, options)
  }

  /**
   * Generic request method with retry logic and error handling
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  static async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    let lastError

    // Retry logic
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const config = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        }

        // Add body for POST, PUT, PATCH requests
        if (data && ["POST", "PUT", "PATCH"].includes(method)) {
          config.body = JSON.stringify(data)
        }

        console.log(`API Request [Attempt ${attempt}]:`, method, url)

        const response = await fetch(url, config)
        clearTimeout(timeoutId)

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await response.text()
          let errorMessage

          try {
            const parsedError = JSON.parse(errorData)
            errorMessage = parsedError.message || parsedError.error || `HTTP ${response.status}`
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`
          }

          throw new Error(errorMessage)
        }

        // Parse response
        const responseData = await response.json()
        console.log("API Response:", responseData)

        return responseData
      } catch (error) {
        lastError = error
        console.error(`API Request failed [Attempt ${attempt}]:`, error.message)

        // Don't retry for certain errors
        if (error.name === "AbortError") {
          throw new Error("Request timeout")
        }

        if (error.message.includes("404") || error.message.includes("400")) {
          throw error
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.retryAttempts) {
          const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
          await this.delay(delay)
        }
      }
    }

    // All attempts failed
    throw new Error(`API request failed after ${this.retryAttempts} attempts: ${lastError.message}`)
  }

  /**
   * Utility method to create delay
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Check API health
   * @returns {Promise<boolean>} True if API is healthy
   */
  static async checkHealth() {
    try {
      await this.get("/users?_limit=1")
      return true
    } catch (error) {
      console.error("API health check failed:", error)
      return false
    }
  }

  /**
   * Get paginated results
   * @param {string} endpoint - API endpoint
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Paginated response
   */
  static async getPaginated(endpoint, page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        _page: page,
        _limit: limit,
        ...filters,
      })

      const response = await fetch(`${this.baseURL}${endpoint}?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const totalCount = Number.parseInt(response.headers.get("X-Total-Count") || "0")

      return {
        data,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      console.error("Paginated request failed:", error)
      throw error
    }
  }

  /**
   * Search resources
   * @param {string} endpoint - API endpoint
   * @param {string} query - Search query
   * @param {Array} fields - Fields to search in
   * @returns {Promise<Array>} Search results
   */
  static async search(endpoint, query, fields = []) {
    try {
      const params = new URLSearchParams()

      if (fields.length > 0) {
        fields.forEach((field) => {
          params.append(`${field}_like`, query)
        })
      } else {
        params.append("q", query)
      }

      return await this.get(`${endpoint}?${params}`)
    } catch (error) {
      console.error("Search request failed:", error)
      throw error
    }
  }
}
