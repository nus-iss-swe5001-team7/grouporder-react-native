DROP TABLE IF EXISTS "user";

Create Table "user" (
                       user_id UUID NOT NULL PRIMARY KEY,
                       user_name VARCHAR UNIQUE NOT NULL,
                       password VARCHAR NOT NULL,
                       email VARCHAR UNIQUE NOT NULL,
                       user_role VARCHAR NOT NULL
);

INSERT INTO "user" (user_id, user_name, password, email, user_role) VALUES
    ('c8ac6582-9712-4646-b6b1-3d32f163ef90', 'cust', 'cust', 'cust@mail.com', 'customer');