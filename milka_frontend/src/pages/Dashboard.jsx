import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatCurrency } from '../config';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Banknote,
  Package
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [report, setReport] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch daily report
      const reportRes = await axios.get(`${API_BASE_URL}/reports/daily`);
      setReport(reportRes.data);
      
      // Fetch products for stock count
      const productsRes = await axios.get(`${API_BASE_URL}/products`);
      const productList = productsRes.data.products || productsRes.data || [];
      setProducts(productList);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart colors
  const CHART_COLORS = {
    bar: '#10B981', // Emerald green
    pie: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5']
  };

  // Prepare bar chart data
  const barChartData = report?.products?.map(product => ({
    name: product.product_name,
    total_sales_amount: product.total_sales_amount
  })) || [];

  // Prepare pie chart data
  const pieChartData = report?.products?.map(product => ({
    name: product.product_name,
    value: product.total_quantity_sold
  })) || [];

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    totalProductsSold: report?.summary?.total_quantity_sold || 0,
    totalSalesAmount: report?.summary?.total_sales_amount || 0,
    productsInStock: products.length
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-gray-50">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Products Sold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Products Sold</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProductsSold}</p>
          </div>
        </motion.div>

        {/* Total Sales Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Banknote className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Sales Amount</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSalesAmount)}</p>
          </div>
        </motion.div>

        {/* Products in Stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Products in Stock</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.productsInStock}</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Sales by Product */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              {barChartData.length > 0 ? (
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `KES ${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar 
                    dataKey="total_sales_amount" 
                    fill={CHART_COLORS.bar} 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No sales recorded today
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart - Quantity Sold by Product */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity Sold by Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              {pieChartData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CHART_COLORS.pie[index % CHART_COLORS.pie.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No sales recorded today
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Sales Summary Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity Sold</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Sales (KES)</th>
                </tr>
              </thead>
              <tbody>
                {report?.products && report.products.length > 0 ? (
                  report.products.map((product, index) => (
                    <motion.tr
                      key={product.product_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {product.product_name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {product.total_quantity_sold}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">
                        {formatCurrency(product.total_sales_amount)}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">
                      No sales recorded today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
