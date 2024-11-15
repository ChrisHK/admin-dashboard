const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const app = express();

// 中間件設置
app.use(cors());
app.use(express.json());

// 路由設置
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// API 404 處理
app.use((req, res) => {
    res.status(404).json({ message: '找不到該 API 端點' });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '服務器錯誤' });
});

// 數據庫連接設置
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// 導出數據庫連接池供其他模塊使用
module.exports.pool = pool;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API 服務器運行在 http://localhost:${PORT}`);
}); 