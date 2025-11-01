# Project Structure - Milka Shop Juja POS Dashboard

```
milka_frontend/
│
├── 📄 Configuration Files
│   ├── package.json           # Dependencies and scripts
│   ├── vite.config.js         # Vite build configuration
│   ├── tailwind.config.js     # TailwindCSS theme config
│   ├── postcss.config.js      # PostCSS configuration
│   ├── index.html             # HTML entry point
│   └── .gitignore            # Git ignore rules
│
├── 📁 src/
│   │
│   ├── 📄 Core Files
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Main app with routing
│   │   ├── config.js          # API configuration & utilities
│   │   └── index.css          # Global styles & Tailwind directives
│   │
│   ├── 📁 components/         # Reusable UI components
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── TopBar.jsx         # Top navigation bar
│   │   ├── StatCard.jsx       # Statistics card component
│   │   ├── ChartCard.jsx      # Chart container component
│   │   └── ProductTable.jsx   # Products table with actions
│   │
│   └── 📁 pages/              # Page components
│       ├── Dashboard.jsx      # Main dashboard with charts
│       ├── Products.jsx       # Product management
│       ├── Sales.jsx          # Sales recording
│       ├── Reports.jsx        # Analytics & reports
│       ├── Payments.jsx       # M-Pesa integration
│       └── Settings.jsx       # Admin settings
│
├── 📄 Documentation
│   ├── README.md             # Main documentation
│   ├── QUICKSTART.md         # Quick start guide
│   └── PROJECT_STRUCTURE.md  # This file
│
└── 📦 Build Output (generated)
    └── dist/                 # Production build files

```

## File Descriptions

### Configuration
- **package.json**: Defines project dependencies (React, Vite, Recharts, etc.)
- **vite.config.js**: Configures Vite dev server and build options
- **tailwind.config.js**: Customizes Tailwind theme with brand colors
- **postcss.config.js**: Sets up PostCSS processing
- **index.html**: HTML template with font imports

### Core Application
- **main.jsx**: Initializes React app and mounts to DOM
- **App.jsx**: Sets up React Router and page structure
- **config.js**: Centralizes API URL and utility functions
- **index.css**: Global styles and Tailwind directives

### Components
- **Sidebar.jsx**: Fixed sidebar navigation with active state
- **TopBar.jsx**: Top bar with search, notifications, and user info
- **StatCard.jsx**: Reusable stat card with icon and trend indicators
- **ChartCard.jsx**: Container for chart components
- **ProductTable.jsx**: Product table with search, edit, delete

### Pages
- **Dashboard.jsx**: Overview with stats, charts, and recent sales
- **Products.jsx**: CRUD for products with image upload
- **Sales.jsx**: Record sales with stock validation
- **Reports.jsx**: Analytics with line/bar charts
- **Payments.jsx**: M-Pesa STK push integration
- **Settings.jsx**: Admin profile and theme toggle

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router | Navigation |
| TailwindCSS | Styling |
| Recharts | Data Visualization |
| Lucide React | Icons |
| Axios | HTTP Client |
| PostCSS | CSS Processing |

## Data Flow

```
User Action → Component → Axios Request → Flask API
                 ↓                             ↓
            State Update ← Response Data ← Database
```

## Key Features

1. **Responsive Design**: Mobile-first TailwindCSS
2. **Real-time Updates**: Auto-refresh on data changes
3. **Error Handling**: Try-catch with user feedback
4. **Loading States**: Spinners during API calls
5. **Form Validation**: Client-side checks
6. **Image Upload**: Preview before submission
7. **Charts**: Interactive Recharts visualizations
8. **Theme Support**: Dark mode toggle

## API Integration

All API calls go through `src/config.js`:
- `API_BASE_URL`: Centralized endpoint
- `formatCurrency()`: Currency formatting
- `formatDate()`: Date formatting

## Styling Approach

- **Utility-first**: Tailwind CSS classes
- **Component-based**: Reusable styled components
- **Theme-aware**: Custom colors in config
- **Responsive**: Mobile/tablet/desktop breakpoints

## Development Workflow

1. Edit source files in `src/`
2. Run `npm run dev` for development
3. Hot reload on save
4. Build with `npm run build`
5. Preview with `npm run preview`

## Future Enhancements

- [ ] Add authentication/login
- [ ] Implement edit product modal
- [ ] Add export reports (PDF/Excel)
- [ ] Real M-Pesa payment history
- [ ] Advanced search/filter
- [ ] Multi-user support
- [ ] Notification system
- [ ] Backup/restore data

