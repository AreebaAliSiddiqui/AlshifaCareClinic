'use client';

import { useState } from 'react';
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

  // Add item to cart (you can call this from homepage buttons later)
  const addToCart = (item: any) => {
    setCart([...cart, item]);
    alert(`✅ Added: ${item.title || item.name}`);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);

    const orderData = {
      customer_name: formData.customer_name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price || 0), 0),
      status: 'new',
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('orders')
      .insert([orderData]);

    setLoading(false);

    if (error) {
      alert("Error placing order: " + error.message);
    } else {
      setSuccess(true);
      setCart([]);
      setFormData({ customer_name: '', phone: '', address: '', notes: '' });
      alert("🎉 Order placed successfully! We will contact you soon.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center text-emerald-800 mb-4">Place Your Order</h1>
        <p className="text-center text-gray-600 mb-12">Fill the form below • We deliver in Mirpur Khas & Sindh</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Cart */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Cart ({cart.length} items)</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">No items yet. Go back to homepage and add remedies.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-medium">{item.title || item.name}</p>
                      <p className="text-emerald-600 font-bold">Rs. {item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <p className="text-xl font-bold text-right">
                    Total: Rs. {cart.reduce((sum, item) => sum + (item.price || 0), 0)}
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
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500 h-24"
                    placeholder="Full address with landmarks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Any Notes / Special Instructions</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500 h-20"
                    placeholder="e.g. Deliver after 5 PM"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-3xl text-lg font-semibold transition"
                >
                  {loading ? "Placing Order..." : "Confirm & Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
