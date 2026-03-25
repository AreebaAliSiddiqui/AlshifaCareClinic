'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrderPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load cart from localStorage when page loads
  useEffect(() => {
    const savedCart = localStorage.getItem('clinicCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clinicCart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    const orderData = {
      customer_name: formData.customer_name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      items: cart,
      total: cart.reduce((sum, item) => sum + Number(item.price || 0), 0),
      status: 'new',
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('orders').insert([orderData]);

    setLoading(false);

    if (error) {
      alert("Failed to place order: " + error.message);
    } else {
      setSuccess(true);
      localStorage.removeItem('clinicCart'); // Clear cart after successful order
      setCart([]);
      setFormData({ customer_name: '', phone: '', address: '', notes: '' });
      alert("🎉 Order placed successfully! We will contact you soon on your phone.");
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('clinicCart');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center text-emerald-800 mb-4">Place Your Order</h1>
        <p className="text-center text-gray-600 mb-12">Mirpur Khas • Fast Delivery</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Cart Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Cart ({cart.length} items)</h2>
              {cart.length > 0 && (
                <button onClick={clearCart} className="text-red-500 text-sm hover:underline">
                  Clear Cart
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center">
                <p className="text-gray-500">Your cart is empty.</p>
                <a href="/" className="text-emerald-600 mt-4 inline-block hover:underline">← Browse Remedies</a>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-3xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-medium">{item.title || item.name}</p>
                      <p className="text-emerald-600 font-bold">Rs. {item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="pt-6 border-t text-right">
                  <p className="text-2xl font-bold text-emerald-800">
                    Total: Rs. {cart.reduce((sum, item) => sum + Number(item.price || 0), 0)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500 h-24"
                    placeholder="Full address with landmarks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes / Instructions (optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500 h-20"
                    placeholder="Any special instructions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-3xl text-lg font-semibold transition mt-4"
                >
                  {loading ? "Placing Order..." : `Confirm Order - Rs. ${cart.reduce((sum, item) => sum + Number(item.price || 0), 0)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
