const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: "https://vehicle-pi.vercel.app", // frontend URL
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(url)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define schemas
const postSchema = new mongoose.Schema({
  title: String,
  availability: String,
  price: Number,
  specs: String,
  sellerEmail: String, // Assuming seller email is part of the post schema
});

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

const adminSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

const notificationSchema = new mongoose.Schema({
  type: String, // e.g., "offer_accepted", "contact_seller"
  postId: mongoose.Schema.Types.ObjectId,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

// Create models
const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// Routes

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).send('Error fetching posts');
  }
});

// Create a new post
app.post('/api/posts', async (req, res) => {
  const { title, availability, price, specs, sellerEmail } = req.body;
  const newPost = new Post({ title, availability, price, specs, sellerEmail });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).send('Error creating post');
  }
});

// Edit a post by ID
app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, availability, price, specs } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, availability, price, specs },
      { new: true } // Returns the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send('Error during login');
  }
});

// User signup
app.post('/api/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  const newUser = new User({ fullName, email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).send('Error creating user');
  }
});

// Admin login
app.post('/api/adlogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email, password });
    if (admin) {
      res.json({ message: 'Login successful', admin });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send('Error during login');
  }
});

// Admin signup
app.post('/api/adsignup', async (req, res) => {
  const { fullName, email, password } = req.body;
  const newAdmin = new Admin({ fullName, email, password });
  try {
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).send('Error creating admin');
  }
});

// Notify seller when an offer is accepted
app.post('/api/notify-seller', async (req, res) => {
  const { items, totalAmount, message } = req.body;

  try {
    // Verify all posts exist
    const posts = await Promise.all(
      items.map(item => Post.findById(item.postId))
    );

    // Check if any post was not found
    const missingPosts = posts.filter(post => !post);
    if (missingPosts.length > 0) {
      throw new Error('Some items in the cart are no longer available.');
    }

    // Create a single summary notification
    const summaryNotification = new Notification({
      type: "cart_summary",
      message: `Cart Summary:\n${message}\n\nTotal Amount: ₹${totalAmount}`,
      createdAt: new Date(),
      items: items.map(item => ({
        postId: item.postId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice
      })),
      totalAmount
    });

    await summaryNotification.save();

    // Log the notification (you can replace this with actual email sending)
    console.log(`Notified seller about cart items. Total amount: ₹${totalAmount}`);

    res.json({ 
      message: "Seller notified of cart items.",
      totalItems: items.length,
      totalAmount
    });
  } catch (error) {
    console.error("Error in notify-seller:", error);
    res.status(500).json({ 
      message: "Failed to notify seller.",
      error: error.message 
    });
  }
});

// Admin view all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
});

// Delete a post by ID
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// Delete a notification by ID
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
