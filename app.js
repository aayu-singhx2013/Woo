// js/app.js
// Initialize Router and App
const contentDiv = document.getElementById('app-content');

function router() {
    // Restore overflow if navigating away while mobile menu is open
    document.body.style.overflow = '';
    
    const hash = window.location.hash || '#home';
    updateAuthUI();
    updateCartCount();
    
    // Hide/Show layout elements based on route (Hide on Admin, Show on Public)
    const isPublic = !hash.startsWith('#admin') && hash !== '#report';
    document.getElementById('announcement-bar').style.display = isPublic ? 'block' : 'none';
    document.getElementById('navbar').style.display = isPublic ? 'block' : 'none';
    document.getElementById('footer').style.display = isPublic ? 'block' : 'none';

    contentDiv.innerHTML = '';
    window.scrollTo(0,0);

    try {
        // Route Mapping
        if(hash === '#home') renderHome();
        else if(hash === '#shop') renderProductGrid('Shop All', db.products);
        else if(hash === '#new-arrivals') renderProductGrid('New Arrivals', db.products.filter(p=>p.isNew));
        else if(hash === '#bestsellers') renderProductGrid('Bestsellers', db.products.filter(p=>p.isBestseller));
        else if(hash === '#gifts' || hash === '#gift-guide') renderProductGrid('The Gift Guide', db.products.filter(p=>p.isGiftable));
        else if(hash === '#sale') renderProductGrid('Sale', db.products.filter(p=>p.originalPrice && p.stock > 0));
        else if(hash === '#collections') renderCollectionsIndex();
        else if(hash.startsWith('#collection/')) renderCollection(hash.split('/')[1]);
        else if(hash.startsWith('#search')) renderSearch(hash);
        else if(hash.startsWith('#product/')) renderProduct(hash.split('/')[1]);
        else if(hash === '#cart') renderCart();
        else if(hash === '#checkout') renderCheckout();
        else if(hash === '#track-order') renderTrackOrder();
        else if(hash === '#login') renderLogin();
        else if(hash === '#account') renderAccount();
        else if(hash === '#admin') renderAdminDashboard();
        else if(hash === '#admin/supplier') renderAdminSupplier();
        
        // Editorial & Support Routes
        else if(hash === '#journal') renderJournal();
        else if(hash === '#about' || hash === '#our-story') renderTextPage('Our Story', 'Established in 2026, Aldo Ravénzi bridges the gap between architectural grandeur and intimate daily living.');
        else if(hash === '#contact' || hash === '#support') renderContact();
        else if(hash === '#faq') renderTextPage('Frequently Asked Questions', 'Need help with your order or shipping? Contact our concierge team.');
        else if(hash === '#shipping') renderTextPage('Shipping Policy', 'Complimentary global shipping on all orders over $500. Dispatch within 2-3 business days.');
        else if(hash === '#returns') renderTextPage('Returns Policy', 'We accept returns on standard items within 14 days of delivery in pristine condition.');
        else if(hash === '#privacy-policy') renderTextPage('Privacy Policy', 'We collect personal information solely for the purpose of processing your orders securely. Client data isolation is strictly enforced.');
        else if(hash === '#terms') renderTextPage('Terms & Conditions', 'By utilizing the Aldo Ravénzi digital boutique, you agree to comply with our Terms & Conditions.');
        
        else render404(); // 404 Fallback
    } catch (error) {
        console.error("Routing Error:", error);
        render404(); // Graceful fallback on error
    }
}

// Initialize App securely
window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                router();
            }, 500);
        } else {
            router();
        }
    }, 800);
});

// Fail-safe in case DOM content loaded fires too quickly
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    const loader = document.getElementById('loader');
    if (loader && loader.style.display !== 'none') {
        loader.style.display = 'none';
        router();
    }
}
