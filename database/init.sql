CREATE TABLE IF NOT EXISTS categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    type VARCHAR(10) NOT NULL,
    CONSTRAINT categories_type_check CHECK (type IN ('income', 'expense'))
);

INSERT INTO categories (name, type)
VALUES
    ('Sueldo', 'income'),
    ('Otros ingresos', 'income'),
    ('Alimentación', 'expense'),
    ('Transporte', 'expense'),
    ('Servicios', 'expense'),
    ('Ocio', 'expense')
ON CONFLICT (name) DO NOTHING;
