const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const userRoutes=require('./routes/user')
const PostRoutes=require('./routes/post');
const bodyParser = require('body-parser');
mongoose.connect("mongodb+srv://amalsasidharan387:" +  process.env.MONGO_ATLAS_PW + "@cluster0.5caef.mongodb.net/postgram?retryWrites=true&w=majority&appName=Cluster0",
    {
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000, 
      }
)
.then(()=>console.log('connetced to database')).catch((err)=>console.log('Database connection error',err));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization")
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    )
    next()
})

  
app.use('/api/Users',userRoutes)
app.use('/api/Posts',PostRoutes)

module.exports=app

