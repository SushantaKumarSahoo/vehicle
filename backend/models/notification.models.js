const mongoose = require('mongoose')


const notificationSchema = new mongoose.Schema({
    type: String, // e.g., "offer_accepted", "contact_seller"
    postId: mongoose.Schema.Types.ObjectId,
    message: String,
    createdAt: { type: Date, default: Date.now }
  });
  const Notification = mongoose.model('Notification', notificationSchema);

module.exports= Notification