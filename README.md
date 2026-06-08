# Marketly

Modern e-commerce web application built with React, Firebase, Redux Toolkit, and Firestore.

## Live Demo

https://marketly-nu.vercel.app

---

## Features

### Authentication & Users

* Firebase Authentication
* Guest browsing support
* Persistent user sessions
* User roles (User, Admin, Owner)

### Shopping Experience

* Product catalog
* Categories browsing
* Product details pages
* Search and filtering
* Shopping cart
* Real checkout flow
* Order tracking
* Order history

### Admin Dashboard

* User Management
* Product Management
* Order Management
* Real-time Firestore updates

### Owner Features

* Backup & Restore system
* Products seeding from Platzi API
* System settings management

### Additional Features

* Dark / Light mode
* Responsive design
* SEO optimization with React Helmet Async
* Toast notifications
* Real-time Firestore synchronization

---

## System Architecture

Marketly uses Firebase Authentication and Firestore as the primary backend services.

Although products can be imported from the Platzi API, the application does not rely on Platzi data during normal operation.

Products are imported once and stored in Firestore, allowing the application to:

* Maintain stable product data
* Avoid external API inconsistencies
* Support real product management operations
* Keep all modifications synchronized across the platform

Orders are stored entirely in Firestore, which means:

* Orders are available across devices
* Orders persist after logout
* Order tracking uses real database data
* Admins can manage order statuses in real time

Only cart items are temporarily stored in localStorage and are automatically cleared after a successful checkout.

---

## Admin Dashboard

### Users Management

* View registered users
* Remove users from Firestore records

**Note:** Removing a user only deletes the Firestore document. If the same user signs in again, a new record will be automatically created.

### Products Management

* Create products
* Edit products
* Delete products
* Manage multiple product images

All changes are applied directly to Firestore and immediately affect the live website.

### Orders Management

* View all orders
* Inspect order details
* Update order status
* Track customer purchases

---

## Owner Features

### Backup & Restore

Create backups of products and categories collections and restore them when needed.

### Products Seeding

Import products from Platzi API directly into Firestore collections.

### Settings

Manage system-level operations and data synchronization.

---

## Demo Admin Account

Email: [admin@marketly.com](mailto:admin@marketly.com)

Password: 123456789

The Owner account remains private to prevent accidental database modifications.

---

## Tech Stack

### Frontend

* React
* React Router DOM
* Redux Toolkit
* CSS Modules
* Bootstrap
* React Helmet Async
* React Hot Toast
* Formik
* Yup

### Backend Services

* Firebase Authentication
* Cloud Firestore

### Deployment

* Vercel

---

## Installation

### Clone Repository

```bash
git clone https://github.com/sohaib-ayman/marketly.git
```

### Navigate to Project Directory

```bash
cd marketly
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm start
```

---

## Project Structure

```text
src/
├── Components/
├── Context/
├── Store/
├── firebase.js
├── App.js
```

---

## Team Members

* Sohaib Ayman Elsayed Elbadawy Ashry
* Hossam Hassan Mostafa Hassan
* Mohamed Ahmed Thabet Hussein
* Rawan Hamdi Mohamed Saad
* Abdelrahman Khaled Slahelden Mohamed

---

## Initiative

This project was developed as part of the Digital Egypt Pioneers Initiative (DEPI).
