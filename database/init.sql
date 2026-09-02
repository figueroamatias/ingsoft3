CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_normalized_check
        CHECK (email = lower(btrim(email)) AND char_length(email) > 0)
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(80) NOT NULL,
    type VARCHAR(10) NOT NULL,
    CONSTRAINT categories_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT categories_type_check CHECK (type IN ('income', 'expense')),
    CONSTRAINT categories_name_not_blank_check
        CHECK (char_length(btrim(name)) > 0),
    CONSTRAINT categories_id_user_unique UNIQUE (id, user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_user_name_unique
    ON categories (user_id, lower(name));

CREATE TABLE IF NOT EXISTS movements (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    description VARCHAR(160) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    date DATE NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT movements_user_fk
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT movements_description_not_blank_check
        CHECK (char_length(btrim(description)) > 0),
    CONSTRAINT movements_amount_positive_check CHECK (amount > 0),
    CONSTRAINT movements_category_user_fk
        FOREIGN KEY (category_id, user_id)
        REFERENCES categories (id, user_id)
);
