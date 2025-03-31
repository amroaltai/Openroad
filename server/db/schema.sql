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
  category INTEGER
);