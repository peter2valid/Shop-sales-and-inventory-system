import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatCurrency } from '../config';
import ProductTable from '../components/ProductTable';
import { Plus, Search, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    quantity: '',
    price_each: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        product =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      const products = response.data.products || response.data || [];
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products. Please check your connection.');
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
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
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

      alert('Product added successfully!');
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
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

  const handleEdit = (product) => {
    alert('Edit functionality coming soon!');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
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
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

