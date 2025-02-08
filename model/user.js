const mongoose=require('mongoose');
const Unique=require('mongoose-unique-validator')

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
        },
});
userSchema.plugin(Unique);
module.exports=mongoose.model('User',userSchema)
