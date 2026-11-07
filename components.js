// js/components.js
function render404() {
    contentDiv.innerHTML = `
        <main class="pt-40 pb-24 px-6 flex flex-col items-center justify-center min-h-[80vh] text-center fade-in">
            <h1 class="font-serif text-4xl sm:text-6xl uppercase tracking-widest mb-6">THIS SPACE IS YET TO BE DISCOVERED.</h1>
            <p class="font-sans text-brand-obsidian/70 mb-10 max-w-lg mx-auto">The page you're looking for may have moved or no longer exists in our collections.</p>
            <div class="flex gap-4 justify-center">
                <a href="#home" class="btn-primary px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]">Return Home</a>
                <a href="#collections" class="btn-secondary px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]">Explore Collections</a>
            </div>
        </main>
    `;
}

function renderTextPage(title, content) {
    contentDiv.innerHTML = `
        <main class="pt-32 pb-24 px-6 lg:px-12 max-w-[800px] mx-auto min-h-screen fade-in">
            <h1 class="font-serif text-3xl sm:text-4xl uppercase tracking-widest mb-10 text-center">${title}</h1>
            <div class="font-sans text-brand-obsidian/80 font-light leading-loose text-sm sm:text-base text-center">
                <p>${content}</p>
                <p class="mt-6">For further assistance, please visit our <a href="#contact" class="underline hover:text-brand-taupe">Contact page</a>.</p>
            </div>
        </main>
    `;
}

function generateProductCards(productsArray) {
    if(productsArray.length === 0) return `<div class="col-span-full text-center py-20 font-serif text-2xl text-brand-obsidian/50">No products found.</div>`;
    return productsArray.map(p => `
        <div class="group flex flex-col hover-trigger">
            <div class="relative aspect-[4/5] bg-brand-champagne/30 overflow-hidden mb-4">
                ${p.stock === 0 ? '<div class="absolute top-4 left-4 z-10 bg-brand-taupe text-brand-porcelain text-[9px] font-sans font-medium tracking-[0.2em] uppercase px-3 py-1.5 shadow-sm">Sold Out</div>' : ''}
                <a href="#product/${p.slug}" class="block w-full h-full" aria-label="View ${p.name}">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </a>
                <button onclick="shareProduct('${window.location.origin}${window.location.pathname}#product/${p.slug}', '${p.name}')" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-brand-porcelain/80 flex items-center justify-center hover:bg-brand-obsidian hover:text-brand-porcelain transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian" aria-label="Share ${p.name}">
                    <i class="ri-share-forward-line text-sm"></i>
                </button>
            </div>
            <span class="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-taupe">${p.category}</span>
            <a href="#product/${p.slug}" class="font-serif text-lg text-brand-obsidian hover:text-brand-taupe transition-colors leading-tight mt-1">${p.name}</a>
            <span class="font-sans text-sm font-medium mt-1">$${p.price}</span>
        </div>
    `).join('');
}

function renderProductGrid(title, productsArray) {
    const publishedProducts = productsArray.filter(p => p.status === 'published');
    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen fade-in">
            <header class="mb-12 text-center">
                <h1 class="font-serif text-4xl uppercase tracking-widest mb-4">${title}</h1>
                <p class="font-sans text-brand-obsidian/60 text-sm">${publishedProducts.length} Products</p>
            </header>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                ${generateProductCards(publishedProducts)}
            </div>
        </main>
    `;
}

function renderSearch(hash) {
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const query = urlParams.get('q') || '';
    const results = db.products.filter(p => p.status === 'published' && (p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())));
    
    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen fade-in">
            <header class="mb-12 text-center max-w-2xl mx-auto">
                <form onsubmit="executeSearch(event)" class="mb-8">
                    <input type="text" id="searchInput" value="${query}" placeholder="Search products..." class="w-full bg-transparent border-b-2 border-brand-obsidian text-3xl font-serif py-4 focus:outline-none placeholder:text-brand-obsidian/20 text-center" aria-label="Search products" />
                </form>
                <p class="font-sans text-brand-obsidian/60 text-sm">${results.length} Results for "${query}"</p>
            </header>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                ${generateProductCards(results)}
            </div>
        </main>
    `;
}

