import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatCurrency } from '../config';
import { Phone, DollarSign, Package, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Payments = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchPaymentHistory();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      const products = response.data.products || response.data || [];
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      // Mock payment history - replace with actual endpoint when available
      const mockHistory = [
        {
          id: 1,
          phone: '+254712345678',
          amount: 5000,
          product: 'iPhone 14',
          status: 'Paid',
          date: new Date().toISOString(),
        },
        {
          id: 2,
          phone: '+254798765432',
          amount: 3500,
          product: 'Samsung Galaxy',
          status: 'Pending',
          date: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setPaymentHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    const phoneRegex = /^(\+254|0)?[712][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setErrorMessage('Please enter a valid M-Pesa phone number (e.g., +254712345678)');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (!selectedProduct || !amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please select a product and enter a valid amount.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      const paymentData = {
        phone_number: phone.replace(/\s/g, ''),
        amount: parseFloat(amount),
        product_id: parseInt(selectedProduct),
      };

      const response = await axios.post(`${API_BASE_URL}/mpesa/prompt`, paymentData);
      
      setSuccessMessage('M-Pesa STK push sent! Please check your phone to complete the payment.');
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Reset form
      setSelectedProduct('');
      setPhone('');
      setAmount('');
      
      // Refresh payment history
      fetchPaymentHistory();
    } catch (error) {
      console.error('Error initiating payment:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to initiate payment. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Paid: { icon: CheckCircle, color: 'green', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      Pending: { icon: Clock, color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      Failed: { icon: AlertCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    };
    
    const badge = badges[status] || badges.Pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} ${badge.border} border`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const selectedProductData = products.find(p => p.id === parseInt(selectedProduct));

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Initiate M-Pesa Payment</h3>
            
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
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+254712345678"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: +254712345678</p>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product <span className="text-red-500">*</span>
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
                      {product.name} - {formatCurrency(product.price_each)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (KES) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Selected Product Info */}
              {selectedProductData && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    {selectedProductData.image_url && (
                      <img
                        src={selectedProductData.image_url}
                        alt={selectedProductData.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{selectedProductData.name}</p>
                      <p className="text-xs text-gray-600">{selectedProductData.brand}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !selectedProduct || !phone || !amount}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? 'Sending...' : 'Send STK Push'}
              </button>
            </form>
          </div>
        </div>

        {/* Payment History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No payment history available
                      </td>
                    </tr>
                  ) : (
                    paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{payment.phone}</td>
                        <td className="py-3 px-4 text-gray-600">{payment.product}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(payment.date).toLocaleDateString()}
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

export default Payments;

