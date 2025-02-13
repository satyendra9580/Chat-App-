[chat_app.webm](https://github.com/user-attachments/assets/b4eeee80-94df-4293-a3b0-d89e1c81fd70)
# Chat-App

## Overview

Chat-App is a full-stack web application that enables real-time chat functionality using modern web technologies. The app consists of a client-side built with React and Tailwind CSS and a server-side powered by Node.js and Socket.IO.

## Features

- Real-time messaging with Socket.IO
- User authentication with JWT
- Emoji picker for enhanced messaging
- Light and dark theme support
- Responsive design

## Technologies & Tools

### Client-Side

- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Axios**: A promise-based HTTP client for making requests to our server.
- **Socket.IO Client**: For real-time, bidirectional communication between web clients and servers.
- **Radix UI**: Primitives for building accessible, high-quality design systems and web apps.

### Server-Side

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **Socket.IO**: Enables real-time, bidirectional and event-based communication.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (jsonwebtoken)**: For securely transmitting information between parties as a JSON object.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js installed on your machine
- MongoDB setup (locally or using a cloud service like MongoDB Atlas)

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/satyendra9580/Chat-App.git
   cd Chat-App
##

 1. Install NPM packages for both client and server
    ```sh
    cd client
    npm install
    cd ../server
    npm install

 2. Create a .env file in the server directory and add your MongoDB URI and JWT secret
    ```sh
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret

## Running the Application

1. Start the server
   ```sh
   cd server
   node index.js
2. Start the client
   ```sh
   cd client
   npm run dev
3. Open your browser and navigate to http://localhost:5173

# Scripts


# Client
1. dev: Starts the client in development mode using Vite.
2. build: Builds the client for production.
3. lint: Runs ESLint to check for code quality issues.
4. preview: Previews the production build locally.

# Server

1. start: Starts the server using Node.js.
2. test: Runs server-side tests (if available).
3. lint: Runs ESLint to check for code quality issues on the server-side.

## Contributing
##

Contributions are what make the open-source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Contact
##

Satyendra Singh - LinkedIn - seenu5180singh@gmail.com

Project Link: https://github.com/satyendra9580/Chat-App
