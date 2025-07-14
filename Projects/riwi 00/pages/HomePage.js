/**
 * Home Page Component
 * Landing page with featured events and call-to-action sections
 */
export default class HomePage {
    constructor({ services }) {
        this.services = services;
    }

    /**
     * Render the home page
     */
    async render(container) {
        try {
            // Get featured events
            const events = await this.services.event.getEvents({ status: 'active' });
            const featuredEvents = events.slice(0, 6); // Show first 6 events

            container.innerHTML = `
                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="container">
                        <div class="hero-content">
                            <h1 class="hero-title">
                                Discover Amazing Events
                            </h1>
                            <p class="hero-subtitle">
                                Join thousands of people attending incredible events in your area. 
                                From conferences to concerts, find your next unforgettable experience.
                            </p>
                            <div class="hero-actions">
                                <a href="#events" class="btn btn-primary btn-lg" data-route="events">
                                    <i class="fas fa-calendar"></i>
                                    Browse Events
                                </a>
                                <a href="#register" class="btn btn-outline btn-lg" data-route="register">
                                    <i class="fas fa-user-plus"></i>
                                    Join Now
                                </a>
                            </div>
                        </div>
                        <div class="hero-image">
                            <div class="hero-placeholder">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Features Section -->
                <section class="features-section">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">Why Choose EventManager?</h2>
                            <p class="section-subtitle">
                                Everything you need to discover and attend amazing events
                            </p>
                        </div>
                        <div class="features-grid">
                            <div class="feature-card">
                                <div class="feature-icon primary">
                                    <i class="fas fa-search"></i>
                                </div>
                                <h3 class="feature-title">Easy Discovery</h3>
                                <p class="feature-description">
                                    Find events that match your interests with our advanced search and filtering system.
                                </p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-icon success">
                                    <i class="fas fa-ticket-alt"></i>
                                </div>
                                <h3 class="feature-title">Simple Registration</h3>
                                <p class="feature-description">
                                    Register for events with just a few clicks. No complicated processes or hidden fees.
                                </p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-icon warning">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h3 class="feature-title">Community Driven</h3>
                                <p class="feature-description">
                                    Connect with like-minded people and build lasting relationships through shared experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Featured Events Section -->
                <section class="featured-events-section">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">Featured Events</h2>
                            <p class="section-subtitle">
                                Don't miss out on these popular upcoming events
                            </p>
                        </div>
                        <div class="events-grid" id="featured-events">
                            ${this.renderFeaturedEvents(featuredEvents)}
                        </div>
                        <div class="section-footer">
                            <a href="#events" class="btn btn-primary" data-route="events">
                                <i class="fas fa-calendar"></i>
                                View All Events
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Stats Section -->
                <section class="stats-section">
                    <div class="container">
                        <div class="stats-grid" id="stats-grid">
                            <!-- Stats will be loaded here -->
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="cta-section">
                    <div class="container">
                        <div class="cta-content">
                            <h2 class="cta-title">Ready to Get Started?</h2>
                            <p class="cta-subtitle">
                                Join our community today and never miss an amazing event again.
                            </p>
                            <div class="cta-actions">
                                <a href="#register" class="btn btn-primary btn-lg" data-route="register">
                                    <i class="fas fa-user-plus"></i>
                                    Create Account
                                </a>
                                <a href="#events" class="btn btn-outline btn-lg" data-route="events">
                                    <i class="fas fa-eye"></i>
                                    Browse Events
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            `;

            // Add custom styles for home page
            this.addStyles();

            // Load and display stats
            await this.loadStats();

            // Set up event listeners
            this.setupEventListeners();

            console.log('✅ Home page rendered successfully');
        } catch (error) {
            console.error('❌ Error rendering home page:', error);
            container.innerHTML = `
                <div class="container">
                    <div class="error-message">
                        <h2>Oops! Something went wrong</h2>
                        <p>We're having trouble loading the home page. Please try again later.</p>
                        <button class="btn btn-primary" onclick="location.reload()">
                            <i class="fas fa-refresh"></i>
                            Retry
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Render featured events
     */
    renderFeaturedEvents(events) {
        if (events.length === 0) {
            return `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No Events Available</h3>
                    <p>Check back soon for exciting upcoming events!</p>
                </div>
            `;
        }

        return events.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <div class="event-date">
                        <div class="event-date-day">${new Date(event.date).getDate()}</div>
                        <div class="event-date-month">${new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    </div>
                </div>
                <div class="event-info">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <div class="event-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${this.services.ui.formatTime(event.time)}</span>
                        </div>
                        <div class="event-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="event-meta-item">
                            <i class="fas fa-users"></i>
                            <span>${event.attendees}/${event.capacity} attending</span>
                        </div>
                    </div>
                    ${event.price ? `<div class="event-price">${this.services.ui.formatCurrency(event.price)}</div>` : ''}
                    <div class="event-actions">
                        <button class="btn btn-primary btn-sm register-btn" data-event-id="${event.id}">
                            <i class="fas fa-ticket-alt"></i>
                            Register
                        </button>
                        <button class="btn btn-outline btn-sm details-btn" data-event-id="${event.id}">
                            <i class="fas fa-info-circle"></i>
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Load and display statistics
     */
    async loadStats() {
        try {
            const stats = await this.services.event.getEventStats();
            const statsContainer = document.getElementById('stats-grid');
            
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <div class="stat-icon primary">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${stats.totalEvents}</h3>
                            <p>Total Events</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon success">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${stats.totalAttendees}</h3>
                            <p>Happy Attendees</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon warning">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${stats.averageAttendance}</h3>
                            <p>Average Attendance</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon danger">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${stats.capacityUtilization}%</h3>
                            <p>Capacity Utilization</p>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Handle event registration
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.register-btn')) {
                const eventId = e.target.closest('.register-btn').getAttribute('data-event-id');
                await this.handleEventRegistration(eventId);
            }
            
            if (e.target.closest('.details-btn')) {
                const eventId = e.target.closest('.details-btn').getAttribute('data-event-id');
                await this.showEventDetails(eventId);
            }
        });
    }

    /**
     * Handle event registration
     */
    async handleEventRegistration(eventId) {
        try {
            const user = this.services.auth.getCurrentUser();
            
            if (!user) {
                this.services.ui.showToast('Please log in to register for events', 'warning');
                // Redirect to login page
                setTimeout(() => {
                    window.app.router.navigate('login');
                }, 1500);
                return;
            }

            // Show confirmation dialog
            const confirmed = await this.services.ui.showConfirm(
                'Confirm Registration',
                'Are you sure you want to register for this event?'
            );

            if (confirmed) {
                await this.services.event.registerForEvent(eventId, user.id);
                this.services.ui.showToast('Successfully registered for event!', 'success');
                
                // Refresh the page to update attendee counts
                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.services.ui.showToast(error.message || 'Registration failed', 'error');
        }
    }

    /**
     * Show event details in modal
     */
    async showEventDetails(eventId) {
        try {
            const event = await this.services.event.getEvent(eventId);
            const user = this.services.auth.getCurrentUser();
            
            let registrationStatus = '';
            if (user) {
                const userRegistrations = await this.services.event.getUserRegistrations(user.id);
                const isRegistered = userRegistrations.some(reg => reg.eventId === Number.parseInt(eventId));
                registrationStatus = isRegistered ? 
                    '<div class="badge badge-success">You are registered</div>' : 
                    '<div class="badge badge-warning">Not registered</div>';
            }

            const modalContent = `
                <div class="event-details">
                    <div class="event-header">
                        <h2>${event.title}</h2>
                        ${registrationStatus