function renderHome() {
    const featured = generateProductCards(db.products.filter(p=> p.status === 'published' && p.isFeatured).slice(0,4));
    
    contentDiv.innerHTML = `
        <section class="relative h-[90vh] w-full flex items-center justify-center overflow-hidden fade-in">
            <div class="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop" alt="Luxury Interior" class="w-full h-full object-cover" fetchpriority="high" />
                <div class="absolute inset-0 bg-brand-obsidian/40"></div>
            </div>
            <div class="relative z-10 text-center text-brand-porcelain px-6 flex flex-col items-center">
                <span class="font-sans text-xs uppercase tracking-[0.3em] font-medium mb-4 text-brand-champagne">${db.settings.heroSub || 'The Art of Refined Living'}</span>
                <h1 class="font-serif text-5xl sm:text-7xl font-bold mb-8 leading-none tracking-tight">${db.settings.heroHeading}</h1>
                <a href="#shop" class="btn-secondary px-10 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] bg-transparent text-brand-porcelain border-brand-porcelain hover:bg-brand-porcelain hover:text-brand-obsidian">Explore Collection</a>
            </div>
        </section>
        
        <section class="py-24 px-6 max-w-[1400px] mx-auto fade-in">
            <div class="flex justify-between items-end mb-12 border-b border-brand-obsidian/10 pb-4">
                <h2 class="font-serif text-3xl uppercase tracking-widest">Featured Curations</h2>
                <a href="#new-arrivals" class="font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:text-brand-taupe transition-colors">View All New</a>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                ${featured}
            </div>
        </section>

        <section class="py-24 bg-brand-obsidian text-brand-porcelain fade-in">
            <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
                <div class="text-center mb-16">
                    <h2 class="font-serif text-3xl sm:text-4xl uppercase tracking-widest mb-4">Explore by Room</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    ${db.collections.slice(0,3).map(c => `
                        <a href="#collection/${c.id}" class="group relative aspect-[3/4] sm:aspect-square overflow-hidden bg-brand-charcoal hover-trigger block">
                            <img src="${c.image}" alt="${c.name}" class="w-full h-full object-cover hover-target opacity-70 group-hover:opacity-100 transition-opacity duration-500" loading="lazy" />
                            <div class="absolute inset-0 bg-brand-obsidian/30 group-hover:bg-transparent transition-colors"></div>
                            <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                                <h3 class="font-serif text-2xl tracking-widest uppercase drop-shadow-md mb-2">${c.name}</h3>
                                <span class="font-sans text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Explore</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderCollectionsIndex() {
    const colsHTML = db.collections.map(c => `
        <a href="#collection/${c.id}" class="group relative aspect-[4/3] overflow-hidden bg-brand-obsidian hover-trigger block">
            <img src="${c.image}" alt="${c.name}" class="w-full h-full object-cover hover-target opacity-80 group-hover:opacity-100 transition-opacity duration-500" loading="lazy" />
            <div class="absolute inset-0 bg-brand-obsidian/40 group-hover:bg-brand-obsidian/20 transition-colors"></div>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <h3 class="font-serif text-3xl tracking-widest uppercase drop-shadow-md mb-2">${c.name}</h3>
                <p class="font-sans text-xs font-light opacity-80 mt-2 max-w-xs mx-auto hidden sm:block">${c.desc}</p>
            </div>
        </a>
    `).join('');
    
    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto min-h-screen fade-in">
            <header class="mb-12 text-center border-b border-brand-obsidian/10 pb-8">
                <h1 class="font-serif text-4xl uppercase tracking-widest mb-4">All Collections</h1>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${colsHTML}
            </div>
        </main>
    `;
}

function renderCollection(colId) {
    const collection = db.collections.find(c => c.id === colId);
    if(!collection) return render404();
    renderProductGrid(collection.name, db.products.filter(p => p.collection === colId));
}

function renderJournal() {
    const articles = db.journal.map(j => `
        <article class="flex flex-col md:flex-row gap-8 items-center border-b border-brand-obsidian/10 pb-12 mb-12 last:border-0 last:mb-0">
            <div class="w-full md:w-1/2 aspect-[4/3] bg-brand-champagne/30 overflow-hidden">
                <img src="${j.image}" alt="${j.title}" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="w-full md:w-1/2">
                <span class="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-taupe block mb-4">${j.date}</span>
                <h2 class="font-serif text-3xl lg:text-4xl mb-6 text-brand-obsidian">${j.title}</h2>
                <p class="font-sans text-brand-obsidian/70 font-light leading-relaxed mb-8">${j.excerpt}</p>
                <a href="#about" class="font-sans text-xs uppercase tracking-widest font-semibold border-b border-brand-obsidian pb-1 hover:text-brand-taupe hover:border-brand-taupe transition-colors">Read Article</a>
            </div>
        </article>
    `).join('');

    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen fade-in">
            <header class="mb-16 text-center border-b border-brand-obsidian/10 pb-8">
                <h1 class="font-serif text-4xl uppercase tracking-widest mb-4">The Journal</h1>
                <p class="font-sans text-brand-obsidian/60 text-sm">Editorial reflections on the art of refined living.</p>
            </header>
            <div>${articles}</div>
        </main>
    `;
}

