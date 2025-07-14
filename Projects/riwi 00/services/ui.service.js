// UI Service - Handles UI interactions, notifications, and modals
/**
 * UI Service
 * Manages user interface interactions, notifications, modals, and dynamic content
 * Provides a centralized way to handle UI state and user feedback
 */
export class UIService {
  static toastContainer = null
  static modalContainer = null
  static activeModals = []
  static toastQueue = []
  static isInitialized = false

  /**
   * Initialize UI Service
   */
  static initialize() {
    if (this.isInitialized) return

    this.toastContainer = document.getElementById("toast-container")
    this.modalContainer = document.getElementById("modal-container")

    // Setup global event listeners
    this.setupGlobalEventListeners()

    this.isInitialized = true
    console.log("UI Service initialized")
  }

  /**
   * Setup global event listeners
   */
  static setupGlobalEventListeners() {
    // Close modals on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModals.length > 0) {
        this.closeTopModal()
      }
    })

    // Close modals on backdrop click
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        this.closeTopModal()
      }
    })
  }

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   */
  static showToast(message, type = "info", duration = 5000) {
    if (!this.toastContainer) {
      console.warn("Toast container not found")
      return
    }

    const toast = this.createToastElement(message, type)
    this.toastContainer.appendChild(toast)

    // Auto remove toast
    setTimeout(() => {
      this.removeToast(toast)
    }, duration)

    // Add click to dismiss
    toast.addEventListener("click", () => {
      this.removeToast(toast)
    })

    console.log(`Toast shown: ${type} - ${message}`)
  }

  /**
   * Create toast element
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   * @returns {HTMLElement} Toast element
   */
  static createToastElement(message, type) {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${this.escapeHtml(message)}</span>
                <button style="background: none; border: none; color: inherit; font-size: 1.2em; cursor: pointer; margin-left: 1rem;">&times;</button>
            </div>
        `

    // Add close button functionality
    const closeBtn = toast.querySelector("button")
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      this.removeToast(toast)
    })

    return toast
  }

  /**
   * Remove toast element
   * @param {HTMLElement} toast - Toast element to remove
   */
  static removeToast(toast) {
    if (toast && toast.parentNode) {
      toast.style.opacity = "0"
      toast.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }
  }

  /**
   * Show modal dialog
   * @param {Object} options - Modal options
   * @returns {Promise} Promise that resolves with modal result
   */
  static showModal(options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const modal = this.createModalElement(options, resolve, reject)
        this.modalContainer.appendChild(modal)
        this.activeModals.push({ element: modal, resolve, reject })

        // Focus management
        setTimeout(() => {
          const firstInput = modal.querySelector("input, button, select, textarea")
          if (firstInput) {
            firstInput.focus()
          }
        }, 100)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Create modal element
   * @param {Object} options - Modal options
   * @param {Function} resolve - Promise resolve function
   * @param {Function} reject - Promise reject function
   * @returns {HTMLElement} Modal element
   */
  static createModalElement(options, resolve, reject) {
    const {
      title = "Modal",
      content = "",
      buttons = [{ text: "OK", primary: true }],
      size = "medium",
      closable = true,
    } = options

    const overlay = document.createElement("div")
    overlay.className = "modal-overlay"

    const modal = document.createElement("div")
    modal.className = `modal modal-${size}`

    const header = document.createElement("div")
    header.className = "modal-header"
    header.innerHTML = `
            <h3 class="modal-title">${this.escapeHtml(title)}</h3>
            ${closable ? '<button class="modal-close">&times;</button>' : ""}
        `

    const body = document.createElement("div")
    body.className = "modal-body"

    if (typeof content === "string") {
      body.innerHTML = content
    } else if (content instanceof HTMLElement) {
      body.appendChild(content)
    }

    const footer = document.createElement("div")
    footer.className = "modal-footer"

    // Create buttons
    buttons.forEach((button, index) => {
      const btn = document.createElement("button")
      btn.className = `btn ${button.primary ? "btn-primary" : "btn-secondary"}`
      btn.textContent = button.text
      btn.addEventListener("click", () => {
        const result = button.value !== undefined ? button.value : index
        this.closeModal(overlay)
        resolve(result)
      })
      footer.appendChild(btn)
    })

    // Close button functionality
    if (closable) {
      const closeBtn = header.querySelector(".modal-close")
      closeBtn.addEventListener("click", () => {
        this.closeModal(overlay)
        resolve(null)
      })
    }

    modal.appendChild(header)
    modal.appendChild(body)
    modal.appendChild(footer)
    overlay.appendChild(modal)

    return overlay
  }

  /**
   * Close specific modal
   * @param {HTMLElement} modalElement - Modal element to close
   */
  static closeModal(modalElement) {
    if (modalElement && modalElement.parentNode) {
      modalElement.style.opacity = "0"
      setTimeout(() => {
        if (modalElement.parentNode) {
          modalElement.parentNode.removeChild(modalElement)
        }
      }, 200)

      // Remove from active modals
      this.activeModals = this.activeModals.filter((modal) => modal.element !== modalElement)
    }
  }

  /**
   * Close the topmost modal
   */
  static closeTopModal() {
    if (this.activeModals.length > 0) {
      const topModal = this.activeModals[this.activeModals.length - 1]
      this.closeModal(topModal.element)
      topModal.resolve(null)
    }
  }

  /**
   * Close all modals
   */
  static closeAllModals() {
    this.activeModals.forEach((modal) => {
      this.closeModal(modal.element)
      modal.resolve(null)
    })
    this.activeModals = []
  }

  /**
   * Show confirmation dialog
   * @param {string} message - Confirmation message
   * @param {string} title - Dialog title
   * @returns {Promise<boolean>} True if confirmed, false if cancelled
   */
  static showConfirmation(message, title = "Confirm Action") {
    return this.showModal({
      title,
      content: `<p>${this.escapeHtml(message)}</p>`,
      buttons: [
        { text: "Cancel", value: false },
        { text: "Confirm", value: true, primary: true },
      ],
    })
  }

  /**
   * Show loading overlay
   * @param {string} message - Loading message
   * @returns {Object} Loading overlay controller
   */
  static showLoading(message = "Loading...") {
    const overlay = document.createElement("div")
    overlay.className = "modal-overlay"
    overlay.innerHTML = `
            <div class="modal" style="background: transparent; box-shadow: none;">
                <div style="text-align: center; color: white;">
                    <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                    <p>${this.escapeHtml(message)}</p>
                </div>
            </div>
        `

    this.modalContainer.appendChild(overlay)

    return {
      close: () => this.closeModal(overlay),
      updateMessage: (newMessage) => {
        const messageElement = overlay.querySelector("p")
        if (messageElement) {
          messageElement.textContent = newMessage
        }
      },
    }
  }

  /**
   * Show form in modal
   * @param {Object} formConfig - Form configuration
   * @returns {Promise} Promise that resolves with form data
   */
  static showForm(formConfig) {
    const { title, fields, submitText = "Submit", cancelText = "Cancel" } = formConfig

    const form = document.createElement("form")
    form.className = "modal-form"

    fields.forEach((field) => {
      const formGroup = document.createElement("div")
      formGroup.className = "form-group"

      const label = document.createElement("label")
      label.className = "form-label"
      label.textContent = field.label
      label.setAttribute("for", field.name)

      let input
      if (field.type === "textarea") {
        input = document.createElement("textarea")
        input.className = "form-textarea"
      } else if (field.type === "select") {
        input = document.createElement("select")
        input.className = "form-select"
        field.options.forEach((option) => {
          const optionElement = document.createElement("option")
          optionElement.value = option.value
          optionElement.textContent = option.text
          input.appendChild(optionElement)
        })
      } else {
        input = document.createElement("input")
        input.className = "form-input"
        input.type = field.type || "text"
      }

      input.name = field.name
      input.id = field.name
      input.required = field.required || false
      input.placeholder = field.placeholder || ""

      if (field.value !== undefined) {
        input.value = field.value
      }

      formGroup.appendChild(label)
      formGroup.appendChild(input)
      form.appendChild(formGroup)
    })

    return this.showModal({
      title,
      content: form,
      buttons: [
        { text: cancelText, value: null },
        { text: submitText, value: "submit", primary: true },
      ],
    }).then((result) => {
      if (result === "submit") {
        const formData = new FormData(form)
        const data = {}
        for (const [key, value] of formData.entries()) {
          data[key] = value
        }
        return data
      }
      return null
    })
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  static escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  /**
   * Show/hide loading state for an element
   * @param {HTMLElement} element - Element to show loading for
   * @param {boolean} show - Whether to show or hide loading
   */
  static toggleElementLoading(element, show) {
    if (show) {
      element.style.opacity = "0.6"
      element.style.pointerEvents = "none"
      element.setAttribute("data-loading", "true")
    } else {
      element.style.opacity = ""
      element.style.pointerEvents = ""
      element.removeAttribute("data-loading")
    }
  }

  /**
   * Animate element entrance
   * @param {HTMLElement} element - Element to animate
   * @param {string} animation - Animation type
   */
  static animateIn(element, animation = "fade-in") {
    element.classList.add(animation)
    setTimeout(() => {
      element.classList.remove(animation)
    }, 300)
  }

  /**
   * Smooth scroll to element
   * @param {HTMLElement|string} target - Element or selector to scroll to
   * @param {number} offset - Offset from top
   */
  static scrollTo(target, offset = 0) {
    const element = typeof target === "string" ? document.querySelector(target) : target
    if (element) {
      const top = element.offsetTop - offset
      window.scrollTo({
        top,
        behavior: "smooth",
      })
    }
  }
}
