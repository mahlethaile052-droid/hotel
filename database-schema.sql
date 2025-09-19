-- Hotel Management System Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ETB',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'created',
    provider TEXT NOT NULL DEFAULT 'paypal',
    provider_payment_id TEXT,
    user_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    salary DECIMAL(10,2),
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create income table
CREATE TABLE IF NOT EXISTS income (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    min_stock DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    last_updated DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for custom user management (optional - you can use Supabase Auth instead)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_income_category ON income(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory(quantity, min_stock);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication needs)
-- For now, allowing all operations for authenticated users
-- You can make these more restrictive based on user roles

-- Employees policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON employees;
CREATE POLICY "Allow all operations for authenticated users" ON employees
    FOR ALL USING (auth.role() = 'authenticated');

-- Income policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON income;
CREATE POLICY "Allow all operations for authenticated users" ON income
    FOR ALL USING (auth.role() = 'authenticated');

-- Expenses policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON expenses;
CREATE POLICY "Allow all operations for authenticated users" ON expenses
    FOR ALL USING (auth.role() = 'authenticated');

-- Inventory policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON inventory;
CREATE POLICY "Allow all operations for authenticated users" ON inventory
    FOR ALL USING (auth.role() = 'authenticated');

-- Users policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
CREATE POLICY "Allow all operations for authenticated users" ON users
    FOR ALL USING (auth.role() = 'authenticated');

-- Payments policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON payments;
CREATE POLICY "Allow all operations for authenticated users" ON payments
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO employees (name, role, phone, email, salary, hire_date) VALUES
    ('Ahmed Mohammed', 'chef', '+251912345678', 'ahmed@hararbridge.com', 8000.00, '2023-01-15'),
    ('Selamawit Bekele', 'cashier', '+251911234567', 'selam@hararbridge.com', 5000.00, '2023-03-20'),
    ('Tewodros Alemayehu', 'manager', '+251922345678', 'tewodros@hararbridge.com', 12000.00, '2022-11-10')
ON CONFLICT DO NOTHING;

INSERT INTO income (category, description, amount, date) VALUES
    ('meals', 'Lunch service', 12500.00, '2023-10-15'),
    ('drinks', 'Beverage sales', 5600.00, '2023-10-15'),
    ('meat', 'Special grill night', 8900.00, '2023-10-14')
ON CONFLICT DO NOTHING;

INSERT INTO expenses (category, description, amount, date) VALUES
    ('supplies', 'Kitchen supplies', 2500.00, '2023-10-15'),
    ('utilities', 'Electricity bill', 1800.00, '2023-10-14'),
    ('salaries', 'Staff payroll', 25000.00, '2023-10-10')
ON CONFLICT DO NOTHING;

INSERT INTO inventory (name, category, quantity, unit, min_stock, price) VALUES
    ('Rice', 'supplies', 50.00, 'kg', 20.00, 60.00),
    ('Chicken', 'meat', 25.00, 'kg', 15.00, 180.00),
    ('Soft Drinks', 'drinks', 10.00, 'cases', 5.00, 450.00)
ON CONFLICT DO NOTHING;
