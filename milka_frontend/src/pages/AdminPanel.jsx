import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatCurrency } from '../config';
import { Plus, X, Image as ImageIcon, Package, Upload, Check, AlertCircle } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    quantity: '',
    price_each: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Product suggestions for autocomplete
  const productSuggestions = [
    // Bakery & Snacks
    'Supa Loaf Bread', 'Festive Bread', 'Ringoz', 'Nuvita Biscuits', 'Bites', 'Mandazi',
    // Sweets & Confectionery
    'Big G', 'PK Chewing Gum', 'Orbit', 'Cadbury Chocolate', 'Tropical Mint', 'Lollipops',
    // Beverages
    'Coca-Cola', 'Fanta', 'Sprite', 'Azam Juice', 'Delmonte Juice', 'Dasani Water', 
    'Raha Drinking Water', 'Kericho Gold Tea', 'Nescafe', 'Milo',
    // Staples & Groceries
    'Jogoo Maize Flour', 'Ajab Wheat Flour', 'Pembe Maize Flour', 'Mumias Sugar', 'Dola Rice', 
    'Pearl Rice', 'Fortune Cooking Oil', 'Elianto Cooking Oil', 'Salt', 'Royco', 'Tea Leaves',
    // Toiletries
    'Sunlight Soap', 'Menengai Bar Soap', 'Geisha Soap', 'Colgate Toothpaste', 'Always Pads', 
    'Tissue Paper', 'Vaseline Jelly', 'Dettol',
    // Household & Cleaning
    'Omo', 'Ariel', 'Jik', 'Harpic', 'Matchbox', 'Scouring Pads', 'Plastic Cups', 'Brooms', 'Mops',
    // Dairy & Perishables
    'Tuzo Milk', 'Brookside Milk', 'KCC Butter', 'Eggs', 'Yogurt'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      const productList = response.data.products || response.data || [];
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Filter suggestions for product name
      if (name === 'name' && value.length > 0) {
        const filtered = productSuggestions.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else if (name === 'name' && value.length === 0) {
        setFilteredSuggestions([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.category || !formData.quantity || !formData.price_each) {
      setError('Please fill in all required fields');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('brand', formData.brand);
      productData.append('category', formData.category);
      productData.append('quantity', formData.quantity);
      productData.append('price_each', formData.price_each);
      if (formData.image) {
        productData.append('image', formData.image);
      }

      const response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Product added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reset form and close modal
      resetForm();
      setShowModal(false);
      
      // Refresh product list
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      quantity: '',
      price_each: '',
      image: null,
    });
    setImagePreview(null);
    setFilteredSuggestions([]);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`);
      setSuccess('Product deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.location.href = '/login';
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-gray-50 via-emerald-50 to-blue-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage inventory and products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Inventory
          </h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No products found. Click "Add Product" to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                          {product.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          product.quantity < 10 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(product.price_each)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Dialog open={showModal} onClose={() => { setShowModal(false); resetForm(); }} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Add New Product
              </Dialog.Title>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                  {filteredSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md mt-1 w-full max-h-60 overflow-auto">
                      {filteredSuggestions.slice(0, 5).map((item, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setFormData({ ...formData, name: item });
                            setFilteredSuggestions([]);
                          }}
                          className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-sm text-gray-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <optgroup label="Grocery Items">
                      <option value="Sugar">Sugar</option>
                      <option value="Flour & Baking">Flour & Baking</option>
                      <option value="Rice & Cereals">Rice & Cereals</option>
                      <option value="Cooking Oil & Fats">Cooking Oil & Fats</option>
                      <option value="Salt & Spices">Salt & Spices</option>
                      <option value="Snacks & Biscuits">Snacks & Biscuits</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Bread & Bakery">Bread & Bakery</option>
                      <option value="Sweets & Confectionery">Sweets & Confectionery</option>
                    </optgroup>
                    <optgroup label="Household">
                      <option value="Toiletries">Toiletries</option>
                      <option value="Cleaning & Detergents">Cleaning & Detergents</option>
                      <option value="Kitchenware">Kitchenware</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Batteries & Accessories">Batteries & Accessories</option>
                    </optgroup>
                    <optgroup label="Others">
                      <option value="Fresh Produce">Fresh Produce</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Baby Products">Baby Products</option>
                      <option value="Other / Miscellaneous">Other / Miscellaneous</option>
                    </optgroup>
                  </select>
                </div>

                {/* Quantity and Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Each (KES) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price_each"
                      value={formData.price_each}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : (
                    <>
                      <Upload className="w-4 h-4" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminPanel;

