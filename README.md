🍬🍭 SWEET SHOP MANAGEMENT SYSTEM
🚀 A Full-Stack, Test-Driven Web Application

Incubyte Kata Task Submission
Built with a strong focus on clean architecture, role-based access, and automated testing.

🧠 Project Overview

The Sweet Shop Management System is a full-stack web application designed to manage the operations of a sweet shop efficiently.

It allows:

Users to browse, search, and purchase sweets

Admins to manage inventory, pricing, stock, and availability

The project was developed with an emphasis on:

Real-world backend APIs

Clean frontend architecture

Test-Driven Development (TDD)

Secure authentication and authorization

✨✨ Core Features
🔐 Authentication & Authorization

User Registration and Login

JWT-based authentication

Role-based access control (Admin / User)

🍭 Sweet Inventory Management

View available sweets

Purchase sweets (automatic quantity updates)

Admin-only operations:

➕ Add sweets

✏️ Edit sweets

🔄 Restock sweets

🗑️ Delete sweets

🔍 Advanced Search & Filtering

Search sweets by name OR category

Filter sweets by price range

Combined search + price filtering for better UX

🧪 Automated Testing

Backend API testing

Frontend component & route testing

Separate test suites for clarity and maintainability

🛠️ Technology Stack
🖥️ Frontend

React

Vite

CSS

⚙️ Backend

Node.js

Express.js

MySQL

JWT Authentication

🧪 Testing Tools

Jest

Supertest

Vitest

React Testing Library

⚙️⚙️ Local Setup & Installation
🔹 Backend Setup
cd backend
npm install


Create a .env file using .env.example:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sweet_shop
JWT_SECRET=your_secret


Start the backend server:

npm start


➡️ Backend runs on: http://localhost:5000

🔹 Frontend Setup
cd frontend
npm install
npm run dev


➡️ Frontend runs on: http://localhost:5173

## 📸 Screenshots

Below are screenshots of the final application in action, covering core features and test results.

### 🔐 Login Page
![Login Page](screenshots/login.png)

### 📝 Register Page
![Register Page](screenshots/register.png)

### 📊 Dashboard
![Dashboard](screenshots/dashboard.png)

### ➕ Add Sweet (Admin)
![Add Sweet](screenshots/addsweet.png)

### 🔍 Search & Price Filter
![Search Filter Example 1](screenshots/searchfilter1.png)
![Search Filter Example 2](screenshots/searchfilter2.png)

### 🧪 Backend Test Results
![Backend Tests](screenshots/backendtest.png)

### 🧪 Frontend Test Results
![Frontend Tests](screenshots/frontendtest.png)


Written using Jest and Supertest

Covers:

Authentication APIs

Sweets CRUD operations

Authorization logic

Run backend tests:

cd backend
npm test

✅ Frontend Tests

Written using Vitest and React Testing Library

Covers:

Login & Register components

Dashboard rendering

Protected routes

Admin routes

Run frontend tests:

cd frontend
npm run test


✔ All tests pass successfully.

🤖🤖 My AI Usage (Mandatory Disclosure)

AI tools (ChatGPT) were used responsibly and transparently during the development of this project.

🔍 How AI was used:

Generating backend and frontend test code, as automated testing was new to me

Understanding testing patterns, assertions, and mocking strategies

Assisting with debugging and resolving errors

Helping with SQL query design and search/filter logic

Improving code structure, readability, and documentation

🧠 Ownership & Learning:

All AI-generated code was reviewed, modified, and fully understood

Final implementations, integrations, and architectural decisions were made by me

AI was used strictly as a learning assistant and productivity aid

📁📁 Project Structure
├── backend/
│   ├── tests/
│   ├── .env.example
│   ├── database.sql
│   ├── server.js
│   ├── start.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── tests/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│   ├── login.png
│   ├── register.png
│   ├── dashboard.png
│   ├── addsweet.png
│   ├── searchfilter1.png
│   ├── searchfilter2.png
│   ├── backendtest.png
│   └── frontendtest.png
│
├── README.md

🌱 Key Learnings & Takeaways

Practical experience with full-stack application development

Strong understanding of JWT authentication & authorization

Hands-on learning of automated testing

Improved skills in React routing, state management, and API integration

Better understanding of SQL filtering and search logic

👤 Author
Pallav Rai
