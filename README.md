# Unveil - Find Out Truth

A modern React application for scammer search and verification. Search our comprehensive database to verify suspicious contacts and protect yourself from scams.

## ✨ Features

- 🔍 **Advanced Search** - Search by name, email, phone, or company
- 📊 **Real-time Results** - Get instant verification with detailed information
- 📱 **Responsive Design** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Built with Vite and optimized components
- 🎨 **Modern UI** - Clean, minimalist design with Tailwind CSS
- 🔒 **Type Safe** - Full TypeScript support
- 📄 **Pagination** - Navigate through large result sets efficiently
- 🎯 **Smart Filtering** - Filter searches by specific data types

## 🚀 Current Status

### ✅ Completed Features
- [x] Homepage with hero section
- [x] Search form with multiple filter options
- [x] Search results display with pagination
- [x] Popular searches suggestions
- [x] Recent reports feed
- [x] Responsive navigation header
- [x] API integration for search functionality
- [x] Loading states and error handling
- [x] Clean, minimal design system

### 🚧 In Development
- [ ] Search results page (dedicated route)
- [ ] Report scammer functionality
- [ ] About page
- [ ] Help/FAQ page
- [ ] User authentication
- [ ] Report details modal/page

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
- Backend API running (default: http://localhost:8080)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unveil-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional)
   ```bash
   # Create .env file if you need to customize API URL
   echo "VITE_API_URL=http://localhost:8080" > .env
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
│   ├── features/         # Feature-specific components
│   │   ├── HeroSection.tsx
│   │   ├── SearchForm.tsx
│   │   ├── SearchResults.tsx
│   │   ├── PopularSearches.tsx
│   │   ├── RecentReports.tsx
│   │   └── Homepage.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── ui/              # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/               # Custom React hooks
│   └── useSearch.ts     # Search functionality hook
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🔍 Search Functionality

The app provides comprehensive search capabilities:

### Search Filters
- **All Fields** - Search across all available data
- **Name** - Search by person name
- **Email** - Search by email address  
- **Phone** - Search by phone number
- **Company** - Search by company name

### Search Results
- Clean table layout with sortable columns
- Pagination for large result sets
- Loading states and error handling
- No results messaging

### API Integration
- RESTful API integration via custom `useSearch` hook
- Real-time search with debouncing
- Error handling and retry logic
- Type-safe API responses

## 🎨 Design System

The app follows a minimalist design philosophy:

- **Typography**: Inter font family with light/medium weights
- **Colors**: Neutral slate palette with minimal accent colors
- **Spacing**: Generous whitespace and clean layouts
- **Components**: Reusable, composable UI components
- **Responsive**: Mobile-first design approach

## 🌐 API Configuration

The frontend expects a REST API with the following endpoint:

```
GET /api/v1/search?filter={filter}&value={query}&page={page}&size={size}
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
      "scamType": "Tech Support",
      "description": "Fake tech support calls",
      "reportedBy": "User123",
      "createdAt": "2024-01-15T10:30:00Z"
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

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Environment Variables
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm run type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@unveil.com
- Issues: [GitHub Issues](https://github.com/your-username/unveil-frontend/issues)

---

**Built with ❤️ to make the internet a safer place**