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

CREATE TABLE IF NOT EXISTS movements (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description VARCHAR(160) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    date DATE NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT movements_description_not_blank_check
        CHECK (char_length(btrim(description)) > 0),
    CONSTRAINT movements_amount_positive_check CHECK (amount > 0),
    CONSTRAINT movements_category_fk
        FOREIGN KEY (category_id) REFERENCES categories (id)
);
