# Service Booking Platform

A comprehensive platform for booking and managing various services, built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

-   **User Role Management**: Separate interfaces for Users, Providers, and Admins.
-   **Service Booking**: Easy booking flow for users.
-   **Real-time Chat**: Socket.io powered messaging between users and providers.
-   **Provider Dashboard**: Manage services, bookings, and view earnings.
-   **Admin Dashboard**: Oversee platform activity and users.
-   **Payment Integration**: Secure online payments.
-   **Responsive Design**: Built with Tailwind CSS for a seamless mobile and desktop experience.

## 🛠️ Tech Stack

### Client
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS
-   **State Management**: Context API
-   **Routing**: React Router DOM
-   **Notifications**: React Hot Toast
-   **HTTP Client**: Axios

### Server
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB (Mongoose)
-   **Authentication**: JWT & ImageKit (for uploads)
-   **Real-time**: Socket.io

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Service-booking-platform
    ```

2.  **Install Dependencies**
    
    Install server dependencies:
    ```bash
    cd server
    npm install
    ```

    Install client dependencies:
    ```bash
    cd ../client
    npm install
    ```

3.  **Environment Variables**

    Create a `.env` file in the **server** directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    # Add other necessary keys (ImageKit, Razorpay, etc.)
    ```

    Create a `.env` file in the **client** directory (if needed for API endpoints):
    ```env
    VITE_API_URL=http://localhost:5000
    ```

4.  **Run the Application**

    Start the server (development mode):
    ```bash
    cd server
    npm run dev
    ```

    Start the client:
    ```bash
    cd client
    npm run dev
    ```

    Access the application at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

[ISC](LICENSE)
