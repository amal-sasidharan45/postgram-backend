const mongoose=require('mongoose');

const commentShema=mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:false
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
        },
        creatorImg:{
            type:String,
            required:false
        }
    
})

module.exports=mongoose.model('comment',commentShema)