/**
 * Entrenamiento DOM y Almacenamiento - Diseño Moderno
 * Aplicación interactiva con persistencia de datos y diseño minimalista
 */

class ModernDataPersistenceApp {
  constructor() {
    // Elementos del DOM
    this.loadingScreen = document.getElementById("loadingScreen")
    this.userForm = document.getElementById("userForm")
    this.userNameInput = document.getElementById("userName")
    this.userAgeInput = document.getElementById("userAge")
    this.saveDataBtn = document.getElementById("saveDataBtn")
    this.clearDataBtn = document.getElementById("clearDataBtn")
    this.outputDiv = document.getElementById("output")
    this.interactionCounter = document.getElementById("interactionCounter")
    this.dataStatus = document.getElementById("dataStatus")
    this.activeTime = document.getElementById("activeTime")
    this.nameError = document.getElementById("nameError")
    this.ageError = document.getElementById("ageError")
    this.toastContainer = document.getElementById("toastContainer")

    // Elementos de almacenamiento
    this.localStorageContent = document.getElementById("localStorageContent")
    this.sessionStorageContent = document.getElementById("sessionStorageContent")
    this.localStorageSize = document.getElementById("localStorageSize")
    this.sessionStorageSize = document.getElementById("sessionStorageSize")

    // Claves para el almacenamiento
    this.LOCAL_STORAGE_KEY = "userData"
    this.SESSION_STORAGE_KEY = "interactionCount"

    // Variables de estado
    this.interactionCount = 0
    this.startTime = Date.now()
    this.activeTimeInterval = null

    // Inicializar la aplicación
    this.init()
  }

  /**
   * Inicializa la aplicación con loading screen elegante
   */
  async init() {
    console.log("🚀 Iniciando aplicación con diseño moderno...")

    // Simular carga inicial más realista
    await this.simulateLoading()

    // Ocultar loading screen con transición suave
    this.hideLoadingScreen()

    // Configurar la aplicación
    this.setupEventListeners()
    this.loadStoredData()
    this.initInteractionCounter()
    this.startActiveTimeCounter()
    this.setupStorageTabs()
    this.updateStorageMonitor()

    // Agregar efectos visuales iniciales
    this.addInitialEffects()

    console.log("✨ Aplicación moderna inicializada correctamente")
  }

