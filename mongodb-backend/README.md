# Installation Instructions

To set up and run the server, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/mongodb-backend.git
   cd mongodb-backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Run the server:**
   ```sh
   npm start
   ```

5. **Run tests:**
   ```sh
   npm test
   ```

6. **API Status:**
   You can check if the API is running by visiting `http://localhost:5000/` in your browser.

For more detailed information, refer to the `server.js` file.