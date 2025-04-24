const Post = require('../models/post.models');
// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error fetching posts');
  }
};
// Create a new post
const createPost = async (req, res) => {
  const { title, availability, price, specs, sellerEmail } = req.body;
  const newPost = new Post({ title, availability, price, specs, sellerEmail });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
};
// Edit a post by ID
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, availability, price, specs } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, availability, price, specs },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete a post by ID
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

module.exports = { getAllPosts, createPost, updatePost, deletePost };
