# Milka Shop Juja - POS Dashboard

A modern React + Vite Point of Sale dashboard application for managing products, sales, payments, and reports.

## Features

- 🎨 **Modern Dashboard UI** - Clean, professional design with dark sidebar and gradient accents
- 📊 **Interactive Charts** - Real-time data visualization with Recharts
- 📦 **Product Management** - Add, edit, delete products with image upload
- 💰 **Sales Recording** - Quick and easy sale recording with stock tracking
- 📈 **Analytics & Reports** - Daily, weekly, and monthly sales insights
- 💳 **M-Pesa Integration** - STK push payment processing
- ⚙️ **Settings** - Admin profile and dark mode toggle
- 📱 **Responsive Design** - Works seamlessly on tablets and desktops

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Axios** - API communication

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd milka_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Configuration

The API endpoint is configured in `src/config.js`. Update the `API_BASE_URL` to point to your backend:

```javascript
export const API_BASE_URL = 'http://127.0.0.1:5000';
```

For production, change this to your live URL (e.g., PythonAnywhere).

## Backend API Endpoints

This frontend expects the following endpoints:

- `GET /products` - Fetch all products
- `POST /products` - Create new product
- `DELETE /products/:id` - Delete product
- `GET /sales` - Fetch all sales
- `POST /sales` - Record new sale
- `GET /reports/daily` - Get daily reports
- `POST /mpesa/prompt` - Initiate M-Pesa STK push
- `GET /admin` - Get admin info
- `PUT /admin` - Update admin info

## Project Structure

```
milka_frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── StatCard.jsx
│   │   ├── ChartCard.jsx
│   │   └── ProductTable.jsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Sales.jsx
│   │   ├── Reports.jsx
│   │   ├── Payments.jsx
│   │   └── Settings.jsx
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # Entry point
│   ├── config.js        # API configuration
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Build for Production

```bash
npm run build
```

The optimized production files will be in the `dist` folder.

## License

Copyright © 2024 Milka Shop Juja

