const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Get all products
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
});

// Create product
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { 
            name, 
            status, 
            inventory, 
            variants,
            category,
            type,
            vendor 
        } = req.body;
        
        const result = await pool.query(
            `INSERT INTO products (name, status, inventory, variants, category, type, vendor) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [name, status, inventory, variants, category, type, vendor]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            status, 
            inventory, 
            variants,
            category,
            type,
            vendor 
        } = req.body;
        
        const result = await pool.query(
            `UPDATE products 
             SET name = $1, status = $2, inventory = $3, variants = $4, 
                 category = $5, type = $6, vendor = $7
             WHERE id = $8 
             RETURNING *`,
            [name, status, inventory, variants, category, type, vendor, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING id',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});

module.exports = router; 