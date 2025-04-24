const express = require('express');

const setupMiddleware = require('./middleware/setupMiddleware');

const connectToMongodB = require('./db/connectToMongodb')

const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
<<<<<<< HEAD
app.use(cors({
  origin: "https://vehicle-pi.vercel.app", // frontend URL
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
=======
setupMiddleware(app);
>>>>>>> 7de0ea5 (WIP: temporary commit before pull)

//Routes
app.use(postRoutes);

app.use(authRoutes);

app.use(notificationRoutes);

// Start server
app.listen(port, () => {
// Connect to MongoDB
  connectToMongodB();
  console.log(`Server running on port ${port}`);
});
