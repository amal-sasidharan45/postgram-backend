const bcrypt = require('bcryptjs');
const User=require('../model/user');
const jwt = require('jsonwebtoken');
const UserProfile=require('../model/userProfile');
const Post=require('../model/post')
const Comments=require('../model/comments')



exports.Signup=(req,res,next)=>{
    console.log(req.body);

    User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

    bcrypt.hash(req.body.password,10).then((hash)=>{
        const user=new User({
            email:req.body.email,
            password:hash
        })
        user.save().then(result=>{
            const emailPrefix = req.body.email.split('@')[0];
            const randomNumber = Math.floor(100 + Math.random() * 900); // Generates a random number between 100 and 999
            const profileName = `${emailPrefix}${randomNumber}`
            const userProfile = new UserProfile({
                name: req.body.name || '',
                username : profileName,
                description: req.body.description || '',
                creator: result._id ,
                imagePath:req.body.image || '',

            });
            userProfile.save().then(() => {
               console.log('profile created');
               
            }).catch(err => {
                console.error(err);
                
            });

            
            res.status(201).json({
                message:'Sign-Up Successful',
                user:result
            })

        })
      
        
    }).catch(err=>{
        res.status(500).json({
            message:'Invalid authentication credentials'
        })
    }) 
  });
}
 
exports.getUserProfile=async (req,res,next)=>{
    try{
console.log(req.UserData,'userdata');

    const userProfile=await UserProfile.findOne({creator:req.UserData.userId})
    if(!userProfile){
        return res.status(404).json({message:'User Profile not found'})
    }
    console.log(userProfile);
    
    res.status(200).json(userProfile)
}
catch(err){
}
}

exports.Login=async (req,res,next)=>{
    let USER;
    try{
        const user= await User.findOne({email:req.body.email})
        USER=user;
        if(!user){
            return res.status(401).json({
                message:'Invalid Log In credentials'
            })
        }
        const IsPasswordValid=await bcrypt.compare(req.body.password,user.password)

        if(!IsPasswordValid){
            return res.status(401).json({
                message:'Incorrect password !'
                });

        }
        const token=jwt.sign(
            {email:user.email, userId:user._id},
            process.env.JWT_KEY,
            {expiresIn:'1h'}
        )
        console.log(USER);
        res.status(200).json({
          message:'Login Successful',
            token:token,
            expiresIn:3600,
            userId:USER._id
        })

        
    }catch(err){
        console.log(err);
        
        res.status(500).json({
            message:'Invalid authentication credentials'
        })
    }
}


exports.saveUpdateUserProfile = (req, res, next) => {
    let imagePath = req.body.imagePath;
  
    if (req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + '/images/' + req.file.filename;
    }
    
    const userId = req.UserData.userId;
  
    const userprofile = new UserProfile({
      name: req.body.name,
      username: req.body.username,
      description: req.body.description,
      creator: userId,
      imagePath: imagePath
    });
  
    console.log('update user', userprofile);
  
    UserProfile.findOne({ creator: userId })
      .then(existingProfile => {
        if (!existingProfile) {
          return res.status(404).json({ msg:404 });
        }
  
        // Keep the same profile ID
        userprofile._id = existingProfile._id;
  
        // Update the User Profile
        return UserProfile.updateOne({ creator: userId }, userprofile)
          .then(() => {
            // Update related Posts
            return Post.updateMany(
              { creator: userId },
              { $set: { profilePicture: imagePath, userName: req.body.username } }
            );
          })
          .then(() => {
            // Update related Comments
            return Comments.updateMany(
              { creator: userId },
              { $set: { creatorImg: imagePath, username: req.body.username } }
            );
          })
          .then(() => {
            res.status(200).json({
              message: 'Profile updated '
            });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Something went wrong !' });
          });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong !' });
      });
  };
  







