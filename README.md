Marketly

Modern e-commerce web application built with React, Firebase, Redux Toolkit, and Firestore.

Live Demo

https://marketly-nu.vercel.app

---

Features

- Firebase Authentication
- Guest browsing support
- Persistent cart system
- Product categories and product details pages
- Real order system using Firestore
- Order tracking
- Admin dashboard
- Products management
- Users management
- Backup & Restore system
- Seeding products from Platzi API
- Dark / Light mode
- Responsive design
- SEO optimization using React Helmet

---

System Overview

The project uses Firebase Authentication and Firestore instead of relying directly on Platzi API data.

This approach was implemented because Platzi product data can sometimes become unstable since editing and deleting products are publicly accessible there.

To solve this issue, products are fetched from Platzi API once and stored inside a dedicated Firestore collection, then the application works entirely using Firestore data.

Orders are also stored in Firestore, which means:

- Orders are accessible from any device
- Orders persist after refresh or logout
- My Orders and Track Order pages use real Firestore data

Only cart items are temporarily stored in localStorage and they are automatically cleared after successful checkout.

---

Admin Dashboard

The admin dashboard includes:

Users Management

- View registered users
- Remove users from Firestore collection

Note:
Deleting a user only removes them from the Firestore collection.
If the same user logs in again, they will automatically appear again because permanent account deletion requires backend admin privileges.

Products Management

- Add products
- Edit products
- Delete products

All changes are applied directly to Firestore and affect the live website data.

---

Owner Features

The owner role includes two additional tabs:

Backup & Restore

Creates backups for the products collection and restores products in case of accidental deletion.

Seeding

Fetches products from Platzi API and inserts them into the main Firestore products collection.

---

Demo Admin Account

Email: admin@marketly.com

Password: 123456789

The owner account remains private to avoid accidental modifications to the database.

---

Tech Stack

Frontend

- React
- React Router DOM
- Redux Toolkit
- CSS Modules
- Bootstrap
- React Helmet Async
- React Hot Toast
- Formik
- Yup

Backend Services

- Firebase Authentication
- Firestore Database

Deployment

- Vercel

---

Installation

Clone the repository

git clone https://github.com/your-username/marketly.git

Navigate to project folder

cd marketly

Install dependencies

npm install

Run development server

npm start

---

Project Structure

src/
 ├── Components/
 ├── Context/
 ├── Store/
 ├── firebase.js
 ├── App.js

---

Team Members

- Sohaib Ayman Elsayed Elbadawy Ashry
- Hossam Hassan Mostafa Hassan
- Mohamed Ahmed Thabet Hussein
- Rawan Hamdi Mohamed Saad
- Abdelrahman Khaled Slahelden Mohamed

---

This project was developed as part of the Rowad Initiative.
