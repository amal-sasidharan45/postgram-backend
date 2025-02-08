const express=require('express');
const routes=express.Router();
const UserController=require('../controllers/user');
const Auth=require('../middleware/auth')
const ExtractFile=require('../middleware/file');


routes.post('/signup',UserController.Signup)
routes.post('/login',UserController.Login)
routes.get('/profile',Auth,UserController.getUserProfile)
routes.put('/updateProfile',Auth,ExtractFile,UserController.saveUpdateUserProfile)

module.exports=routes