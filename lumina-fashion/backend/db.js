const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'lumina.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Helper functions to wrap sqlite operations in Promises
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

async function initializeDatabase() {
  try {
    // Create Users Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Products Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        images TEXT, -- JSON array of image URLs
        sizes TEXT,  -- JSON array of sizes (e.g. ["S", "M", "L", "XL"])
        colors TEXT, -- JSON array of colors (e.g. ["Black", "Beige", "Navy"])
        stock INTEGER NOT NULL,
        featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Orders Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        status TEXT DEFAULT 'pending',
        total_amount REAL NOT NULL,
        shipping_address TEXT, -- JSON object
        billing_address TEXT,  -- JSON object
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Create Order Items Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        size TEXT NOT NULL,
        color TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    console.log('Database tables verified/created successfully.');
    await seedData();
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

async function seedData() {
  try {
    // Seed Admin & Test Customer
    const usersCount = await dbGet('SELECT COUNT(*) as count FROM users');
    if (usersCount.count === 0) {
      const adminPassHash = await bcrypt.hash('admin123', 10);
      const userPassHash = await bcrypt.hash('password123', 10);

      await dbRun(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@lumina.com', adminPassHash, 'admin']
      );
      await dbRun(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['James Miller', 'james@example.com', userPassHash, 'customer']
      );
      console.log('Seeded users.');
    }

    // Seed Luxury Products
    const productsCount = await dbGet('SELECT COUNT(*) as count FROM products');
    if (productsCount.count === 0) {
      const mockProducts = [
        {
          name: 'Double-Breasted Wool Blazer',
          sku: 'LF-BLZ-001',
          description: 'A tailored double-breasted blazer crafted from premium Italian virgin wool. Features peak lapels, patch pockets, and a classic structural shoulder for an elegant, architectural silhouette.',
          price: 495.00,
          category: 'Outerwear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600',
            'https://images.unsplash.com/photo-1598808503742-dd34bd0444d9?q=80&w=600'
          ]),
          sizes: JSON.stringify(['48', '50', '52', '54']),
          colors: JSON.stringify(['Midnight Black', 'Slate Grey']),
          stock: 25,
          featured: 1
        },
        {
          name: 'Merino Wool Cardigan',
          sku: 'LF-KNIT-002',
          description: 'Luxuriously soft cardigan knitted from extrafine merino wool. Designed with a relaxed fit, drop shoulders, and organic horn buttons. Perfect layering piece for all seasons.',
          price: 220.00,
          category: 'Knitwear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
          colors: JSON.stringify(['Oatmeal Beige', 'Ivory White', 'Charcoal']),
          stock: 40,
          featured: 1
        },
        {
          name: 'Tailored Cropped Trousers',
          sku: 'LF-TRO-003',
          description: 'Cropped trousers with double forward pleats and a relaxed tapered leg. Crafted from a mid-weight wool blend fabric with side slip pockets and a clean hook-and-bar closure.',
          price: 185.00,
          category: 'Trousers',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600'
          ]),
          sizes: JSON.stringify(['30', '32', '34', '36']),
          colors: JSON.stringify(['Stone', 'Navy Blue']),
          stock: 30,
          featured: 0
        },
        {
          name: 'Minimalist Gabardine Trench Coat',
          sku: 'LF-OUT-004',
          description: 'A contemporary reimagining of the classic trench, cut from water-repellent cotton gabardine. Minimal front detailing, storm flap, and a detachable self-tie waist belt.',
          price: 550.00,
          category: 'Outerwear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
          colors: JSON.stringify(['Classic Khaki', 'Black']),
          stock: 15,
          featured: 1
        },
        {
          name: 'Relaxed Linen Overshirt',
          sku: 'LF-SHT-005',
          description: 'Constructed from lightweight, breathable French linen. Features a relaxed collar, chest patch pocket, and a clean flat hem. Styled to wear open over a fine knit or buttoned up.',
          price: 140.00,
          category: 'Shirts',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
          colors: JSON.stringify(['Off-White', 'Sage Green', 'Indigo']),
          stock: 50,
          featured: 0
        },
        {
          name: 'Nappa Leather Loafers',
          sku: 'LF-SHOE-006',
          description: 'Soft Nappa leather loafers handmade in Italy. Designed with a flexible leather sole, minimal stitching, and a comfortable glove-like fit that adapts to your foot.',
          price: 320.00,
          category: 'Shoes',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600'
          ]),
          sizes: JSON.stringify(['41', '42', '43', '44', '45']),
          colors: JSON.stringify(['Espresso Brown', 'Obsidian Black']),
          stock: 20,
          featured: 1
        },
        {
          name: 'Suede Chelsea Boots',
          sku: 'LF-SHOE-007',
          description: 'Italian calf suede Chelsea boots featuring secure elastic side gores and a leather pull tab. Set on a durable crepe sole for walking comfort and understated elegance.',
          price: 340.00,
          category: 'Shoes',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=600'
          ]),
          sizes: JSON.stringify(['41', '42', '43', '44']),
          colors: JSON.stringify(['Taupe Suede', 'Dark Brown']),
          stock: 18,
          featured: 0
        },
        {
          name: 'Structured Leather Tote Bag',
          sku: 'LF-ACC-008',
          description: 'A spacious tote made from full-grain textured leather. Built with reinforced handles, a metal zipper interior pocket, and subtle embossed branding on the front.',
          price: 275.00,
          category: 'Accessories',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600'
          ]),
          sizes: JSON.stringify(['One Size']),
          colors: JSON.stringify(['Chestnut', 'Carbon Black']),
          stock: 12,
          featured: 0
        },
        {
          name: 'Silk-Blend Knit Polo',
          sku: 'LF-KNIT-009',
          description: 'A luxurious short-sleeve polo shirt knitted from a premium silk and cotton blend. Featuring a clean collar, rib-knit cuffs, and a modern relaxed drape.',
          price: 175.00,
          category: 'Knitwear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
          colors: JSON.stringify(['Olive Green', 'Cream White', 'Midnight Navy']),
          stock: 35,
          featured: 1
        },
        {
          name: 'Wool-Cashmere Tailored Overcoat',
          sku: 'LF-OUT-010',
          description: 'A classic double-breasted overcoat tailored from a heavyweight virgin wool and cashmere blend. Designed with a peak lapel, structured shoulders, and a back vent for ease of movement.',
          price: 650.00,
          category: 'Outerwear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600'
          ]),
          sizes: JSON.stringify(['48', '50', '52', '54']),
          colors: JSON.stringify(['Camel Brown', 'Charcoal Grey']),
          stock: 12,
          featured: 1
        },
        {
          name: 'Relaxed Silk Shirt',
          sku: 'LF-SHT-011',
          description: 'Made from 100% sandwashed mulberry silk. Features a soft camp collar, mother-of-pearl buttons, and a fluid, relaxed silhouette.',
          price: 210.00,
          category: 'Shirts',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L']),
          colors: JSON.stringify(['Champagne Gold', 'Classic White']),
          stock: 20,
          featured: 0
        },
        {
          name: 'Wide-Leg Wool Trousers',
          sku: 'LF-TRO-012',
          description: 'High-waisted trousers with wide-leg cut and sharp front pleats. Crafted from lightweight summer-weight wool. Side seam pockets and double welt back pockets.',
          price: 195.00,
          category: 'Trousers',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600'
          ]),
          sizes: JSON.stringify(['30', '32', '34', '36']),
          colors: JSON.stringify(['Sandstone', 'Deep Black']),
          stock: 22,
          featured: 1
        },
        {
          name: 'Premium Suede Jacket',
          sku: 'LF-OUT-013',
          description: 'A modern trucker-style jacket crafted from exceptionally soft lambskin suede. Features a zip-front closure, point collar, and functional side welt pockets.',
          price: 580.00,
          category: 'Outerwear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
          colors: JSON.stringify(['Cognac', 'Forest Green']),
          stock: 15,
          featured: 0
        },
        {
          name: 'Handcrafted Leather Belt',
          sku: 'LF-ACC-014',
          description: 'Minimalist belt crafted from thick, vegetable-tanned Italian saddle leather. Features a solid brass buckle and hand-painted edges.',
          price: 85.00,
          category: 'Accessories',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600'
          ]),
          sizes: JSON.stringify(['One Size']),
          colors: JSON.stringify(['Mahogany', 'Classic Black']),
          stock: 50,
          featured: 0
        },
        {
          name: 'Ribbed Cashmere Beanie',
          sku: 'LF-ACC-015',
          description: 'Knit from pure, soft Mongolian cashmere. Designed with a wide ribbed cuff and a cozy stretch fit. The ultimate cold-weather luxury accessory.',
          price: 95.00,
          category: 'Accessories',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600'
          ]),
          sizes: JSON.stringify(['One Size']),
          colors: JSON.stringify(['Heather Grey', 'Camel', 'Off-White']),
          stock: 40,
          featured: 0
        },
        {
          name: 'Calfskin Minimalist Sneakers',
          sku: 'LF-SHOE-016',
          description: 'Clean court sneaker crafted from full-grain Italian calfskin leather. Hand-stitched Margom rubber sole and calfskin lining for ultimate comfort.',
          price: 280.00,
          category: 'Shoes',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600'
          ]),
          sizes: JSON.stringify(['41', '42', '43', '44', '45']),
          colors: JSON.stringify(['Triple White', 'White / Navy']),
          stock: 25,
          featured: 1
        },
        {
          name: 'Tailored Wool Suit Jacket',
          sku: 'LF-OFF-017',
          description: 'A sharp, double-button suit jacket tailored from high-twist wool gabardine. Features structured shoulders, notch lapels, and fully lined interior.',
          price: 520.00,
          category: 'Office Wear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'
          ]),
          sizes: JSON.stringify(['48', '50', '52', '54']),
          colors: JSON.stringify(['Midnight Black', 'Charcoal Grey']),
          stock: 15,
          featured: 1
        },
        {
          name: 'Classic Double-Breasted Blazer',
          sku: 'LF-OFF-018',
          description: 'An elegant double-breasted blazer featuring gold-tone hardware buttons, peak lapels, and a slim tailored waist for professional elegance.',
          price: 480.00,
          category: 'Office Wear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600'
          ]),
          sizes: JSON.stringify(['36', '38', '40', '42']),
          colors: JSON.stringify(['Navy Blue', 'Off-White']),
          stock: 18,
          featured: 0
        },
        {
          name: 'Tailored Slim-Fit Trousers',
          sku: 'LF-OFF-019',
          description: 'Sharp flat-front office trousers crafted from breathable Italian cotton-blend stretch twill. Featuring side slip pockets and pressed creases.',
          price: 195.00,
          category: 'Office Wear',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600'
          ]),
          sizes: JSON.stringify(['30', '32', '34', '36']),
          colors: JSON.stringify(['Charcoal Grey', 'Midnight Black']),
          stock: 20,
          featured: 0
        },
        {
          name: 'Classic Silk Camisole',
          sku: 'LF-TOP-020',
          description: 'Luxuriously soft camisole cut from fluid mulberry silk. Features a delicate V-neckline and adjustable spaghetti straps for effortless styling.',
          price: 110.00,
          category: 'Tops',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?q=80&w=600'
          ]),
          sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
          colors: JSON.stringify(['Champagne Gold', 'Classic Black', 'Ivory']),
          stock: 30,
          featured: 1
        },
        {
          name: 'Relaxed Poplin Shirt',
          sku: 'LF-TOP-021',
          description: 'A menswear-inspired button-up shirt crafted from crisp organic cotton poplin. Featuring a pointed collar, single chest pocket, and curved hem.',
          price: 135.00,
          category: 'Tops',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
          colors: JSON.stringify(['Sky Blue', 'Optic White']),
          stock: 25,
          featured: 0
        },
        {
          name: 'Asymmetric Ribbed Top',
          sku: 'LF-TOP-022',
          description: 'Fitted long sleeve top with an asymmetric one-shoulder neckline. Knitted from a fine-ribbed organic cotton blend with comfortable stretch.',
          price: 95.00,
          category: 'Tops',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600'
          ]),
          sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
          colors: JSON.stringify(['Oatmeal', 'Olive', 'Black']),
          stock: 35,
          featured: 0
        },
        {
          name: 'Minimalist Silk Slip Dress',
          sku: 'LF-DRS-023',
          description: 'A bias-cut slip dress crafted from lustrous mid-weight silk satin. Drapes beautifully to a midi length, featuring a square neck and open back.',
          price: 280.00,
          category: 'Dresses',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L']),
          colors: JSON.stringify(['Emerald Green', 'Midnight Black', 'Champagne']),
          stock: 15,
          featured: 1
        },
        {
          name: 'Pleated Knit Midi Dress',
          sku: 'LF-DRS-024',
          description: 'High-neck sleeveless dress knitted with dynamic pleated structure. Crafted from fine crepe yarn, creating a beautiful swaying silhouette.',
          price: 320.00,
          category: 'Dresses',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'
          ]),
          sizes: JSON.stringify(['S', 'M', 'L']),
          colors: JSON.stringify(['Oatmeal Beige', 'Terracotta']),
          stock: 14,
          featured: 1
        },
        {
          name: 'Structured Wool Blend Dress',
          sku: 'LF-DRS-025',
          description: 'A structural A-line dress tailored from a double-faced wool blend. Designed with a round neck, short sleeves, and a clean concealed rear zip.',
          price: 390.00,
          category: 'Dresses',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1539008885128-40d24efda18c?q=80&w=600'
          ]),
          sizes: JSON.stringify(['36', '38', '40', '42']),
          colors: JSON.stringify(['Charcoal', 'Burgundy']),
          stock: 10,
          featured: 0
        },
        {
          name: 'Wide-Leg Pleated Trousers',
          sku: 'LF-PNT-026',
          description: 'High-rise trousers with sweeping wide legs and double forward pleats. Made from lightweight gabardine for a beautiful flowy drape.',
          price: 180.00,
          category: 'Pants',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600'
          ]),
          sizes: JSON.stringify(['30', '32', '34', '36']),
          colors: JSON.stringify(['Sandstone', 'Midnight Black']),
          stock: 22,
          featured: 1
        },
        {
          name: 'Tailored Straight-Leg Crease Pants',
          sku: 'LF-PNT-027',
          description: 'Minimalist straight-leg trousers with front-pressed creases and side pockets. Clean hook-and-bar fastening and smooth satin waistband lining.',
          price: 190.00,
          category: 'Pants',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600'
          ]),
          sizes: JSON.stringify(['30', '32', '34', '36']),
          colors: JSON.stringify(['Dark Navy', 'Stone Grey']),
          stock: 24,
          featured: 0
        },
        {
          name: 'A-Line Pleated Midi Skirt',
          sku: 'LF-SKT-028',
          description: 'High-waisted midi skirt with sharp permanent accordion pleats. Crafted from fluid technical satin with a comfortable concealed elastic waistband.',
          price: 165.00,
          category: 'Skirts',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'
          ]),
          sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
          colors: JSON.stringify(['Champagne Gold', 'Navy Blue', 'Forest Green']),
          stock: 18,
          featured: 1
        },
        {
          name: 'Structured Wool Wrap Skirt',
          sku: 'LF-SKT-029',
          description: 'Tailored wrap skirt crafted from thick virgin wool blend. Features an asymmetric front overlap panel, horn-button detail, and side slit.',
          price: 210.00,
          category: 'Skirts',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600'
          ]),
          sizes: JSON.stringify(['36', '38', '40', '42']),
          colors: JSON.stringify(['Camel', 'Obsidian Black']),
          stock: 15,
          featured: 0
        },
        {
          name: 'Lumina Luxury Gift Card ($100)',
          sku: 'LF-VOU-100',
          description: 'Provide the gift of choice with a Lumina luxury digital gift card worth $100. Delivered electronically with code verification.',
          price: 100.00,
          category: 'Gift Vouchers',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'
          ]),
          sizes: JSON.stringify(['One Size']),
          colors: JSON.stringify(['Gold Minimalist']),
          stock: 999,
          featured: 0
        },
        {
          name: 'Lumina Luxury Gift Card ($250)',
          sku: 'LF-VOU-250',
          description: 'Provide the gift of choice with a Lumina luxury digital gift card worth $250. Delivered electronically with code verification.',
          price: 250.00,
          category: 'Gift Vouchers',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'
          ]),
          sizes: JSON.stringify(['One Size']),
          colors: JSON.stringify(['Gold Minimalist']),
          stock: 999,
          featured: 0
        },
        {
          name: 'Lumina Luxury Gift Card ($500)',
          sku: 'LF-VOU-500',
          description: 'Provide the gift of choice with a Lumina luxury digital gift card worth $500. Delivered electronically with code verification.',
          price: 500.00,
          category: 'Gift Vouchers',
          images: JSON.stringify([
            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'
          ]),
          sizes: JSON.stringify(['One Size']),
          colors: JSON.stringify(['Gold Minimalist']),
          stock: 999,
          featured: 0
        }
      ];

      for (const p of mockProducts) {
        await dbRun(
          `INSERT INTO products (name, sku, description, price, category, images, sizes, colors, stock, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.sku, p.description, p.price, p.category, p.images, p.sizes, p.colors, p.stock, p.featured]
        );
      }
      console.log('Seeded luxury products.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

module.exports = {
  db,
  dbRun,
  dbAll,
  dbGet
};
