# Event Management SPA

A comprehensive Single Page Application (SPA) for event management built with vanilla JavaScript, HTML5, and CSS3. This application provides a complete solution for event organizers to manage events and attendees, with role-based authentication and advanced CRUD operations.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: Secure login/register system with role-based access control
- **Event Management**: Complete CRUD operations for events with advanced validation
- **Registration System**: Users can register/unregister for events with capacity management
- **Real-time Updates**: Dynamic UI updates without page refreshes
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Data Persistence**: Session management with localStorage and JSON Server backend

### Advanced Features
- **Route Protection**: Secure routing with authentication guards
- **Form Validation**: Comprehensive client-side validation with real-time feedback
- **Toast Notifications**: User-friendly feedback system
- **Modal Dialogs**: Interactive modals for forms and confirmations
- **Search & Filtering**: Advanced event filtering and search capabilities
- **Role-based UI**: Dynamic interface based on user permissions
- **Error Handling**: Robust error handling with user-friendly messages

## 🛠 Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite for development and building
- **Backend Simulation**: JSON Server for REST API simulation
- **Styling**: Custom CSS with CSS Variables and modern layout techniques
- **Architecture**: Modular component-based architecture with service layer

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 14.0 or higher)
- **npm** (version 6.0 or higher)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/event-management-spa.git
cd event-management-spa
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Start the Development Environment
\`\`\`bash
npm start
\`\`\`

This command will:
- Start the JSON Server on port 3001
- Start the Vite development server on port 3000
- Automatically open the application in your default browser

### 4. Alternative: Run Services Separately
\`\`\`bash
# Terminal 1: Start JSON Server
npm run server

# Terminal 2: Start Vite Dev Server
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`
event-management-spa/
├── src/
│   ├── js/
│   │   ├── components/          # UI Components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── events/          # Event management components
│   │   │   └── admin/           # Admin panel components
│   │   ├── services/            # Business logic services
│   │   │   ├── api.service.js   # HTTP client service
│   │   │   ├── auth.service.js  # Authentication service
│   │   │   ├── event.service.js # Event management service
│   │   │   ├── ui.service.js    # UI interaction service
│   │   │   └── validation.service.js # Form validation service
│   │   ├── router/              # SPA routing
│   │   │   └── router.js        # Main router implementation
│   │   ├── app.js               # Main application class
│   │   └── main.js              # Application entry point
│   └── styles/
│       └── main.css             # Main stylesheet with CSS variables
├── db.json                      # JSON Server database
├── index.html                   # Main HTML file
├── package.json                 # Project dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
\`\`\`

## 🔐 Authentication System

### Default Users
The application comes with pre-configured users for testing:

**Administrator Account:**
- Username: `admin`
- Password: `admin123`
- Role: Admin (full access)

**Regular User Account:**
- Username: `user`
- Password: `user123`
- Role: User (limited access)

### User Roles & Permissions

#### Admin Role
- Create, edit, and delete events
- View all events and registrations
- Access admin panel
- Manage user registrations

#### User Role
- View available events
- Register/unregister for events
- View personal registrations
- Update profile information

## 🎯 Core Components

### 1. Authentication Service (`auth.service.js`)
Handles user authentication, session management, and role-based access control.

**Key Features:**
- Secure login/logout functionality
- Session persistence with localStorage
- Role-based permission checking
- Profile management
- Session expiry handling

### 2. Event Service (`event.service.js`)
Manages all event-related operations and business logic.

**Key Features:**
- CRUD operations for events
- Event registration/unregistration
- Capacity management
- Advanced filtering and search
- Statistics and reporting

### 3. API Service (`api.service.js`)
Centralized HTTP client for all API communications.

**Key Features:**
- RESTful API integration
- Request/response interceptors
- Error handling and retry logic
- Timeout management
- Pagination support

### 4. Validation Service (`validation.service.js`)
Comprehensive form and data validation.

**Key Features:**
- Real-time form validation
- Business logic validation
- XSS prevention
- Password strength checking
- File upload validation

### 5. UI Service (`ui.service.js`)
Manages user interface interactions and feedback.

**Key Features:**
- Toast notifications
- Modal dialogs
- Loading states
- Form helpers
- Animation utilities

### 6. Router (`router.js`)
Single Page Application routing with authentication guards.

**Key Features:**
- Hash-based routing
- Route protection
- Dynamic component loading
- Navigation guards
- History management

## 🎨 Styling Architecture

### CSS Variables System
The application uses a comprehensive CSS variables system for consistent theming:

\`\`\`css
:root {
  /* Color Palette */
  --primary-color: #6366f1;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 1rem;
  
  /* Spacing */
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
\`\`\`

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox layouts
- Breakpoint-based responsive design
- Touch-friendly interface elements

## 🔧 API Endpoints

The JSON Server provides the following REST endpoints:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Registrations
- `GET /registrations` - Get all registrations
- `GET /registrations/:id` - Get registration by ID
- `POST /registrations` - Create new registration
- `DELETE /registrations/:id` - Delete registration

## 🧪 Testing the Application

### Manual Testing Scenarios

#### 1. Authentication Flow
1. Navigate to the application
2. Try accessing protected routes (should redirect to login)
3. Login with invalid credentials (should show error)
4. Login with valid credentials (should redirect to dashboard)
5. Test logout functionality

#### 2. Event Management (Admin)
1. Login as admin user
2. Create a new event with validation testing
3. Edit existing events
4. Delete events (test with/without registrations)
5. View event statistics

#### 3. Event Registration (User)
1. Login as regular user
2. Browse available events
3. Register for events
4. Test capacity limits
5. Unregister from events
6. View registration history

#### 4. Responsive Design
1. Test on different screen sizes
2. Verify mobile navigation
3. Check form layouts on mobile
4. Test touch interactions

## 🚀 Deployment

### Building for Production
\`\`\`bash
npm run build
\`\`\`

This creates a `dist/` folder with optimized production files.

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Configure redirects for SPA routing

#### 2. Traditional Web Server
1. Build the project
2. Copy `dist/` contents to web server
3. Configure server for SPA routing

#### 3. GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run: `npm run deploy`

## 🔒 Security Considerations

### Implemented Security Measures
- **XSS Prevention**: HTML sanitization for user inputs
- **Input Validation**: Comprehensive client-side validation
- **Session Management**: Secure session handling with expiry
- **Role-based Access**: Proper authorization checks
- **CSRF Protection**: Token-based request validation

### Production Security Recommendations
- Implement HTTPS
- Add server-side validation
- Use secure authentication tokens (JWT)
- Implement rate limiting
- Add input sanitization on backend
- Use Content Security Policy (CSP)

## 🎯 Performance Optimizations

### Implemented Optimizations
- **Code Splitting**: Modular component loading
- **Lazy Loading**: Components loaded on demand
- **Caching**: LocalStorage for session data
- **Debounced Search**: Optimized search functionality
- **Efficient DOM Updates**: Minimal DOM manipulation

### Additional Recommendations
- Implement service workers for caching
- Add image optimization
- Use CDN for static assets
- Implement virtual scrolling for large lists
- Add compression (gzip/brotli)

## 🐛 Troubleshooting

### Common Issues

#### 1. JSON Server Not Starting
**Problem**: Port 3001 already in use
**Solution**: 
\`\`\`bash
# Kill process on port 3001
npx kill-port 3001
# Or change port in package.json
\`\`\`

#### 2. Vite Dev Server Issues
**Problem**: Port 3000 already in use
**Solution**: Vite will automatically use next available port

#### 3. CORS Issues
**Problem**: API requests blocked by CORS
**Solution**: JSON Server automatically handles CORS for development

#### 4. Authentication Issues
**Problem**: Session not persisting
**Solution**: Check browser localStorage and clear if corrupted

#### 5. Build Issues
**Problem**: Build fails with module errors
**Solution**: 
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 🔄 Development Workflow

### Adding New Features

#### 1. Create New Component
\`\`\`javascript
// src/js/components/feature/new-component.js
export class NewComponent {
    constructor() {
        this.element = null;
    }
    
    async render() {
        // Component rendering logic
    }
    
    destroy() {
        // Cleanup logic
    }
}
\`\`\`

#### 2. Add New Route
\`\`\`javascript
// In router.js
this.addRoute('new-feature', {
    component: NewComponent,
    requiresAuth: true,
    title: 'New Feature - EventHub'
});
\`\`\`

#### 3. Update Navigation
\`\`\`html
<!-- In index.html -->
<a href="#" data-route="new-feature" class="nav-link">New Feature</a>
\`\`\`

### Code Style Guidelines
- Use ES6+ features (arrow functions, destructuring, modules)
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)
- Add JSDoc comments for functions
- Use meaningful variable and function names
- Keep functions small and focused
- Handle errors appropriately

## 📚 Learning Resources

### JavaScript & ES6+
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Features](https://github.com/lukehoban/es6features)
- [JavaScript.info](https://javascript.info/)

### SPA Development
- [Single Page Applications](https://developer.mozilla.org/en-US/docs/Glossary/SPA)
- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### CSS & Responsive Design
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

### Tools & Build Systems
- [Vite Documentation](https://vitejs.dev/)
- [JSON Server](https://github.com/typicode/json-server)
- [npm Scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts)

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test thoroughly
5. Commit with descriptive messages
6. Push to your fork
7. Create a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure responsive design
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions:
- Create an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## 🎉 Acknowledgments

- **Vite Team** for the excellent build tool
- **JSON Server** for easy API mocking
- **MDN Web Docs** for comprehensive documentation
- **CSS-Tricks** for layout and styling guidance

---

**Built with ❤️ using Vanilla JavaScript, HTML5, and CSS3**
\`\`\`

This Event Management SPA demonstrates modern web development practices with vanilla JavaScript, providing a solid foundation for understanding SPA architecture, authentication systems, and CRUD operations without the complexity of frameworks.
\`\`\`

Ahora voy a crear los componentes principales:

\`\`\`
