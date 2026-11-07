// js/database.js
const INITIAL_DB = {
    products: [
        {
            id: '1', slug: 'sculptural-ceramic-vase', name: 'Sculptural Ceramic Vase', price: 450, category: 'Decorative Objects', collection: 'living-room',
            image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800&auto=format&fit=crop',
            description: 'A masterpiece of modern minimalism, handcrafted in Italy. The matte porcelain finish and asymmetric curves bring a profound sense of calm to any interior space.',
            stock: 15, status: 'published', isNew: true, isBestseller: true, isGiftable: true
        },
        {
            id: '2', slug: 'obsidian-lounge-chair', name: 'Obsidian Lounge Chair', price: 3200, category: 'Furniture', collection: 'living-room',
            image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop',
            description: 'Upholstered in premium textured bouclé, the Obsidian Lounge Chair features a solid walnut frame and deep, enveloping comfort designed for timeless luxury.',
            stock: 8, status: 'published', isNew: false, isBestseller: true, isGiftable: false
        },
        {
            id: '3', slug: 'champagne-brass-chandelier', name: 'Champagne Brass Chandelier', price: 1850, category: 'Lighting', collection: 'bedroom',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
            description: 'Illuminate your space with geometric brilliance. Brushed champagne gold brass supports a hand-blown frosted glass globe.',
            stock: 22, status: 'published', isNew: false, isBestseller: false, isGiftable: false
        },
        {
            id: '4', slug: 'marble-plinth-table', name: 'Marble Plinth Table', price: 1450, category: 'Furniture', collection: 'living-room',
            image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=800&auto=format&fit=crop',
            description: 'Carved from a single block of Calacatta Viola marble, this side table serves as a functional sculpture.',
            stock: 3, status: 'published', isNew: true, isBestseller: false, isGiftable: false
        },
        {
            id: '5', slug: 'organic-stoneware-set', name: 'Organic Stoneware Set', price: 780, category: 'Dining', collection: 'dining',
            image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=800&auto=format&fit=crop',
            description: 'A 16-piece collection defined by refined organic edges and an antique taupe reactive glaze.',
            stock: 0, status: 'published', isNew: false, isBestseller: false, isGiftable: true
        },
        {
            id: '6', slug: 'minimalist-wall-mirror', name: 'Minimalist Wall Mirror', price: 1250, category: 'Home Accessories', collection: 'bedroom',
            image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop',
            description: 'Create an illusion of expansive space. This oversized floor mirror features a delicate micro-beveled edge.',
            stock: 12, status: 'published', isNew: false, isBestseller: true, isGiftable: false
        }
    ],
    collections: [
        { id: 'living-room', name: 'Living Room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop' },
        { id: 'bedroom', name: 'Bedroom', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1000&auto=format&fit=crop' },
        { id: 'dining', name: 'Dining', image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=1000&auto=format&fit=crop' },
        { id: 'lighting', name: 'Lighting', image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=1000&auto=format&fit=crop' },
        { id: 'decor', name: 'Decorative Objects', image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop' }
    ],
    journal: [
        { id: 'j1', slug: 'the-milanese-aesthetic', title: 'The Milanese Aesthetic', date: 'Oct 2026', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop', excerpt: 'Exploring the intersection of brutalism and luxury in modern Italian design.' },
        { id: 'j2', slug: 'art-of-entertaining', title: 'The Art of Entertaining', date: 'Nov 2026', image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=1000&auto=format&fit=crop', excerpt: 'Setting the perfect table with our Organic Stoneware collection.' }
    ],
    orders: [
        { id: 'ORD-001', customerName: 'Eleanor Vance', date: '2026-10-15', total: 450, status: 'Shipped', tracking: 'TRK987654321' }
    ],
    supplierConfig: { connected: false, api_key: '', supplierName: 'CJ Dropshipping / EPROLO (Mock)' },
    settings: { announcement: 'Complimentary global shipping on orders over $500', heroHeading: 'Elegance in every Detail' }
};

function getDB() {
    try {
        const data = localStorage.getItem('aldo_db_prod');
        if (data) {
            const parsed = JSON.parse(data);
            if(parsed && parsed.products && parsed.settings) return parsed;
        }
    } catch(e) {
        console.error("Local storage read error, defaulting to initial DB", e);
    }
    localStorage.setItem('aldo_db_prod', JSON.stringify(INITIAL_DB));
    return INITIAL_DB;
}

function saveDB(db) {
    try {
        localStorage.setItem('aldo_db_prod', JSON.stringify(db));
    } catch(e) {
        console.error("Failed to write to local storage", e);
    }
}

let db = getDB();
let cart = [];
try { cart = JSON.parse(localStorage.getItem('aldo_cart_prod') || '[]'); } catch(e) {}

let currentUser = null;
try { currentUser = JSON.parse(localStorage.getItem('aldo_user_prod') || 'null'); } catch(e) {}

let recentlyViewed = [];
try { recentlyViewed = JSON.parse(localStorage.getItem('aldo_recent_prod') || '[]'); } catch(e) {}
