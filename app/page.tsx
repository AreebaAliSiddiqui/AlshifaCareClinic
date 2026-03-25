import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data: deals } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
  const { data: products } = await supabase.from('products').select('*').limit(8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAV */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl">🌿</div>
            <h1 className="text-2xl font-bold text-emerald-800">Dr. Areeba Clinic</h1>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#deals" className="hover:text-emerald-600">Deals</a>
            <a href="#shop" className="hover:text-emerald-600">Shop</a>
            <a href="/order" className="hover:text-emerald-600 font-semibold">Place Order</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="bg-gradient-to-br from-emerald-700 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Natural Healing,<br />Delivered Fast</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-md mx-auto">Mirpur Khas • Special deals • Same day order</p>
          <a href="/order" className="inline-block bg-white text-emerald-700 px-10 py-4 rounded-3xl text-lg font-semibold">Place Your Order Now</a>
        </div>
      </header>

      {/* DEALS */}
      <section id="deals" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">🔥 Today’s Special Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deals && deals.map((deal: any) => (
            <div key={deal.id} className="bg-white rounded-3xl overflow-hidden shadow-md">
              <div className="h-52 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-8xl">
                {deal.emoji || '💊'}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-2xl">{deal.title}</h3>
                <p className="text-emerald-600 text-3xl font-bold mt-2">Rs. {deal.price}</p>
                <button 
                  onClick={() => {
                    // This will be improved later with client component
                    alert(`Added ${deal.title} to cart! Go to /order to complete.`);
                  }}
                  className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-3xl font-semibold transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Popular Remedies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products && products.map((p: any) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-3xl p-6 text-center hover:shadow-xl transition">
                <div className="text-7xl mb-6">{p.emoji || '🧪'}</div>
                <h3 className="font-semibold text-xl mb-2">{p.name}</h3>
                <p className="text-emerald-600 font-bold text-2xl mb-6">Rs. {p.price}</p>
                <button 
                  onClick={() => alert(`Added ${p.name} to cart! Go to /order`)}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-3xl font-medium transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 text-center text-sm">
        © Dr. Areeba Homeopathic Clinic • Mirpur Khas, Sindh • Fast Natural Healing
      </footer>
    </div>
  );
}
