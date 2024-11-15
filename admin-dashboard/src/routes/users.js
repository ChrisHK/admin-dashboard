const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// MD5 加密
const md5Hash = (password) => {
    return crypto.createHash('md5').update(password).digest('hex');
};

// 獲取所有用戶
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, is_admin, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: '獲取用戶列表失敗', error: error.message });
    }
});

// 創建新用戶
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { username, email, password, is_admin } = req.body;
        const password_hash = md5Hash(password);
        
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_admin, created_at',
            [username, email, password_hash, is_admin || false]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: '創建用戶失敗', error: error.message });
    }
});

// 更新用戶
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, is_admin } = req.body;
        
        let query = 'UPDATE users SET username = $1, email = $2, is_admin = $3';
        let params = [username, email, is_admin];
        
        if (password) {
            query += ', password_hash = $4';
            params.push(md5Hash(password));
        }
        
        query += ' WHERE id = $' + (params.length + 1) + ' RETURNING id, username, email, is_admin, created_at';
        params.push(id);
        
        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: '找不到該用戶' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: '更新用戶失敗', error: error.message });
    }
});

// 刪除用戶
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: '找不到該用戶' });
        }
        
        res.json({ message: '用戶已刪除' });
    } catch (error) {
        res.status(500).json({ message: '刪除用戶失敗', error: error.message });
    }
});

module.exports = router; 