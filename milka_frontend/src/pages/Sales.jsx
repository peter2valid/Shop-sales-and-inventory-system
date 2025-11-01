import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatCurrency } from '../config';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchRecentSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      const products = response.data.products || response.data || [];
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products. Please check your connection.');
    }
  };

  const fetchRecentSales = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sales`);
      const sales = response.data.sales || response.data || [];
      const recent = sales.slice(-10).reverse();
      setRecentSales(recent);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || quantity <= 0) {
      setErrorMessage('Please select a product and enter a valid quantity.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProduct));
    
    if (!product) {
      setErrorMessage('Selected product not found.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (parseInt(quantity) > product.quantity) {
      setErrorMessage(`Insufficient stock. Available: ${product.quantity}`);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      const saleData = {
        product_id: parseInt(selectedProduct),
        quantity_sold: parseInt(quantity),
        price_per_unit: parseFloat(product.price_each),
      };

      const response = await axios.post(`${API_BASE_URL}/sales`, saleData);
      
      setSuccessMessage(`Sale recorded successfully! Total: ${formatCurrency(response.data.total_amount)}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Reset form
      setSelectedProduct('');
      setQuantity('');
      
      // Refresh data
      fetchProducts();
      fetchRecentSales();
    } catch (error) {
      console.error('Error recording sale:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to record sale. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProductData = products.find(p => p.id === parseInt(selectedProduct));

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record Sale Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Record New Sale</h3>
            
            {/* Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">-- Select Product --</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.brand} (Stock: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Details */}
              {selectedProductData && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    {selectedProductData.image_url && (
                      <img
                        src={selectedProductData.image_url}
                        alt={selectedProductData.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{selectedProductData.name}</p>
                      <p className="text-sm text-gray-600">{selectedProductData.brand}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Unit Price:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(selectedProductData.price_each)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Stock:</span>
                    <span className={`font-medium ${
                      selectedProductData.quantity < 10 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {selectedProductData.quantity}
                    </span>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="1"
                  max={selectedProductData?.quantity || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Total Calculation */}
              {selectedProductData && quantity && parseInt(quantity) > 0 && (
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                    <span className="text-xl font-bold text-primary-700">
                      {formatCurrency(parseFloat(selectedProductData.price_each) * parseInt(quantity))}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !selectedProduct || !quantity}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? 'Recording...' : 'Record Sale'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Unit Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No sales recorded yet
                      </td>
                    </tr>
                  ) : (
                    recentSales.map((sale) => (
                      <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          {sale.product_name || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{sale.quantity_sold}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatCurrency(sale.price_per_unit)}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {formatCurrency((sale.quantity_sold || 0) * (sale.price_per_unit || 0))}
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(sale.sale_date || sale.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;