  /**
   * Simula tiempo de carga con progreso
   */
  async simulateLoading() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
  }

  /**
   * Oculta la pantalla de carga con animación elegante
   */
  hideLoadingScreen() {
    this.loadingScreen.classList.add("hidden")
    setTimeout(() => {
      this.loadingScreen.style.display = "none"
    }, 500)
  }

  /**
   * Agrega efectos visuales iniciales
   */
  addInitialEffects() {
    // Efecto de aparición gradual para las secciones
    const sections = document.querySelectorAll("section")
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`
    })

    // Efecto de pulso en el contador de interacciones
    if (this.interactionCounter) {
      this.interactionCounter.classList.add("pulse")
    }
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    // Formulario
    this.userForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSaveData()
    })

    // Botones
    this.clearDataBtn.addEventListener("click", () => {
      this.handleClearData()
    })

    // Validación en tiempo real con debounce
    this.userNameInput.addEventListener(
      "input",
      this.debounce(() => {
        this.validateName()
        this.incrementInteractionCounter()
      }, 300),
    )

    this.userAgeInput.addEventListener(
      "input",
      this.debounce(() => {
        this.validateAge()
        this.incrementInteractionCounter()
      }, 300),
    )

    // Eventos globales para contador (con throttling)
    let interactionThrottle = false
    const handleInteraction = () => {
      if (!interactionThrottle) {
        this.incrementInteractionCounter()
        interactionThrottle = true
        setTimeout(() => {
          interactionThrottle = false
        }, 200)
      }
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("keydown", handleInteraction)

    // Eventos de almacenamiento
    window.addEventListener("storage", () => {
      this.updateStorageMonitor()
    })

    console.log("📋 Event listeners configurados con optimizaciones")
  }

  /**
   * Función debounce para optimizar validaciones
   */
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  /**
   * Configura las pestañas de almacenamiento con animaciones
   */
  setupStorageTabs() {
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabPanels = document.querySelectorAll(".tab-panel")

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.dataset.tab

        // Remover clase active con animación
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabPanels.forEach((panel) => {
          panel.classList.remove("active")
          panel.style.opacity = "0"
        })

        // Activar el botón seleccionado
        button.classList.add("active")

        // Activar el panel con delay para animación
        setTimeout(() => {
          const targetPanel = document.getElementById(`${targetTab}-tab`)
          targetPanel.classList.add("active")
          targetPanel.style.opacity = "1"
        }, 150)

        this.incrementInteractionCounter()
      })
    })
  }

  /**
   * Maneja el guardado de datos con mejor UX y animaciones
   */
  async handleSaveData() {
    console.log("💾 Guardando datos con estilo moderno...")

    // Mostrar estado de carga con animación
    this.saveDataBtn.classList.add("loading")
    this.saveDataBtn.disabled = true

    // Agregar efecto visual al botón
    this.saveDataBtn.style.transform = "scale(0.98)"

    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const userName = this.userNameInput.value.trim()
    const userAge = Number.parseInt(this.userAgeInput.value)

    // Validar datos
    const isNameValid = this.validateName()
    const isAgeValid = this.validateAge()

    if (!isNameValid || !isAgeValid) {
      this.showToast("Por favor, corrige los errores antes de guardar", "error")
      this.saveDataBtn.classList.remove("loading")
      this.saveDataBtn.disabled = false
      this.saveDataBtn.style.transform = "scale(1)"
      return
    }

    // Crear objeto de datos con más información
    const userData = {
      name: userName,
      age: userAge,
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId(),
      version: "3.0",
      userAgent: navigator.userAgent.substring(0, 50) + "...",
      language: navigator.language,
    }

    try {
      // Guardar en Local Storage
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(userData))

      console.log("✅ Datos guardados con éxito:", userData)

      // Actualizar interfaz con animaciones
      await this.displayStoredData(userData)
      this.updateDataStatus(true)
      this.updateStorageMonitor()

      // Mostrar éxito con animación
      this.showToast("¡Datos guardados exitosamente! 🎉", "success")

      // Limpiar formulario con animación
      this.clearFormWithAnimation()

      // Efecto de éxito en el botón
      this.saveDataBtn.style.background = "linear-gradient(135deg, #22c55e, #16a34a)"
      setTimeout(() => {
        this.saveDataBtn.style.background = ""
      }, 1000)
    } catch (error) {
      console.error("❌ Error al guardar:", error)
      this.showToast("Error al guardar los datos. Inténtalo de nuevo.", "error")
    } finally {
      this.saveDataBtn.classList.remove("loading")
      this.saveDataBtn.disabled = false
      this.saveDataBtn.style.transform = "scale(1)"
    }
  }

  /**
   * Limpia el formulario con animación suave
   */
  clearFormWithAnimation() {
    const inputs = [this.userNameInput, this.userAgeInput]

    inputs.forEach((input, index) => {
      setTimeout(() => {
        input.style.transform = "scale(0.95)"
        input.style.opacity = "0.5"

        setTimeout(() => {
          input.value = ""
          input.style.transform = "scale(1)"
          input.style.opacity = "1"
        }, 200)
      }, index * 100)
    })

    this.clearErrorMessages()
  }

  /**
   * Maneja la limpieza de datos con confirmación elegante
   */
  async handleClearData() {
    const confirmed = await this.showModernConfirmDialog(
      "¿Eliminar todos los datos?",
      "Esta acción no se puede deshacer. Todos los datos almacenados se eliminarán permanentemente.",
    )

    if (!confirmed) return

    console.log("🗑️ Limpiando datos con confirmación...")

    try {
      // Animación de eliminación
      const outputDiv = this.outputDiv
      outputDiv.style.transform = "scale(0.95)"
      outputDiv.style.opacity = "0.5"

      await new Promise((resolve) => setTimeout(resolve, 300))

      localStorage.removeItem(this.LOCAL_STORAGE_KEY)

      this.displayNoData()
      this.updateDataStatus(false)
      this.updateStorageMonitor()

      this.showToast("Datos eliminados correctamente 🗑️", "warning")

      this.clearFormWithAnimation()

      // Restaurar estilo del output
      outputDiv.style.transform = "scale(1)"
      outputDiv.style.opacity = "1"
    } catch (error) {
      console.error("❌ Error al eliminar:", error)
      this.showToast("Error al eliminar los datos.", "error")
    }
  }

  /**
   * Muestra un diálogo de confirmación moderno
   */
  showModernConfirmDialog(title, message) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div")
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      `

      const dialog = document.createElement("div")
      dialog.style.cssText = `
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-width: 400px;
        width: 90%;
        text-align: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      `

      dialog.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem;">${title}</h3>
          <p style="color: #6b7280; font-size: 0.875rem; line-height: 1.5;">${message}</p>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <button class="cancel-btn" style="
            padding: 0.75rem 1.5rem;
            border: 1px solid #d1d5db;
            background: white;
            color: #374151;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            min-width: 100px;
          ">Cancelar</button>
          <button class="confirm-btn" style="
            padding: 0.75rem 1.5rem;
            border: none;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            min-width: 100px;
          ">Eliminar</button>
        </div>
      `

      document.body.appendChild(overlay)

      // Animación de entrada
      requestAnimationFrame(() => {
        overlay.style.opacity = "1"
        dialog.style.transform = "scale(1)"
      })

      // Event listeners
      dialog.querySelector(".confirm-btn").addEventListener("click", () => {
        overlay.style.opacity = "0"
        dialog.style.transform = "scale(0.9)"
        setTimeout(() => {
          document.body.removeChild(overlay)
          resolve(true)
        }, 300)
      })

      dialog.querySelector(".cancel-btn").addEventListener("click", () => {
        overlay.style.opacity = "0"
        dialog.style.transform = "scale(0.9)"
        setTimeout(() => {
          document.body.removeChild(overlay)
          resolve(false)
        }, 300)
      })

      // Cerrar con ESC
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          overlay.style.opacity = "0"
          dialog.style.transform = "scale(0.9)"
          setTimeout(() => {
            document.body.removeChild(overlay)
            document.removeEventListener("keydown", handleEsc)
            resolve(false)
          }, 300)
        }
      }
      document.addEventListener("keydown", handleEsc)

      overlay.appendChild(dialog)
    })
  }

  /**
   * Carga datos almacenados con animación elegante
   */
  async loadStoredData() {
    console.log("📂 Cargando datos con animaciones...")

    try {
      const storedData = localStorage.getItem(this.LOCAL_STORAGE_KEY)

      if (storedData) {
        const userData = JSON.parse(storedData)
        console.log("📋 Datos encontrados:", userData)

        // Delay para mejor experiencia visual
        setTimeout(async () => {
          await this.displayStoredData(userData)
          this.updateDataStatus(true)
        }, 800)
      } else {
        console.log("ℹ️ No hay datos almacenados")
        setTimeout(() => {
          this.displayNoData()
          this.updateDataStatus(false)
        }, 800)
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error)
      this.displayNoData()
      this.updateDataStatus(false)
    }
  }

  /**
   * Muestra los datos con diseño moderno y animaciones
   */
  async displayStoredData(userData) {
    const formattedDate = new Date(userData.timestamp).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    // Crear contenido con iconos SVG modernos
    this.outputDiv.innerHTML = `
      <div class="user-data">
        <h3>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Información del Usuario
        </h3>
        <p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <path d="M20 8v6M23 11h-6"/>
          </svg>
          <strong>Nombre:</strong> ${userData.name}
        </p>
        <p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <strong>Edad:</strong> ${userData.age} años
        </p>
        <p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <strong>Guardado:</strong> ${formattedDate}
        </p>
        <p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
            <path d="M13 12h3"/>
            <path d="M8 12H5"/>
          </svg>
          <strong>Sesión:</strong> ${userData.sessionId.substring(0, 20)}...
        </p>
        ${
          userData.version
            ? `
        <p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <strong>Versión:</strong> ${userData.version}
        </p>
        `
            : ""
        }
      </div>
    `

    // Agregar animación de entrada
    const userDataElement = this.outputDiv.querySelector(".user-data")
    userDataElement.style.opacity = "0"
    userDataElement.style.transform = "translateY(20px)"

    await new Promise((resolve) => setTimeout(resolve, 100))

    userDataElement.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    userDataElement.style.opacity = "1"
    userDataElement.style.transform = "translateY(0)"

    console.log("🖼️ Datos mostrados con diseño moderno")
  }

  /**
   * Muestra mensaje cuando no hay datos con diseño elegante
   */
  displayNoData() {
    this.outputDiv.innerHTML = `
      <div class="no-data">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1rem; color: #9ca3af;">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p><strong>No hay información almacenada</strong></p>
        <p>Completa el formulario y haz clic en "Guardar Datos" para almacenar tu información.</p>
        <p>Los datos se guardarán en tu navegador y persistirán entre sesiones.</p>
      </div>
    `

    console.log('ℹ️ Mensaje de "sin datos" mostrado con estilo moderno')
  }

  /**
   * Inicializa el contador de interacciones con animación
   */
  initInteractionCounter() {
    try {
      const currentCount = sessionStorage.getItem(this.SESSION_STORAGE_KEY)
      this.interactionCount = currentCount ? Number.parseInt(currentCount) : 0

      this.updateInteractionDisplay()
      console.log("🔢 Contador inicializado:", this.interactionCount)
    } catch (error) {
      console.error("❌ Error al inicializar contador:", error)
      this.interactionCount = 0
      this.updateInteractionDisplay()
    }
  }

  /**
   * Incrementa el contador con animación suave
   */
  incrementInteractionCounter() {
    this.interactionCount++
    sessionStorage.setItem(this.SESSION_STORAGE_KEY, this.interactionCount.toString())
    this.updateInteractionDisplay()
    this.updateStorageMonitor()
  }

  /**
   * Actualiza la visualización del contador con efectos modernos
   */
  updateInteractionDisplay() {
    if (this.interactionCounter) {
      // Animación de cambio de número
      this.interactionCounter.style.transform = "scale(1.1)"
      this.interactionCounter.style.color = "var(--primary-600)"

      // Actualizar el número con formato
      this.interactionCounter.textContent = this.interactionCount.toLocaleString()

      // Restaurar estilo
      setTimeout(() => {
        this.interactionCounter.style.transform = "scale(1)"
        this.interactionCounter.style.color = ""
      }, 200)

      // Efecto de brillo ocasional
      if (this.interactionCount % 10 === 0 && this.interactionCount > 0) {
        this.interactionCounter.classList.add("bounce")
        setTimeout(() => {
          this.interactionCounter.classList.remove("bounce")
        }, 1000)
      }
    }
  }

  /**
   * Actualiza el estado de datos guardados con indicador visual
   */
  updateDataStatus(hasData) {
    if (this.dataStatus) {
      this.dataStatus.textContent = hasData ? "Sí" : "No"
      this.dataStatus.style.color = hasData ? "var(--success-600)" : "var(--gray-500)"

      // Efecto de cambio
      this.dataStatus.style.transform = "scale(1.05)"
      setTimeout(() => {
        this.dataStatus.style.transform = "scale(1)"
      }, 200)
    }
  }

  /**
   * Inicia el contador de tiempo activo con formato elegante
   */
  startActiveTimeCounter() {
    this.activeTimeInterval = setInterval(() => {
      const elapsed = Date.now() - this.startTime
      const minutes = Math.floor(elapsed / 60000)
      const seconds = Math.floor((elapsed % 60000) / 1000)

      if (this.activeTime) {
        const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        this.activeTime.textContent = timeString

        // Efecto sutil cada minuto
        if (seconds === 0 && minutes > 0) {
          this.activeTime.style.color = "var(--primary-600)"
          setTimeout(() => {
            this.activeTime.style.color = ""
          }, 1000)
        }
      }
    }, 1000)
  }

  /**
   * Actualiza el monitor de almacenamiento con mejor formato
   */
  updateStorageMonitor() {
    this.updateStorageContent("localStorage", this.localStorageContent, this.localStorageSize)
    this.updateStorageContent("sessionStorage", this.sessionStorageContent, this.sessionStorageSize)
  }

  /**
   * Actualiza el contenido de almacenamiento con formato JSON elegante
   */
  updateStorageContent(storageType, contentElement, sizeElement) {
    try {
      const storage = window[storageType]
      const items = {}
      let totalSize = 0

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        const value = storage.getItem(key)
        items[key] = value
        totalSize += key.length + value.length
      }

      // Actualizar contenido con formato mejorado
      if (Object.keys(items).length > 0) {
        const formattedJson = JSON.stringify(items, null, 2)
        contentElement.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; word-break: break-word;">${this.syntaxHighlight(formattedJson)}</pre>`
      } else {
        contentElement.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p><em>Sin datos almacenados</em></p>
          </div>
        `
      }

      // Actualizar tamaño con formato elegante
      if (sizeElement) {
        const sizeInKB = (totalSize / 1024).toFixed(2)
        sizeElement.textContent = totalSize > 1024 ? `${sizeInKB} KB` : `${totalSize} bytes`
      }
    } catch (error) {
      console.error(`Error al actualizar ${storageType}:`, error)
      contentElement.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--error-500);">
          <p><em>Error al cargar datos</em></p>
        </div>
      `
    }
  }

  /**
   * Resalta la sintaxis JSON para mejor legibilidad
   */
  syntaxHighlight(json) {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "color: var(--gray-700);"
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "color: var(--primary-600); font-weight: 500;" // keys
          } else {
            cls = "color: var(--success-600);" // strings
          }
        } else if (/true|false/.test(match)) {
          cls = "color: var(--warning-600);" // booleans
        } else if (/null/.test(match)) {
          cls = "color: var(--error-500);" // null
        } else if (/\d/.test(match)) {
          cls = "color: var(--secondary-600);" // numbers
        }
        return `<span style="${cls}">${match}</span>`
      },
    )
  }

  /**
   * Validación mejorada del nombre con indicadores visuales
   */
  validateName() {
    const name = this.userNameInput.value.trim()
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/

    if (name === "") {
      this.showFieldError("nameError", "El nombre es requerido")
      return false
    } else if (name.length < 2) {
      this.showFieldError("nameError", "El nombre debe tener al menos 2 caracteres")
      return false
    } else if (name.length > 50) {
      this.showFieldError("nameError", "El nombre no puede tener más de 50 caracteres")
      return false
    } else if (!nameRegex.test(name)) {
      this.showFieldError("nameError", "El nombre solo puede contener letras y espacios")
      return false
    } else {
      this.clearFieldError("nameError")
      return true
    }
  }

  /**
   * Validación mejorada de la edad con indicadores visuales
   */
  validateAge() {
    const ageValue = this.userAgeInput.value
    const age = Number.parseInt(ageValue)

    if (ageValue === "") {
      this.showFieldError("ageError", "La edad es requerida")
      return false
    } else if (isNaN(age)) {
      this.showFieldError("ageError", "La edad debe ser un número válido")
      return false
    } else if (age < 1) {
      this.showFieldError("ageError", "La edad debe ser mayor a 0")
      return false
    } else if (age > 120) {
      this.showFieldError("ageError", "La edad debe ser menor a 120")
      return false
    } else {
      this.clearFieldError("ageError")
      return true
    }
  }

  /**
   * Muestra error en campo con animación
   */
  showFieldError(errorElementId, message) {
    const errorElement = document.getElementById(errorElementId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "flex"
      errorElement.style.opacity = "0"
      errorElement.style.transform = "translateY(-10px)"

      // Animación de entrada
      requestAnimationFrame(() => {
        errorElement.style.transition = "all 0.3s ease"
        errorElement.style.opacity = "1"
        errorElement.style.transform = "translateY(0)"
      })
    }
  }

  /**
   * Limpia error de campo con animación
   */
  clearFieldError(errorElementId) {
    const errorElement = document.getElementById(errorElementId)
    if (errorElement) {
      errorElement.style.opacity = "0"
      errorElement.style.transform = "translateY(-10px)"

      setTimeout(() => {
        errorElement.textContent = ""
        errorElement.style.display = "none"
      }, 300)
    }
  }

  /**
   * Limpia todos los errores
   */
  clearErrorMessages() {
    this.clearFieldError("nameError")
    this.clearFieldError("ageError")
  }

  /**
   * Sistema de notificaciones toast moderno
   */
  showToast(message, type = "info", duration = 4000) {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const icons = {
      success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>`,
      error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>`,
      warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`,
    }

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="color: currentColor; flex-shrink: 0;">
          ${icons[type] || icons.info}
        </div>
        <span style="font-weight: 500;">${message}</span>
      </div>
    `

    this.toastContainer.appendChild(toast)

    // Auto-remove con animación
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = "slideOutToRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards"
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }, 400)
      }
    }, duration)

    console.log(`📢 Toast moderno mostrado (${type}):`, message)
  }

  /**
   * Genera ID de sesión único con mejor formato
   */
  generateSessionId() {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substr(2, 9)
    return `session_${timestamp}_${randomStr}`
  }

  /**
   * Limpia recursos al cerrar
   */
  destroy() {
    if (this.activeTimeInterval) {
      clearInterval(this.activeTimeInterval)
    }
    console.log("🧹 Recursos limpiados")
  }
}

