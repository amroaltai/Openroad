-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
   id SERIAL PRIMARY KEY,
   brand TEXT NOT NULL,
   model TEXT NOT NULL,
   year INTEGER NOT NULL,
   image1 TEXT,
   image2 TEXT,
   image3 TEXT,
   color TEXT,
   seats INTEGER,
   horsepower INTEGER,
   type TEXT,
   category INTEGER,
   price_per_day DECIMAL(10, 2) DEFAULT NULL,
   price_per_week DECIMAL(10, 2) DEFAULT NULL,
   price_per_month DECIMAL(10, 2) DEFAULT NULL
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);

-- Make sure to add this comment at the top of your schema.sql file
-- This schema includes price columns for daily, weekly, and monthly pricing