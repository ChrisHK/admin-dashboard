CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Admin user (password: admin)
INSERT INTO users (username, email, password_hash, is_admin) 
VALUES (
    'admin', 
    'admin@admin.com', 
    '21232f297a57a5a743894a0e4a801fc3',
    true
);

-- Products table with new structure
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    sn VARCHAR(50) NOT NULL,
    cpu VARCHAR(50),
    ram VARCHAR(20),
    storage VARCHAR(50),
    video_card VARCHAR(50),
    battery INTEGER,
    os VARCHAR(50),
    touch BOOLEAN DEFAULT FALSE,
    noted VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample product data
INSERT INTO products (date, brand, model, sn, cpu, ram, storage, video_card, battery, os, touch, noted) VALUES
('2024-10-31', 'Lenovo', 'P1', 'R90VZKBT', 'E-2176M', '32G', '1TB', 'Nvidia P2000', 98, 'Windows11 Pro', true, NULL),
('2024-10-31', 'Lenovo', 'ideaPad 510', 'PF0L84CG', 'i5-6200U', '12G', '256G', 'Nvidia MX940', 101, 'Windows11 Pro', false, NULL),
('2024-10-31', 'Dell', '7270', 'BYWHQF2', 'i7-6600U', '8G', '256G', NULL, 100, 'Windows10 Pro', false, 'A'),
('2024-10-31', 'Dell', '7270', 'HPZGQF2', 'i7-6600U', '8G', '256G', NULL, 100, 'Windows10 Pro', false, 'A,C'),
('2024-10-31', 'Dell', '7470', '5NCTMF2', 'i5-6300U', '16G', '256G', NULL, 100, 'Windows10 Pro', false, NULL),
('2024-10-31', 'Dell', '7270', 'G6LY5H2', 'i7-6600U', '8G', '256G', NULL, 100, 'Windows10 Pro', false, NULL),
('2024-10-31', 'Dell', 'P1', 'R90SZWQT', 'E-2176M', '32G', '1TB', 'Nvidia P2000', 70, 'Windows11 Pro', true, NULL);