function renderProduct(slug) {
    const product = db.products.find(p => p.slug === slug && p.status === 'published');
    if(!product) return render404();
    
    trackRecentProduct(product.id);
    const currentUrl = window.location.origin + window.location.pathname + '#product/' + product.slug;
    const related = db.products.filter(p => p.id !== product.id && p.category === product.category && p.status === 'published').slice(0,4);

    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen fade-in">
            <div class="flex justify-between items-center mb-8">
                <div class="flex font-sans text-[10px] uppercase tracking-[0.2em] text-brand-taupe gap-2 flex-wrap">
                    <a href="#home" class="hover:text-brand-obsidian transition-colors">Home</a> / 
                    <a href="#shop" class="hover:text-brand-obsidian transition-colors">Shop</a> / 
                    <span class="text-brand-obsidian">${product.name}</span>
                </div>
                
                <div class="relative group">
                    <button onclick="shareProduct('${currentUrl}', '${product.name}')" class="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-obsidian hover:text-brand-taupe transition-colors border border-brand-obsidian/20 px-3 py-1.5 rounded-sm hover:border-brand-taupe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian" aria-label="Share ${product.name}">
                        <i class="ri-share-forward-line text-sm"></i> Share
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                <div class="lg:col-span-7">
                    <div class="aspect-[4/5] bg-brand-champagne/20 w-full overflow-hidden">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />
                    </div>
                </div>
                
                <div class="lg:col-span-5 flex flex-col lg:sticky lg:top-32 lg:self-start">
                    <span class="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-taupe mb-2">${product.category}</span>
                    <h1 class="font-serif text-3xl sm:text-4xl text-brand-obsidian mb-4 leading-tight">${product.name}</h1>
                    
                    <div class="flex items-center gap-4 mb-6">
                        <span class="font-sans text-2xl font-medium tracking-wide text-brand-obsidian">$${product.price}</span>
                        ${product.originalPrice ? `<span class="font-sans text-lg font-light tracking-wide text-brand-obsidian/40 line-through">$${product.originalPrice}</span>` : ''}
                    </div>
                    
                    <p class="font-sans text-brand-obsidian/70 font-light leading-relaxed mb-8 text-sm">${product.description}</p>
                    
                    <div class="mb-8 border-t border-b border-brand-obsidian/10 py-4">
                        <p class="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">Availability</p>
                        <p class="font-sans text-sm font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}">
                            ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>
                    </div>

                    <button onclick="addToCart('${product.id}')" ${product.stock <= 0 ? 'disabled' : ''} class="w-full py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${product.stock <= 0 ? 'bg-brand-obsidian/20 text-brand-obsidian/50 cursor-not-allowed border-none' : 'btn-primary'}">
                        ${product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            </div>
            
            ${related.length > 0 ? `
                <div class="mt-32 border-t border-brand-obsidian/10 pt-16">
                    <h2 class="font-serif text-2xl uppercase tracking-widest text-center mb-10">Related Products</h2>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        ${generateProductCards(related)}
                    </div>
                </div>
            ` : ''}
            
            ${recentlyViewed.length > 1 ? `
                <div class="mt-20 border-t border-brand-obsidian/10 pt-16">
                    <h2 class="font-serif text-2xl uppercase tracking-widest text-center mb-10 text-brand-taupe">Recently Viewed</h2>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 opacity-90 hover:opacity-100 transition-opacity">
                        ${generateProductCards(recentlyViewed.filter(p=>p.id!==product.id).slice(0,4))}
                    </div>
                </div>
            ` : ''}
        </main>
    `;
}

function renderCart() {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    let cartHTML = '';
    if(cart.length === 0) {
        cartHTML = `
            <div class="text-center py-20">
                <p class="font-sans text-brand-obsidian/50 mb-8">Your shopping bag is currently empty.</p>
                <a href="#shop" class="btn-primary px-8 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]">Continue Shopping</a>
            </div>
        `;
    } else {
        const itemsHTML = cart.map(item => `
            <div class="flex gap-4 sm:gap-6 border-b border-brand-obsidian/10 pb-6">
                <div class="w-24 aspect-[4/5] bg-brand-champagne/30 shrink-0">
                    <a href="#product/${item.product.slug}"><img src="${item.product.image}" alt="${item.product.name}" class="w-full h-full object-cover" /></a>
                </div>
                <div class="flex flex-col justify-between w-full">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-serif text-lg leading-tight mb-1"><a href="#product/${item.product.slug}" class="hover:text-brand-taupe transition-colors">${item.product.name}</a></h3>
                            <span class="font-sans text-[10px] uppercase tracking-widest text-brand-taupe">${item.product.category}</span>
                        </div>
                        <span class="font-sans font-medium text-sm">$${item.product.price}</span>
                    </div>
                    <div class="flex justify-between items-end mt-4">
                        <span class="font-sans text-xs text-brand-obsidian/60">Qty: ${item.quantity}</span>
                        <button onclick="removeFromCart('${item.product.id}')" class="font-sans text-[10px] uppercase tracking-widest text-brand-obsidian/50 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:underline">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        cartHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div class="lg:col-span-8 flex flex-col gap-6">
                    ${itemsHTML}
                </div>
                <div class="lg:col-span-4">
                    <div class="bg-brand-porcelain border border-brand-obsidian/10 p-6 sm:p-8 lg:sticky lg:top-24">
                        <h2 class="font-serif text-xl uppercase tracking-widest mb-6 border-b border-brand-obsidian/10 pb-4">Order Summary</h2>
                        <div class="flex justify-between font-sans text-sm mb-4">
                            <span class="text-brand-obsidian/70">Subtotal</span>
                            <span>$${subtotal}</span>
                        </div>
                        <div class="flex justify-between font-serif text-xl mb-8 border-t border-brand-obsidian/10 pt-4">
                            <span>Total</span>
                            <span>$${subtotal}</span>
                        </div>
                        <a href="#checkout" class="block text-center btn-primary w-full py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]">Proceed to Checkout</a>
                    </div>
                </div>
            </div>
        `;
    }

    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen fade-in">
            <h1 class="font-serif text-4xl uppercase tracking-widest mb-10 border-b border-brand-obsidian/10 pb-6 text-center lg:text-left">Your Cart</h1>
            ${cartHTML}
        </main>
    `;
}

window.processCheckout = function(e) {
    e.preventDefault();
    const orderId = `ORD-${Math.floor(Math.random()*10000)}`;
    const newOrder = {
        id: orderId,
        customerName: document.getElementById('chk_name').value.trim(),
        date: new Date().toISOString().split('T')[0],
        total: cart.reduce((s,i)=>s+(i.product.price*i.quantity),0),
        status: 'Processing'
    };
    db.orders.unshift(newOrder);
    saveDB(db);
    cart = [];
    updateCartCount();
    
    contentDiv.innerHTML = `
        <main class="pt-40 pb-24 px-6 flex flex-col items-center justify-center min-h-[80vh] text-center fade-in">
            <i class="ri-checkbox-circle-line text-6xl text-brand-gold mb-6"></i>
            <h1 class="font-serif text-4xl uppercase tracking-widest mb-4">Order Confirmed</h1>
            <p class="font-sans text-brand-obsidian/70 mb-8">Thank you for your purchase. Your order number is <span class="font-semibold text-brand-obsidian">${orderId}</span>.</p>
            <a href="#shop" class="btn-primary px-10 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]">Continue Shopping</a>
        </main>
    `;
}

function renderCheckout() {
    if(cart.length === 0) return window.location.hash = '#cart';
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen fade-in">
            <h1 class="font-serif text-3xl uppercase tracking-widest mb-10 text-center border-b border-brand-obsidian/10 pb-6">Secure Checkout</h1>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                <div>
                    <form onsubmit="processCheckout(event)">
                        <h2 class="font-serif text-xl uppercase tracking-widest mb-6">1. Contact & Shipping</h2>
                        <div class="space-y-4 font-sans text-sm mb-10">
                            <input type="text" id="chk_name" required value="${currentUser ? currentUser.name : ''}" placeholder="Full Name *" class="w-full bg-transparent border border-brand-obsidian/20 p-3 outline-none focus:border-brand-obsidian transition-colors" />
                            <input type="email" required placeholder="Email Address *" class="w-full bg-transparent border border-brand-obsidian/20 p-3 outline-none focus:border-brand-obsidian transition-colors" />
                            <input type="text" required placeholder="Address Line 1 *" class="w-full bg-transparent border border-brand-obsidian/20 p-3 outline-none focus:border-brand-obsidian transition-colors" />
                        </div>
                        <h2 class="font-serif text-xl uppercase tracking-widest mb-6 border-t border-brand-obsidian/10 pt-8">2. Payment Method</h2>
                        <div class="bg-white p-6 border border-brand-obsidian/10 rounded mb-8 shadow-sm">
                            <div class="flex gap-4 items-center mb-6">
                                <input type="radio" checked class="accent-brand-obsidian" aria-label="Credit Card Payment" /> 
                                <span class="font-sans text-sm font-medium">Credit Card (Test Mode)</span>
                            </div>
                            <div class="space-y-4 font-sans text-sm opacity-50 pointer-events-none">
                                <input type="text" placeholder="Card Number" value="**** **** **** 4242" class="w-full bg-brand-porcelain border border-brand-obsidian/20 p-3 outline-none" disabled />
                            </div>
                            <p class="text-[10px] text-brand-obsidian/50 mt-4 italic">Note: Stripe/Razorpay API keys required for production processing.</p>
                        </div>
                        <button type="submit" class="btn-primary w-full py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]">Pay $${subtotal}</button>
                    </form>
                </div>
                <div class="bg-brand-porcelain border border-brand-obsidian/10 p-8 h-fit lg:sticky lg:top-24">
                    <h2 class="font-serif text-xl uppercase tracking-widest mb-6 border-b border-brand-obsidian/10 pb-4">Order Summary</h2>
                    <div class="flex justify-between font-serif text-2xl mb-4 text-brand-obsidian">
                        <span>Total</span>
                        <span>$${subtotal}</span>
                    </div>
                </div>
            </div>
        </main>
    `;
}

window.executeTrackOrder = function(e) {
    e.preventDefault();
    const id = document.getElementById('trackId').value.trim();
    const order = db.orders.find(o => o.id === id);
    const resDiv = document.getElementById('trackResult');
    
    if(order) {
        resDiv.innerHTML = `
            <div class="bg-white p-8 border border-brand-obsidian/10 mt-8 rounded-sm animate-slide-up shadow-sm">
                <h3 class="font-semibold font-sans text-lg mb-2">Order ${order.id}</h3>
                <p class="text-sm font-sans text-brand-obsidian/60 mb-6">Placed by ${order.customerName} on ${order.date}</p>
                <div class="border-t border-brand-obsidian/10 pt-6">
                    <p class="text-xs font-sans uppercase tracking-widest text-brand-taupe mb-2">Current Status</p>
                    <p class="text-xl font-serif text-brand-obsidian font-bold">${order.status}</p>
                    ${order.tracking ? `<p class="text-sm font-sans mt-4">Tracking: <span class="font-mono bg-brand-porcelain px-2 py-1">${order.tracking}</span></p>` : ''}
                </div>
            </div>
        `;
    } else {
        resDiv.innerHTML = `<p class="text-red-500 font-sans text-sm mt-6 text-center bg-red-50 p-4 border border-red-100">Order not found. Please verify your Order ID.</p>`;
    }
}

function renderTrackOrder() {
    contentDiv.innerHTML = `
        <main class="pt-32 pb-24 px-6 lg:px-12 max-w-[600px] mx-auto min-h-screen fade-in">
            <header class="mb-12 text-center">
                <h1 class="font-serif text-3xl sm:text-4xl uppercase tracking-widest mb-4">Track Order</h1>
            </header>
            <form onsubmit="executeTrackOrder(event)" class="flex flex-col sm:flex-row gap-4 w-full">
                <input type="text" id="trackId" placeholder="Order ID (e.g. ORD-001)" required class="flex-1 bg-transparent border-b border-brand-obsidian/30 py-3 px-2 focus:outline-none focus:border-brand-obsidian font-sans text-sm transition-colors" />
                <button type="submit" class="btn-primary px-8 py-3 font-sans text-[10px] uppercase tracking-widest font-semibold">Track</button>
            </form>
            <div id="trackResult"></div>
        </main>
    `;
}

function renderContact() {
    contentDiv.innerHTML = `
        <main class="pt-32 pb-24 px-6 lg:px-12 max-w-[1200px] mx-auto min-h-screen flex flex-col md:flex-row gap-12 sm:gap-16 fade-in">
            <div class="md:w-1/2">
                <h1 class="font-serif text-4xl sm:text-5xl uppercase tracking-widest mb-6">Contact Us</h1>
                <p class="font-sans text-brand-obsidian/70 font-light leading-relaxed mb-10 text-sm sm:text-base">For inquiries regarding collections, bespoke orders, or interior design trade partnerships, our dedicated concierge team is at your disposal.</p>
                <div class="space-y-8 font-sans">
                    <div><h3 class="text-[10px] uppercase tracking-widest font-semibold text-brand-taupe mb-1">General Inquiries</h3><p class="font-light text-sm">concierge@aldoravenzi.com</p></div>
                    <div><h3 class="text-[10px] uppercase tracking-widest font-semibold text-brand-taupe mb-1">Showroom</h3><p class="font-light text-sm">Via Monte Napoleone 12<br/>Milan, Italy</p></div>
                </div>
            </div>
            <div class="md:w-1/2 bg-white p-6 lg:p-12 border border-brand-obsidian/5 shadow-sm">
                <form onsubmit="event.preventDefault(); showToast('Message sent securely to support team.'); event.target.reset();" class="flex flex-col gap-6">
                    <input type="text" placeholder="Name *" required class="w-full border-b border-brand-obsidian/20 bg-transparent py-2 text-sm focus:outline-none focus:border-brand-obsidian transition-colors" />
                    <input type="email" placeholder="Email *" required class="w-full border-b border-brand-obsidian/20 bg-transparent py-2 text-sm focus:outline-none focus:border-brand-obsidian transition-colors" />
                    <textarea rows="4" placeholder="Message *" required class="w-full border-b border-brand-obsidian/20 bg-transparent py-2 text-sm focus:outline-none focus:border-brand-obsidian resize-none transition-colors"></textarea>
                    <button type="submit" class="btn-primary py-4 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] mt-2">Send Message</button>
                </form>
            </div>
        </main>
    `;
}

function renderLogin() {
    if(currentUser) return window.location.hash = currentUser.role === 'admin' ? '#admin' : '#account';
    contentDiv.innerHTML = `
        <main class="pt-32 pb-24 px-6 flex items-center justify-center min-h-[80vh] fade-in">
            <div class="max-w-md w-full bg-white p-10 border border-brand-obsidian/10 shadow-sm">
                <h1 class="font-serif text-3xl uppercase tracking-widest text-center mb-2">Sign In</h1>
                <p class="font-sans text-[10px] text-center text-brand-obsidian/50 mb-8 tracking-wider">
                    Customer: eleanor@example.com / password<br/>
                    Admin: admin@aldoravenzi.com / admin
                </p>
                <p id="login-error" class="hidden bg-red-50 text-red-600 text-xs p-3 mb-4 border border-red-100 text-center"></p>
                <form onsubmit="doLogin(event)" class="flex flex-col gap-6">
                    <input type="email" id="email" required placeholder="Email Address *" class="w-full border-b border-brand-obsidian/20 py-2 focus:outline-none focus:border-brand-obsidian text-sm bg-transparent transition-colors" />
                    <input type="password" id="password" required placeholder="Password *" class="w-full border-b border-brand-obsidian/20 py-2 focus:outline-none focus:border-brand-obsidian text-sm bg-transparent transition-colors" />
                    <button type="submit" class="btn-primary w-full py-4 mt-2 font-sans text-xs font-semibold uppercase tracking-[0.2em]">Sign In</button>
                </form>
            </div>
        </main>
    `;
}

function renderAccount() {
    if(!currentUser || currentUser.role !== 'customer') return window.location.hash = '#login';

    const myOrdersHTML = db.orders.filter(o => o.customerName === currentUser.name).map(order => `
        <div class="border border-brand-obsidian/10 p-6 flex justify-between items-center bg-white mb-4 rounded-sm">
            <div>
                <h3 class="font-sans font-semibold text-sm mb-1">${order.id}</h3>
                <p class="font-sans text-xs text-brand-obsidian/60">${order.date}</p>
            </div>
            <div class="text-right">
                <p class="font-sans font-medium mb-1">$${order.total}</p>
                <p class="font-sans text-[10px] uppercase tracking-widest text-brand-taupe">${order.status}</p>
            </div>
        </div>
    `).join('') || '<p class="font-sans text-brand-obsidian/50 text-sm">You haven't placed any orders yet.</p>';

    contentDiv.innerHTML = `
        <main class="pt-24 pb-24 px-6 lg:px-12 max-w-[1000px] mx-auto min-h-screen fade-in">
            <header class="flex justify-between items-end border-b border-brand-obsidian/10 pb-6 mb-10">
                <div>
                    <h1 class="font-serif text-3xl uppercase tracking-widest mb-1">My Account</h1>
                    <p class="font-sans text-sm text-brand-obsidian/60">Welcome back, ${currentUser.name}</p>
                </div>
                <button onclick="doLogout()" class="font-sans text-[10px] uppercase tracking-widest text-brand-taupe hover:text-brand-obsidian focus-visible:outline-none focus-visible:underline">Logout</button>
            </header>
            <div class="bg-white border border-brand-obsidian/10 p-8 shadow-sm">
                <h2 class="font-serif text-xl uppercase tracking-widest mb-6">Order History</h2>
                ${myOrdersHTML}
            </div>
        </main>
    `;
}

function renderAdminDashboard() {
    if(!currentUser || currentUser.role !== 'admin') return window.location.hash = '#login';
    const totalRev = db.orders.reduce((sum, o) => sum + o.total, 0);
    
    contentDiv.innerHTML = `
        <div class="flex h-screen bg-brand-porcelain font-sans overflow-hidden fade-in">
            <aside class="w-64 bg-brand-obsidian text-white flex flex-col shrink-0 hidden md:flex">
                <div class="h-20 flex items-center px-8 border-b border-white/10">
                    <span class="font-serif text-xl tracking-widest uppercase">Admin Panel</span>
                </div>
                <nav class="flex-1 py-8 px-4 flex flex-col gap-2">
                    <a href="#admin" class="flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wide bg-brand-taupe text-white"><i class="ri-dashboard-line text-lg"></i> Overview</a>
                    <a href="#admin/supplier" class="flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wide text-white/60 hover:bg-white/5 hover:text-white transition-colors"><i class="ri-global-line text-lg"></i> Supplier API</a>
                    <a href="#home" class="flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wide text-white/60 hover:bg-white/5 hover:text-white transition-colors"><i class="ri-store-line text-lg"></i> View Store</a>
                </nav>
                <div class="p-4 border-t border-white/10">
                    <button onclick="doLogout()" class="flex items-center gap-3 px-4 py-3 w-full text-left text-sm tracking-wide text-white/60 hover:text-white transition-colors"><i class="ri-logout-box-line text-lg"></i> Logout</button>
                </div>
            </aside>
            <main class="flex-1 overflow-y-auto p-6 md:p-10">
                <h2 class="font-sans font-semibold text-xl mb-6">Dashboard Overview</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 border border-brand-obsidian/10 rounded shadow-sm">
                        <p class="text-[10px] uppercase tracking-widest text-brand-obsidian/50 font-semibold mb-1">Total Revenue</p>
                        <p class="text-3xl font-serif text-brand-obsidian">$${totalRev}</p>
                    </div>
                    <div class="bg-white p-6 border border-brand-obsidian/10 rounded shadow-sm">
                        <p class="text-[10px] uppercase tracking-widest text-brand-obsidian/50 font-semibold mb-1">Total Orders</p>
                        <p class="text-3xl font-serif text-brand-obsidian">${db.orders.length}</p>
                    </div>
                    <div class="bg-white p-6 border border-brand-obsidian/10 rounded shadow-sm">
                        <p class="text-[10px] uppercase tracking-widest text-brand-obsidian/50 font-semibold mb-1">Active Products</p>
                        <p class="text-3xl font-serif text-brand-obsidian">${db.products.filter(p=>p.status==='published').length}</p>
                    </div>
                </div>
                <button onclick="doLogout()" class="md:hidden mt-10 btn-secondary w-full py-4 text-xs font-semibold uppercase tracking-widest">Logout</button>
            </main>
        </div>
    `;
}

window.syncSupplier = function(btn) {
    const originalText = btn.innerText;
    btn.innerText = "Syncing APIs...";
    btn.disabled = true;
    setTimeout(() => {
        showToast("Supplier Sync Complete. Products Validated.");
        btn.innerText = originalText;
        btn.disabled = false;
    }, 2000);
}

function renderAdminSupplier() {
    if(!currentUser || currentUser.role !== 'admin') return window.location.hash = '#login';
    contentDiv.innerHTML = `
        <div class="flex h-screen bg-brand-porcelain font-sans overflow-hidden fade-in">
            <aside class="w-64 bg-brand-obsidian text-white flex flex-col shrink-0 hidden md:flex">
                <div class="h-20 flex items-center px-8 border-b border-white/10">
                    <span class="font-serif text-xl tracking-widest uppercase">Admin Panel</span>
                </div>
                <nav class="flex-1 py-8 px-4 flex flex-col gap-2">
                    <a href="#admin" class="flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wide text-white/60 hover:bg-white/5 hover:text-white transition-colors"><i class="ri-dashboard-line text-lg"></i> Overview</a>
                    <a href="#admin/supplier" class="flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wide bg-brand-taupe text-white"><i class="ri-global-line text-lg"></i> Supplier API</a>
                    <a href="#home" class="flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wide text-white/60 hover:bg-white/5 hover:text-white transition-colors"><i class="ri-store-line text-lg"></i> View Store</a>
                </nav>
                <div class="p-4 border-t border-white/10">
                    <button onclick="doLogout()" class="flex items-center gap-3 px-4 py-3 w-full text-left text-sm tracking-wide text-white/60 hover:text-white transition-colors"><i class="ri-logout-box-line text-lg"></i> Logout</button>
                </div>
            </aside>
            <main class="flex-1 overflow-y-auto p-6 md:p-10">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="font-sans font-semibold text-xl text-brand-obsidian">Supplier Integration</h2>
                    <button onclick="syncSupplier(this)" class="bg-brand-obsidian text-white px-4 py-2 text-[10px] font-semibold uppercase tracking-widest rounded hover:bg-brand-taupe transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-taupe">Manual Sync</button>
                </div>
                <div class="bg-white border border-brand-obsidian/10 rounded p-6 shadow-sm">
                    <h3 class="text-xs font-semibold uppercase tracking-widest text-brand-obsidian/50 mb-6">API Configuration</h3>
                    <div class="space-y-5">
                        <div><label class="block text-xs font-medium text-brand-obsidian/80 mb-2">CJ Dropshipping / EPROLO Endpoint</label><input type="text" value="https://api.cjdropshipping.com/v1" disabled class="w-full border border-brand-obsidian/20 p-2 bg-gray-50 opacity-70 rounded-sm" /></div>
                        <div><label class="block text-xs font-medium text-brand-obsidian/80 mb-2">API Key (Hidden)</label><input type="password" value="**************" disabled class="w-full border border-brand-obsidian/20 p-2 bg-gray-50 opacity-70 rounded-sm" /></div>
                    </div>
                </div>
                <p class="text-[10px] text-brand-obsidian/50 mt-4 italic max-w-2xl leading-relaxed">Note: Live API credentials are securely stored server-side. Auto-forwarding of real orders is currently disabled during Phase 7 QA testing to prevent false supplier dispatch.</p>
            </main>
        </div>
    `;
}
