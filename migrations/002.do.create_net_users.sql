CREATE TABLE net_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
);