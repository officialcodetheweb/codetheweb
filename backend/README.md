CTW Registration Backend (skeleton)
---------------------------------
Steps to run:
1. Copy .env.example to .env and fill values (DATABASE_URL, JWT_SECRET, PAYSTACK_SECRET).
2. Create a Postgres DB and run schema.sql.
3. Install dependencies: npm install
4. Create an admin user (use bcrypt to hash a password) or insert directly into users table.
5. Start: npm start
