const express = require('express');
const router = express.Router();
const { dbRun, dbAll, dbGet } = require('../db');
const { authenticateToken, isAdmin } = require('../middleware');

const normalizeFacetValue = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const matchesFacetValue = (filterValue, values = []) => {
  if (!filterValue) return true;

  const normalizedFilter = normalizeFacetValue(filterValue);
  return values.some((value) => normalizeFacetValue(value).includes(normalizedFilter));
};

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { category, search, featured, sort, minPrice, maxPrice, availability, size, color } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured !== undefined) {
      query += ' AND featured = ?';
      params.push(featured === 'true' ? 1 : 0);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (availability === 'in-stock') {
      query += ' AND stock > 0';
    } else if (availability === 'out-of-stock') {
      query += ' AND stock = 0';
    }

    // Sorting
    if (sort === 'price-low') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price-high') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY created_at DESC';
    } else {
      query += ' ORDER BY id ASC'; // default sorting
    }

    const products = await dbAll(query, params);

    // Normalize size/color matching against the stored array values so shorthand
    // UI labels like "White", "Grey", and "Gold" match real inventory labels.
    const filteredProducts = products.filter((product) => {
      const sizes = JSON.parse(product.sizes || '[]');
      const colors = JSON.parse(product.colors || '[]');

      const sizeMatch = matchesFacetValue(size, sizes);
      const colorMatch = matchesFacetValue(color, colors);

      return sizeMatch && colorMatch;
    });

    // Format SQLite strings to actual arrays
    const formattedProducts = filteredProducts.map((product) => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]'),
      featured: !!product.featured
    }));

    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const formattedProduct = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]'),
      featured: !!product.featured
    };

    res.json(formattedProduct);
  } catch (error) {
    next(error);
  }
});

// POST /api/products (Admin: create product)
router.post('/', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { name, sku, description, price, category, images, sizes, colors, stock, featured } = req.body;

    if (!name || !sku || price === undefined || !category || stock === undefined) {
      return res.status(400).json({ error: 'Missing required product fields.' });
    }

    const existing = await dbGet('SELECT id FROM products WHERE sku = ?', [sku]);
    if (existing) {
      return res.status(400).json({ error: 'A product with this SKU already exists.' });
    }

    const result = await dbRun(
      `INSERT INTO products (name, sku, description, price, category, images, sizes, colors, stock, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        sku,
        description || '',
        price,
        category,
        JSON.stringify(images || []),
        JSON.stringify(sizes || []),
        JSON.stringify(colors || []),
        stock,
        featured ? 1 : 0
      ]
    );

    const newProduct = await dbGet('SELECT * FROM products WHERE id = ?', [result.lastID]);
    const formatted = {
      ...newProduct,
      images: JSON.parse(newProduct.images || '[]'),
      sizes: JSON.parse(newProduct.sizes || '[]'),
      colors: JSON.parse(newProduct.colors || '[]'),
      featured: !!newProduct.featured
    };

    res.status(201).json(formatted);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id (Admin: update product)
router.put('/:id', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { name, sku, description, price, category, images, sizes, colors, stock, featured } = req.body;
    const { id } = req.params;

    const existing = await dbGet('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (sku) {
      const skuDuplicate = await dbGet('SELECT id FROM products WHERE sku = ? AND id != ?', [sku, id]);
      if (skuDuplicate) {
        return res.status(400).json({ error: 'Another product with this SKU already exists.' });
      }
    }

    await dbRun(
      `UPDATE products 
       SET name = ?, sku = ?, description = ?, price = ?, category = ?, images = ?, sizes = ?, colors = ?, stock = ?, featured = ?
       WHERE id = ?`,
      [
        name,
        sku,
        description || '',
        price,
        category,
        JSON.stringify(images || []),
        JSON.stringify(sizes || []),
        JSON.stringify(colors || []),
        stock,
        featured ? 1 : 0,
        id
      ]
    );

    const updatedProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    const formatted = {
      ...updatedProduct,
      images: JSON.parse(updatedProduct.images || '[]'),
      sizes: JSON.parse(updatedProduct.sizes || '[]'),
      colors: JSON.parse(updatedProduct.colors || '[]'),
      featured: !!updatedProduct.featured
    };

    res.json(formatted);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id (Admin: delete product)
router.delete('/:id', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await dbGet('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await dbRun('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
