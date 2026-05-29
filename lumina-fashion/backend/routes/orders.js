const express = require('express');
const router = express.Router();
const { dbRun, dbAll, dbGet } = require('../db');
const { authenticateToken, isAdmin } = require('../middleware');

// Optional authentication middleware for checkout (to support guest checkouts too)
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  const { JWT_SECRET } = require('../middleware');
  const jwt = require('jsonwebtoken');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null; // treats invalid token as guest rather than failing
    } else {
      req.user = decoded;
    }
    next();
  });
}

// POST /api/orders (Checkout)
router.post('/', optionalAuthenticate, async (req, res, next) => {
  try {
    const { items, total_amount, shipping_address, billing_address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid.' });
    }

    if (!total_amount || !shipping_address) {
      return res.status(400).json({ error: 'Missing total amount or shipping address details.' });
    }

    const userId = req.user ? req.user.id : null;

    // Create Order in DB
    const orderResult = await dbRun(
      `INSERT INTO orders (user_id, total_amount, shipping_address, billing_address)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        total_amount,
        JSON.stringify(shipping_address),
        JSON.stringify(billing_address || shipping_address)
      ]
    );

    const orderId = orderResult.lastID;

    // Insert Order Items
    for (const item of items) {
      const { product_id, size, color, quantity, price } = item;
      
      // Basic validation
      if (!product_id || !size || !color || !quantity || !price) {
        return res.status(400).json({ error: 'Invalid order item data.' });
      }

      await dbRun(
        `INSERT INTO order_items (order_id, product_id, size, color, quantity, price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, product_id, size, color, quantity, price]
      );

      // Decrement stock in products
      await dbRun(
        'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?',
        [quantity, product_id]
      );
    }

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      total_amount,
      status: 'pending'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders (User's order history)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all user's orders
    const orders = await dbAll(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // Hydrate orders with their items
    const hydratedOrders = [];

    for (const order of orders) {
      const items = await dbAll(
        `SELECT oi.*, p.name as product_name, p.images as product_images
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      const formattedItems = items.map(item => ({
        ...item,
        product_images: JSON.parse(item.product_images || '[]')
      }));

      hydratedOrders.push({
        ...order,
        shipping_address: JSON.parse(order.shipping_address || '{}'),
        billing_address: JSON.parse(order.billing_address || '{}'),
        items: formattedItems
      });
    }

    res.json(hydratedOrders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/all (Admin: get all orders)
router.get('/all', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const orders = await dbAll(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    const hydratedOrders = [];

    for (const order of orders) {
      const items = await dbAll(
        `SELECT oi.*, p.name as product_name, p.images as product_images
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      const formattedItems = items.map(item => ({
        ...item,
        product_images: JSON.parse(item.product_images || '[]')
      }));

      hydratedOrders.push({
        ...order,
        shipping_address: JSON.parse(order.shipping_address || '{}'),
        billing_address: JSON.parse(order.billing_address || '{}'),
        items: formattedItems
      });
    }

    res.json(hydratedOrders);
  } catch (error) {
    next(error);
  }
});

// PUT /api/orders/:id/status (Admin: update order status)
router.put('/:id/status', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Please provide the order status.' });
    }

    const validStatuses = ['pending', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid order status.' });
    }

    const existing = await dbGet('SELECT id FROM orders WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    await dbRun(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status.toLowerCase(), id]
    );

    res.json({ message: 'Order status updated successfully.', orderId: id, status: status.toLowerCase() });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
