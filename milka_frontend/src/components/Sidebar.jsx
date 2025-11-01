import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  CreditCard, 
  Settings 
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/sales', icon: ShoppingCart, label: 'Sales' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col shadow-lg">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-cream">
          <span className="text-primary-500">Milka</span> Shop
        </h1>
        <p className="text-xs text-slate-400 mt-1">Juja POS Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-center text-slate-500">
          © 2024 Milka Shop Juja
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

