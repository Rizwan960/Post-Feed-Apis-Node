const { validationResult } = require('express-validator')
const User = require('../model/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/jwt-secret');
exports.signup = async (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name);
    console.log(email);
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        name : name,
        email : email,
        password : hashedPassword
    });
    return user.save()
    .then(result=>{
        return res.status(201).json({
            message : "User created successfully",
            userId : result._id,
        })
    })
    .catch((err) => {
        if(!err.statusCode)
            {
                err.statusCode=500;
            }
            next(err)
    });
}


exports.login = async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password; 
    let loadedUser;
    User.findOne({email:email})
    .then((user) => {
        if(!user)
        {
            const error = "No user found with this email";
            error.statusCode =401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password,user.password)
    }).then(isEqual=>{
        if(!isEqual)
            {
                const error = "Email or Password is incorrect";
                error.statusCode =401;
                throw error;
            }
        const token = jwt.sign({
            email : loadedUser.email,
            userId : loadedUser._id.toString()
        },jwtSecret);
        res.status(200).json({
            token : token,
            userId : loadedUser._id.toString()
        })
    })
    .catch((err) => {
        if(!err.statusCode)
        {
            err.statusCode=500;
        }
        next(err)
    }); 
}
