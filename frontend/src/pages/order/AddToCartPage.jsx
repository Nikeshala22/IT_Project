// AddToCartPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddToCartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/inventory/view-sparepart/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Calculate the total price based on quantity
    const total = product.price * quantity;
    
    // Create a product object with necessary details
    const cartProduct = {
      id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    };
    
    // Get existing cart items or initialize empty array
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    let cartTotal = parseFloat(sessionStorage.getItem('cartTotal')) || 0;
    
    // Check if product already exists in cart
    const existingProductIndex = cartItems.findIndex(item => item.id === id);
    
    if (existingProductIndex >= 0) {
      // Update quantity if product already in cart
      cartItems[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cartItems.push(cartProduct);
    }

    // Update total
    cartTotal += total;

    // Store updated cart and total in session storage
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    sessionStorage.setItem('cartTotal', cartTotal);

    // Navigate to checkout with the products and total
    navigate('/shoppingcart', { 
      state: { 
        products: cartItems,
        total: cartTotal 
      } 
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center text-purple-600">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
          <span className="text-lg">Loading product details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
          <h1 className="text-3xl font-bold text-purple-800 mb-8">Product Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-purple-100 shadow-sm">
              <img 
                src={product.image || 'https://via.placeholder.com/400?text=No+Image'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-purple-800 mb-2">{product.name}</h2>
                <div className="flex items-center mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-semibold rounded-full">
                    {product.category || 'General'}
                  </span>
                </div>
                <p className="text-xl font-medium text-green-600 mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-purple-600">{product.details}</p>
              </div>
              
              <div className="pt-4 border-t border-purple-100">
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-purple-100 text-purple-700 rounded-l-lg flex items-center justify-center hover:bg-purple-200 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 border-y border-purple-200 text-center focus:outline-none focus:ring-0 focus:border-purple-300"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-purple-100 text-purple-700 rounded-r-lg flex items-center justify-center hover:bg-purple-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="text-sm text-purple-700 mb-2">
                  Subtotal: <span className="font-semibold">${(product.price * quantity).toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPage;