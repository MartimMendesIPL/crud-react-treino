CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO items(name) VALUES ('Learn Docker'), ('Build React App');