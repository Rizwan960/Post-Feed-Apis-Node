const express = require('express');
const feedController = require('../controller/feed')
const router = express.Router();

//get the posts
router.get('/posts',feedController.getPosts);
//create the posts
router.post('/post',feedController.createPost);

router.get('/post/:postId',feedController.getPost)

router.put('/post/:postId',feedController.updatePost)

router.delete('/post/:postId',feedController.deletePost)



module.exports = router;