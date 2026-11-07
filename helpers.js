// js/helpers.js
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

window.shareProduct = function(url, title) {
    if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showToast("Product link copied to clipboard");
        }).catch(() => {
            showToast("Failed to copy link");
        });
    }
}

window.trackRecentProduct = function(productId) {
    const p = db.products.find(x => x.id === productId);
    if(p) {
        recentlyViewed = recentlyViewed.filter(x => x.id !== productId);
        recentlyViewed.unshift(p);
        if(recentlyViewed.length > 4) recentlyViewed.pop();
        try { localStorage.setItem('aldo_recent_prod', JSON.stringify(recentlyViewed)); } catch(e) {}
    }
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(total > 0) {
        countEl.classList.remove('hidden');
        countEl.innerText = total;
    } else {
        countEl.classList.add('hidden');
    }
    try { localStorage.setItem('aldo_cart_prod', JSON.stringify(cart)); } catch(e){}
}

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
    
    if(menu.classList.contains('flex')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

window.addToCart = function(productId) {
    const product = db.products.find(p => p.id === productId);
    if(!product || product.stock <= 0) { showToast("Product out of stock!"); return; }
    
    const existing = cart.find(item => item.product.id === productId);
    if(existing) {
        if(existing.quantity >= product.stock) {
            showToast("Maximum stock reached.");
            return;
        }
        existing.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }
    
    updateCartCount();
    showToast("Added to Cart");
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartCount();
    renderCart();
}

function updateAuthUI() {
    const navIcon = document.getElementById('nav-user-icon');
    const mobileNavUser = document.getElementById('mobile-nav-user');
    if(currentUser) {
        navIcon.href = currentUser.role === 'admin' ? '#admin' : '#account';
        mobileNavUser.href = currentUser.role === 'admin' ? '#admin' : '#account';
        mobileNavUser.innerText = 'My Account';
    } else {
        navIcon.href = '#login';
        mobileNavUser.href = '#login';
        mobileNavUser.innerText = 'Sign In';
    }
}

window.doLogin = function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');

    if(email === 'admin@aldoravenzi.com' && pass === 'admin') {
        currentUser = { role: 'admin', name: 'Administrator' };
        window.location.hash = '#admin';
    } else if (email === 'eleanor@example.com' && pass === 'password') {
        currentUser = { role: 'customer', name: 'Eleanor Vance' };
        window.location.hash = '#account';
    } else {
        errorEl.classList.remove('hidden');
        errorEl.innerText = "Invalid credentials.";
        return;
    }
    try { localStorage.setItem('aldo_user_prod', JSON.stringify(currentUser)); } catch(e){}
}

window.doLogout = function() {
    currentUser = null;
    try { localStorage.removeItem('aldo_user_prod'); } catch(e){}
    window.location.hash = '#login';
}

window.executeSearch = function(e) {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if(q) window.location.hash = `#search?q=${encodeURIComponent(q)}`;
}
