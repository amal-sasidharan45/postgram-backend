const mongoose=require('mongoose')

const UserProfile=mongoose.Schema({
    name:{type:String,required:false},
    username:{type:String,required:true},
    description:{
        type:String,
        required:false
    },
   creator: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true,
     },
     imagePath:{type:String,required:false}
     

})
module.exports=mongoose.model('UserProfile',UserProfile)