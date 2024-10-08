const path = require('path')
const express = require('express');
const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')
const mongoose = require('mongoose');
const MONGODB_URI='mongodb+srv://f2020065105:11223344@feedpost.z4l0k.mongodb.net/?retryWrites=true&w=majority&appName=FeedPost'
const multer = require('multer')


const fileStorage = multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+'-'+ file.originalname)
    },
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg')
    {
    cb(null,true)
    }
    else{
    cb(null,false)
    }
}




const app = express();

app.use(bodyParser.json())
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    next()
})

app.use('/feed',feedRoutes)
app.use('/auth',authRoutes)
app.use((error, req,res,next)=>{
    console.log(error);
    const status= error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message})
})

mongoose.connect(MONGODB_URI)
.then(result=>{
   const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection',socket=>{
        console.log('Client')
    })
})
.catch(err=>console.log(err))