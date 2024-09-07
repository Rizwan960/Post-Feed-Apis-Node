const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/jwt-secret');


module.exports = (req,res,next)=>{
    const haveHeader = req.get('Authorization');
    if(!haveHeader)
    {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }
    const token = haveHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token,jwtSecret)
    } catch (error) {
        error.statusCode=500;
        throw error
    }
    if(!decodedToken)
    {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next()
}