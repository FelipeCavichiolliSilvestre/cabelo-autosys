CREATE TABLE clients (
  id INTEGER NOT NULL PRIMARY KEY,
  cpf TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE cars (
  id INTEGER NOT NULL PRIMARY KEY,
  license_plate TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL
);

CREATE TABLE products (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit_price REAL NOT NULL,
  quantity INTEGER NOT NULL
);

CREATE TABLE product_sell (
  product_id INTEGER NOT NULL,
  service_order_id INTEGER NOT NULL,
  quantity INTEGER,
  unit_sell_price FLOAT,

  PRIMARY KEY (product_id, service_order_id)
);

CREATE TABLE service_orders (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  odometer_in_km INTEGER NOT NULL,
  labor_price REAL NULL,
  created_at TEXT NOT NULL,
  is_closed INTEGER NOT NULL,
  car_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,

  FOREIGN KEY (car_id) REFERENCES cars (id),
  FOREIGN KEY (client_id) REFERENCES clients (id)
);
