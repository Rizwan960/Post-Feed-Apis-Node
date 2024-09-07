const express = require('express');
const feedController = require('../controller/feed')
const router = express.Router();
const isAuthentication = require('../middleware/is-auth')


//get the posts
router.get('/posts', isAuthentication ,feedController.getPosts);
//create the posts
router.post('/post',isAuthentication ,feedController.createPost);

router.get('/post/:postId',isAuthentication ,feedController.getPost)

router.put('/post/:postId',isAuthentication, feedController.updatePost)

router.delete('/post/:postId',isAuthentication ,feedController.deletePost)

router.get('/status', isAuthentication ,feedController.getStatus);

router.patch('/status', isAuthentication ,feedController.updateStatus);






module.exports = router;