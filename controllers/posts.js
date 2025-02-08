const Post=require('../model/post')
const userProfile=require('../model/userProfile')
const Comment=require('../model/comments')

exports.CreatePost= async (req,res,next)=>{
try{


            console.log(req.file);
            
   
    const url=req.protocol +'://' + req.get("host");
    console.log(url + '/images/' + req.file.filename);
    const Userprofile= await userProfile.findOne({creator:req.UserData.userId})
    if (Userprofile) {
        console.log(Userprofile, 'userP');
      } else {
        console.log('User profile not found');
      }
      
    const DateTime=new Date()

    const post=new Post({
        caption:req.body.caption,
        imagePath:url + '/images/' + req.file.filename,
        creator:req.UserData.userId,
        userName:Userprofile.username,
        profilePicture:Userprofile.imagePath,
        TimeDayWeek:DateTime.toString(),
        likes:[]
    })
        // console.log(post);
    
    post.save().then((resp)=>{
        console.log(resp);
        
        res.status(201).json({
            message:'Post Created',
            
            post:{
                ...resp,
                id:resp._id

            }
        })
    })
}
catch(err){
    console.log(err);
    res.status(500).json({
        message:'Internal Server Error',
        error:err
        })
}
}
exports.getAllPosts=(req,res,next)=>{
    Post.find().then((resp)=>{
        res.status(200).json({
            msg:'Data fetched successfully',
            posts:resp
        })
    }).catch((error)=>{
        res.status(500).json({
            message:'Failed to fetch data'
            })

    })
}
exports.getImageForProfile = (req, res, next) => {
    console.log(req.UserData, 'User Data for posts');
  
    Post.find({ creator: req.UserData.userId }) 
      .then((posts) => {
        if (!posts.length) {
          return res.json({
            // msg: 'No posts found for the creator',
            posts:[]
          });
        }
        res.status(200).json({
          msg: 'Data fetched successfully',
          posts: posts,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Failed to fetch data',
          error: error.message,
        });
      });
  };


  exports.UpdatePost=(req,res,next)=>{
    let imagePath=req.body.imagePath;

    if(req.file){
      const url=req.protocol +'://' + req.get("host")
      imagePath = url + '/images/' + req.file.filename;
    }
    const post=new Post({
      _id:req.params.id,
      caption:req.body.caption,
      imagePath:imagePath,
      creator:req.UserData.userId,
      userName:req.body.name,
      profilePicture:req.body.imagePath,
      TimeDayWeek:req.body.TimeDayWeek,
      likes:req.body.likes
  })

  console.log(post,'post');
  Post.updateOne({_id:req.params.id,creator:req.UserData.userId},post).then((result)=>{
    if(result.matchedCount>0){
      res.status(200).json({
        message:'Post updated ',
        post:result
      })
    }else{
      res.status(404).json({
        message:'Unauthorised !'
        })
    }
  }).catch((err)=>{
    res.status(500).json({
      message:'Something went wrong ! ',
      error:err.message
      })
  })
  
  }
  exports.updateLike = (req, res) => {
    console.log(req.params);
    console.log(req.body);
    console.log(req.body.likes);
  
    const postId = req.params.id;
    const creator = req.body.creator;
    
    // Ensure likes is a boolean (either 'true' or 'false')
    let isLiked;
    if(req.body.likes==='true'){
       isLiked=true
    }
    else{
       isLiked=false
    }  
    Post.findOne({ _id: postId })
      .then((post) => {
        // Check if the post exists
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
  
        // Check if the creator already exists in the likes array
        const existingLike = post.likes.find((like) => like.creator === creator);
  
        if (existingLike) {
          // If the creator exists, update the like status
          existingLike.isLiked = isLiked;
  
          post.save()
            .then(() => {
              res.status(200).json({ msg: "Like status updated successfully!" });
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        } else {
          // If the creator doesn't exist, add a new like object
          post.likes.push({ creator, isLiked });
  
          post.save()
            .then(() => {
              res.status(200).json({ msg: "Like added successfully!" });
            })
            .catch((err) => {
              res.status(500).json({ error: err });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  

  
  









exports.deletePost=(req,res,next)=>{
  const id=req.params.id
  Post.deleteOne({_id:id,creator:req.UserData.userId}).then((response)=>{
    console.log(response);
    
    res.json({
      message:'Post deleted ',
      post:response
    })
  }).catch((err)=>{
    res.status(500).json({
      message:'Something went wrong !',
      error:err.message
      })
  })
}
  
exports.saveComment= async (req,res,next)=>{
  try{
    console.log(req.body);
    

  let image;
  let Username;
  const Userprofile= await userProfile.findOne({creator:req.UserData.userId})
  if(Userprofile){
    image=Userprofile.imagePath
    Username=Userprofile.username
    }


  const comment=new Comment({
    comment :req.body.comment,
    username:Username,
    postId:req.params.id,
    creator:req.UserData.userId,
    creatorImg:image,
    duration:new Date ()
  })
  console.log(comment);
  
comment.save().then((resp)=>{
  res.status(201).json({
    message:'Commented',
    comment:resp
    })
})
}
catch(err){
  res.status(500).json({
    message:'Something went wrong !',
    error:err.message
    })
}

}

exports.getAllComments=(req,res,next)=>{

  Comment.find({postId:req.params.id}).then((resp)=>{
    console.log(resp);
    
    res.status(200).json({
      // message:'Comments fetched successfully',
      comments:resp
      })
  }).catch((err)=>{
    res.status(500).json({
      // message:'Failed to fetch comments',
      error:err.message
      })
  })
}


exports.deleteComment=(req,res,next)=>{
  const id=req.params.id;
  Comment.deleteOne({_id:id,creator:req.UserData.userId}).then((response)=>{
    res.status(200).json({
      message:'Comment deleted ',
      comment:response
      })
  }).catch((err)=>{
    res.status(500).json({
      message:'Failed to delete comment',
      error:err.message
      })
  })
}