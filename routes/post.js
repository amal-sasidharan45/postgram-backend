const express=require('express');
const PostController=require('../controllers/posts')
const routes=express.Router()
const ExtractFile=require('../middleware/file');
const Auth=require('../middleware/auth')
routes.get('/health', PostController.getHealth);
routes.post('',Auth,ExtractFile,PostController.CreatePost );
routes.get('',PostController.getAllPosts)
routes.get('/profile-image',Auth,PostController.getImageForProfile)
routes.put('/:id',Auth,ExtractFile,PostController.UpdatePost)
routes.delete('/:id',Auth,PostController.deletePost)
routes.post('/:id',Auth,ExtractFile,PostController.saveComment)
routes.get('/:id',Auth,PostController.getAllComments)
routes.delete('/comment/:id',Auth,PostController.deleteComment)
routes.put('/UpdateLike/:id', Auth,ExtractFile,PostController.updateLike)
routes.get('/health',ExtractFile,PostController.getHealth)

module.exports=routes