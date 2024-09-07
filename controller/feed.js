
const { validationResult } = require('express-validator')
const Post = require('../model/post')
const fs =require('fs');
const path =require('path');

exports.getPosts = async (req,res,next)=>{

    Post.find()
    .then(posts=>{
        res.status(200 ).json({
            message: "Posts fetched successfully",
            posts : posts
        })
    })
    .catch(err=>{
    console.log(err)
    })
}

exports.createPost = (req,res,next)=>{
    // const errors = validationResult(req);
    // if(!errors.isEmpty)
    // {
        // const error = new Error('Validation Failed Entered Data is incorrect');
        // error.statusCode = 422;
        // throw error;
    // }
    if(!req.file)
    {
        const error = new Error('No Image provided');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path
    const post = new Post({
        title:title, 
        content:content,
        imageUrl :imageUrl,
        creator : {
            name : 'Rizwan Ali'
        },
    })
    post.save()
    .then(result=>{
        res.status(201).json({
            message:"Post created successfully",
            post: result
        })
    })
    .catch(err=>{
        if(!err.statusCode)
        {
            err.statusCode = 500;
        }
        next(err)
    })
   
}

exports.getPost = (req,res,next)=>{
    const postId = req.params.postId
    Post.findById(postId)
    .then(post=>{
        if(!post)
        {
            const error = new Error('Could not find the post');
            error.statusCode= 404;
            throw error;
        }
        res.status(200).json({message:"Post Fetched", post:post})
    })
    .catch(err=>{
        if(!err.statusCode)
            {
                err.statusCode = 500;
            }
            next(err)
    })
}

exports.updatePost = (req,res,next)=>{
    const postId = req.params.postId
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.image
    if(req.file){
        imageUrl=req.file.path
    }
    if(!imageUrl)
    {
        const error = new Error('Image is required');
        error.statusCode = 422;
        throw error; 
    }
    Post.findById(postId)
    .then(post=>{
        if(!post)
        {
            const error = new Error('Could not find the post');
            error.statusCode= 404;
            throw error;
        }
        if(imageUrl !== post.imageUrl)
        {
            clearImage(post.imageUrl)
        }
        post.title=title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    }).then(result=>{
        res.status(200).json({
            message:"Post Updated",
            post: result
        })
    })
    .catch(err=>{
        console.log(err)
        if(!err.statusCode)
            {
                err.statusCode = 500;
            }
            next(err)
    })
}

exports.deletePost = (req,res,next)=>{
    const postId = req.params.postId
    Post.findById(postId)
    .then(post=>{
        if(!post)
        {
            const error = new Error('Could not find the post');
            error.statusCode= 404;
            throw error;
        }
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(postId)
    }).then(result=>{
        res.status(200).json({
            message:"Post Deleted",
            post: result
        })
    })
    .catch(err=>{
        console.log(err)
        if(!err.statusCode)
            {
                err.statusCode = 500;
            }
            next(err)
    })
}


const clearImage =filePlath=>{
    filePlath = path.join(__dirname,"..",filePlath);
    fs.unlink(filePlath,err=>console.log(err))
}