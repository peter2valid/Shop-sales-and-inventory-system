# Quick Start Guide - Milka Shop Juja POS Dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher) installed
- npm or yarn package manager
- Flask API backend running on http://127.0.0.1:5000

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   The app will automatically open at `http://localhost:3000`

## 📋 Testing the Application

### 1. Dashboard
- View overall statistics and charts
- Check recent sales and stock updates
- Review category distribution

### 2. Products
- Click "Add Product" to create a new product
- Fill in: name, brand, category, quantity, price, and image
- Use search bar to filter products
- Edit or delete products using action buttons

### 3. Sales
- Select a product from the dropdown
- Enter quantity to sell
- Click "Record Sale" to process
- Stock levels update automatically

### 4. Reports
- View revenue trends and analytics
- Check most sold items
- Review sales volume charts

### 5. Payments
- Enter customer phone number (M-Pesa format)
- Select product
- Enter payment amount
- Click "Send STK Push"

### 6. Settings
- Update admin profile information
- Toggle dark mode
- View system information

## 🔧 Troubleshooting

### Backend Connection Issues
- Ensure Flask API is running on port 5000
- Check CORS settings in Flask backend
- Verify API_BASE_URL in `src/config.js`

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Styling Issues
- Ensure TailwindCSS is properly configured
- Check `tailwind.config.js` for correct paths
- Run build: `npm run build`

## 📝 API Configuration

Update the API URL in `src/config.js`:
```javascript
export const API_BASE_URL = 'http://127.0.0.1:5000';
```

For production, change to your live URL:
```javascript
export const API_BASE_URL = 'https://your-username.pythonanywhere.com';
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change theme colors:
```javascript
colors: {
  primary: {
    DEFAULT: '#14532d',  // Emerald green
  },
  cream: '#fffaf2',
}
```

### Fonts
Change fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

## 📦 Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Output will be in the `dist` folder.

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review API endpoint requirements
- Ensure all dependencies are up to date