// Estilos adicionales para animaciones modernas
const modernStyles = `
  @keyframes slideOutToRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .input-container input::placeholder {
    color: var(--gray-400);
    transition: color 0.3s ease;
  }

  .input-container input:focus::placeholder {
    color: var(--gray-300);
  }

  /* Mejoras de hover para botones */
  .btn:hover svg {
    transform: scale(1.1);
  }

  /* Efectos de focus mejorados */
  .btn:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  .input-container input:focus-visible {
    outline: none;
  }

  /* Animaciones de carga más suaves */
  .btn.loading {
    pointer-events: none;
  }

  /* Mejoras para el modo oscuro del sistema */
  @media (prefers-color-scheme: dark) {
    .storage-content {
      background: var(--gray-800);
      color: var(--gray-200);
      border-color: var(--gray-700);
    }
  }
`

// Inyectar estilos modernos
const modernStyleSheet = document.createElement("style")
modernStyleSheet.textContent = modernStyles
document.head.appendChild(modernStyleSheet)

// Inicializar aplicación moderna
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌟 DOM cargado, inicializando aplicación moderna...")

  const app = new ModernDataPersistenceApp()
  window.dataApp = app

  // Limpiar recursos al cerrar
  window.addEventListener("beforeunload", () => {
    app.destroy()
  })

  console.log("🎉 Aplicación moderna lista!")
  console.log("💡 Accede a la aplicación desde: window.dataApp")
})

