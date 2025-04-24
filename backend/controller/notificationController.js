const Post = require('../models/post.models');
const Notification = require('../models/notification.models');

// Notify seller when an offer is accepted
const notifySeller = async (req, res) => {
  const { items, totalAmount, message } = req.body;

  try {
    const posts = await Promise.all(
      items.map(item => Post.findById(item.postId))
    );

    const missingPosts = posts.filter(post => !post);
    if (missingPosts.length > 0) {
      throw new Error('Some items in the cart are no longer available.');
    }

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
};

// Admin view all notifications
const getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications." });
    }
  };
  
  // Delete a notification by ID
  const deleteNotification = async (req, res) => {
    try {
      const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
      if (!deletedNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Error deleting notification' });
    }
  };
  
  module.exports = { notifySeller, getNotifications, deleteNotification };
