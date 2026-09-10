# ShopList Pro 🛒

A modern, responsive shopping list application built with React, TypeScript, and Redux. ShopList Pro allows users to securely manage their daily shopping needs with personalized accounts, dynamic filtering, and a clean, mobile-first interface.

**Live Demo:** [ShopList Pro on Vercel](https://shopping-list-nine-indol.vercel.app/login)

## Features

- **Secure Authentication:** User passwords are encrypted using `crypto-js` during registration and safely decrypted for verification upon login.
- **Protected Routing:** Utilizes `react-router-dom` to ensure unauthenticated users cannot access the main dashboard, while logged-in users bypass the auth screens.
- **Complete CRUD Operations:** Users can Create, Read, Update, and Delete multiple shopping lists and individual shopping items.
- **Smart URL-Driven Filtering:** Search items by name and sort them by category or date. The search and sort parameters are synced directly to the URL (e.g., `?search=milk&sort=category`), allowing for easily shareable and bookmarkable views.
- **Profile Management:** A dedicated profile dashboard where users can securely update their personal information and login credentials.
- **Modern UX/UI:** Features a clean, minimalist design with floating action overlays (modals) for adding items and interactive empty states.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, CSS3
- **State Management:** Redux Toolkit (`react-redux`, `@reduxjs/toolkit`)
- **Routing:** React Router DOM v6
- **Backend/Database:** JSON Server (Mock REST API)
- **Security:** CryptoJS (AES Encryption)

## Installation & Setup

To run this project locally, you will need Node.js installed on your machine. This project requires two separate servers to run simultaneously: the Vite frontend and the JSON server backend.

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/Omphile-coder/shopping-list-app.git](https://github.com/Omphile-coder/shopping-list-app.git)
    cd shopping-list-app
    ```

2.  **Install dependencies:**

    ```bash

    npm i

    ```

3.  **Start the JSON Server (Backend):**

    ```bash

    npm run server

    ```

4.  **Start the Vite Development Server (Frontend):**

    ```bash

    npm run dev
    ```

5.  **Open the App:**

Navigate to http://localhost:5173 in your browser.

## 📁 Project Structure

src/

├── assets/ # Images and static assets<br>
├── components/ # Reusable UI components (Navbar, ProtectedRoutes)<br>
├── features/ # Redux slices (authSlice, shoppingListsSlice, shoppingItemSlice)<br>
├── pages/ # Full page views (Home, Login, Register, Profile, Details)<br>
├── services/ # Axios API calls (authService, shoppingListService)<br>
├── store/ # Redux store configuration and typed hooks<br>
├── utils/ # Helper functions (encryption.ts)<br>
├── App.tsx # Root component<br>
└── index.css # Global design system and custom styling

## Author

Omphile Lucas

GitHub: @Omphile-coder

Developed for CodeTribe Academy Task 4