// Funciones de debugging mejoradas
window.debugStorage = {
  showLocalStorage: () => {
    console.group("📦 Local Storage")
    console.table(Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])))
    console.groupEnd()
  },

  showSessionStorage: () => {
    console.group("📦 Session Storage")
    console.table(Object.fromEntries(Object.keys(sessionStorage).map((key) => [key, sessionStorage.getItem(key)])))
    console.groupEnd()
  },

  clearAllStorage: () => {
    if (confirm("¿Estás seguro de que quieres limpiar todo el almacenamiento?")) {
      localStorage.clear()
      sessionStorage.clear()
      console.log("🗑️ Todo el almacenamiento limpiado")
      location.reload()
    }
  },

  exportData: () => {
    const data = {
      localStorage: Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])),
      sessionStorage: Object.fromEntries(Object.keys(sessionStorage).map((key) => [key, sessionStorage.getItem(key)])),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `storage-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    console.log("📁 Datos exportados exitosamente")
  },

  getStorageStats: () => {
    const localStorageSize = JSON.stringify(localStorage).length
    const sessionStorageSize = JSON.stringify(sessionStorage).length

    console.group("📊 Estadísticas de Almacenamiento")
    console.log(`Local Storage: ${localStorageSize} bytes (${(localStorageSize / 1024).toFixed(2)} KB)`)
    console.log(`Session Storage: ${sessionStorageSize} bytes (${(sessionStorageSize / 1024).toFixed(2)} KB)`)
    console.log(`Total: ${localStorageSize + sessionStorageSize} bytes`)
    console.groupEnd()
  },
}

console.log("🔧 Funciones de debugging mejoradas disponibles en window.debugStorage")
