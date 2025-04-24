const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  availability: String,
  price: Number,
  specs: String,
  sellerEmail: String, // Assuming seller email is part of the post schema
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
