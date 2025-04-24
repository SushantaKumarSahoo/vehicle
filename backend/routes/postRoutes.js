const express = require('express');
const router = express.Router();
const { getAllPosts, createPost, updatePost, deletePost } = require('../controller/postController');

router.get('/api/posts', getAllPosts);
router.post('/api/posts', createPost);
router.put('/api/posts/:id', updatePost);
router.delete('/api/posts/:id', deletePost);

module.exports = router;
