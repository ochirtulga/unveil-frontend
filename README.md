# Unveil - Find Out Truth

A modern React application for scammer search and verification built for production deployment. Search our comprehensive database to verify suspicious contacts and protect yourself from scams.

## ✨ Features

- 🔍 **Advanced Search** - Search by name, email, phone, or company
- 📊 **Real-time Results** - Get instant verification with detailed information
- 🗳️ **Community Voting** - Democratic case verdict system with email verification
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Built with Vite and optimized components
- 🎨 **Modern UI** - Clean, minimalist design with Tailwind CSS
- 🔒 **Type Safe** - Full TypeScript support
- 📄 **Pagination** - Navigate through large result sets efficiently
- 🎯 **Smart Filtering** - Filter searches by specific data types
- ✉️ **Email Verification** - Secure OTP-based voting system

## 🚀 MVP Status

### ✅ Production Ready Features
- [x] Homepage with hero section and search
- [x] Advanced search with multiple filter options
- [x] Search results display with pagination
- [x] Case details modal with voting
- [x] Report scammer functionality
- [x] Email verification system (OTP)
- [x] Community voting system
- [x] Responsive navigation
- [x] Toast notification system
- [x] Form validation and error handling
- [x] Loading states and user feedback
- [x] About page
- [x] Production configuration
- [x] Centralized API service
- [x] Environment variables setup

### 🔄 Future Enhancements (Post-MVP)
- [ ] User authentication (LinkedIn/Social)
- [ ] Advanced search filters
- [ ] Case analytics dashboard
- [ ] Email notifications
- [ ] API rate limiting display
- [ ] Comprehensive help system

## 🛠️ Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running (default: http://localhost:8080)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unveil-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   VITE_API_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 📁 Project Structure

```
src/
├── components/
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── VerificationContext.tsx
│   ├── features/         # Feature-specific components
│   │   ├── Homepage.tsx
│   │   ├── SearchForm.tsx
│   │   ├── SearchResults.tsx
│   │   ├── CaseDetailModal.tsx
│   │   ├── VerificationModal.tsx
│   │   ├── ReportPage.tsx
│   │   └── About.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── ui/              # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── config/              # Configuration files
│   └── index.ts         # Centralized app configuration
├── hooks/               # Custom React hooks
│   └── useSearch.ts     # Search functionality hook
├── services/            # API and external services
│   └── api.ts          # Centralized API service
├── utils/               # Utility functions
│   ├── constants.ts     # Application constants
│   └── validation.ts    # Form validation utilities
├── types/               # TypeScript type definitions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🔍 Core Features

### Search Functionality
- **Multi-field search**: Search across names, emails, phones, and companies
- **Smart validation**: Real-time input validation based on search type
- **Pagination**: Navigate through large result sets efficiently
- **Filter options**: Targeted searches with specific field filters

### Case Management
- **Detailed case view**: Complete case information in modal format
- **Community voting**: Democratic verdict system with email verification
- **Case reporting**: Submit new scammer reports with detailed information
- **Real-time updates**: Live vote counts and verdict calculations

### Verification System
- **Email verification**: OTP-based system for secure voting
- **Rate limiting**: Built-in cooldown periods for OTP requests
- **Session management**: Secure token-based authentication
- **Anti-fraud measures**: One vote per email per case

## 🌐 API Integration

The frontend expects a REST API with the following endpoints:

### Search Endpoint
```
GET /api/v1/search?filter={filter}&value={query}&page={page}&size={size}
```

### Case Management
```
POST /api/v1/case/report          # Submit new case
POST /api/v1/case/{id}/vote       # Vote on case
```

### Verification
```
POST /api/v1/otp/send            # Send OTP
POST /api/v1/otp/verify          # Verify OTP
```

### Expected Response Format
```json
{
  "filter": "all",
  "value": "search term",
  "found": true,
  "message": "Found 25 results",
  "results": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "Scam Corp",
      "actions": "Tech Support",
      "description": "Fake tech support calls",
      "reportedBy": "User123",
      "createdAt": "2024-01-15T10:30:00Z",
      "verdictScore": 5,
      "totalVotes": 10,
      "guiltyVotes": 7,
      "notGuiltyVotes": 3
    }
  ],
  "pagination": {
    "currentPage": 0,
    "pageSize": 20,
    "totalPages": 5,
    "totalElements": 100,
    "hasNext": true,
    "hasPrevious": false,
    "isFirst": true,
    "isLast": false
  }
}
```

## 🚀 Production Deployment

### Environment Variables
Configure these environment variables for production:

```bash
# Required
VITE_API_URL=https://api.yourdomain.com

# Optional Feature Flags
VITE_ENABLE_REGISTRATION=false
VITE_ENABLE_SOCIAL_AUTH=false
VITE_ENABLE_ADVANCED_SEARCH=false
```

### Build for Production
```bash
# Install dependencies
npm ci

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to:
- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**
- **Azure Static Web Apps**

### Docker Deployment
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## ⚙️ Configuration

### Centralized Configuration
All configuration is centralized in `src/config/index.ts`:

- API endpoints and timeouts
- Validation rules and limits
- Feature flags for MVP vs full features
- UI settings (toast duration, debounce timing)
- Business rules (OTP expiry, vote limits)

### Feature Flags
Control feature availability through configuration:

```typescript
features: {
  enableRegistration: false,     // MVP: email verification only
  enableSocialAuth: false,       // Future: LinkedIn/Google auth
  enableAdvancedSearch: false,   // Future: complex search filters
  enableReports: true,           // MVP: basic reporting
  enableVoting: true,            // MVP: community voting
}
```

## 🛡️ Security Features

- **Input Sanitization**: All user inputs are sanitized
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: API token-based authentication
- **Rate Limiting**: Client-side rate limiting for API calls
- **Email Verification**: OTP-based verification system
- **Data Validation**: Comprehensive client and server validation

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Run tests and linting (`npm run lint && npm run type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow existing component patterns
- Add proper error handling
- Include loading states for async operations
- Write descriptive commit messages
- Update documentation for new features

## 📞 Support

For support and questions:
- **Email**: support@unveil.com
- **Issues**: [GitHub Issues](https://github.com/ochirtulga/unveil-frontend/issues)
- **Documentation**: See `/docs` folder for detailed guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ to make the internet a safer place
- Thanks to the open-source community for amazing tools
- Special thanks to all beta testers and contributors

---

**Ready for Production** • **Type Safe** • **Community Driven**