# Administrative Services Management System - Backend

Welcome to the backend microservices workspace for the Administrative Services Management System! This project uses a **NestJS Monorepo (NPM Workspaces)** architecture connected to **PostgreSQL**.

---

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed on your Windows machine:
1. **Node.js** (v18+)
2. **PostgreSQL** & **pgAdmin 4** (For database management)
3. **NestJS CLI** (Required to start the servers). Install it globally by running:
   ```bash
   npm install -g @nestjs/cli
   ```

---

## 🚀 First-Time Setup Guide

### 1. Install Dependencies
We use NPM Workspaces to manage all microservices from a single folder. You do **not** need to run install in every individual folder!
Open your terminal in the `services\admin system` folder and run:
```bash
npm install
```
*This will intelligently download all NestJS and TypeORM packages once and share them across all services.*

### 2. Configure Environment Variables
Each microservice needs to know how to talk to your local PostgreSQL database. 
In **each** microservice folder (e.g., `auth-service`, `transaction-service`, `period-service`), create a `.env` file and add your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_postgres_password
```

### 3. Initialize the Databases
NestJS is configured to connect to specific databases, but you must physically create them in PostgreSQL first.
1. Open **SQLTools** (VS Code extension) or **pgAdmin 4**.
2. Create the 5 individual databases (e.g., `office_user_db`, `commitment_db`, etc.).
3. Connect to a specific database, open its `src/database/init.sql` file, and hit **Run Selected Query** to create its tables and ENUM types.

### 4. Seed the Databases with Dummy Data
Once the tables exist, you can automatically populate them with sample data by running the seed scripts in your root terminal.

**Crucial:** You must seed the standalone databases first, or the relational databases will crash!

**Step A (Standalone):**
```bash
npm run seed --workspace=auth-service
npm run seed --workspace=period-service
npm run seed --workspace=service-catalog-service
```

**Step B (Relational):**
```bash
npm run seed --workspace=commitment-service
npm run seed --workspace=transaction-service
```
*(If successful, each command will print a `✅ seeded!` message).*

---

## 🏃‍♂️ How to Run the Services

Because we are using NPM Workspaces, you can start any microservice directly from the main `admin system` folder using a single command format!

**To start the Auth Service:**
```bash
npm run start --workspace=auth-service
```

**To start the Transaction Service:**
```bash
npm run start --workspace=transaction-service
```

*(When it successfully connects to the database, you will see a green `TypeOrmModule dependencies initialized` message in the console!)*

---

## 📂 Important Files & Folder Structure

Here is a quick guide to what the most important files do:

### Global Configuration Files
* **`package.json` (Root)**: The master dependency file. It holds the shared libraries for all services. Never delete the `node_modules` folder next to this!
* **`tsconfig.json` (Root)**: Tells your code editor (like VS Code) how to correctly read NestJS decorators (like `@Entity` and `@Column`) without throwing errors.

### Inside Each Microservice (`src/database/`)
* **`init.sql`**: The raw SQL code that physically creates your databases and tables in PostgreSQL. Always run this in pgAdmin first.
* **`database.module.ts`**: The bridge between NestJS and Postgres. It reads your `.env` file and uses TypeORM to establish the live backend connection.
* **`entities/*.entity.ts`**: The TypeScript representation of your SQL tables. This is what allows you to write Javascript code to fetch and save data later on, instead of writing raw SQL queries every time.
* **`app.module.ts`**: The brain of the microservice. It imports the Database and Config modules so the app can start up and read your passwords properly.
