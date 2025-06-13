import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userschema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    bio:{
        type:String,
        default:"",
    },
    profilepic:{
        type:String,
        default:"",
    },
    native_language:{
        type:String,
       default:"",
    },
    learning_language:{
        type:String,
       default:"",
    },
    location:{
        type:String,
        default:"",
    },
    isonboarded:{
        type:Boolean,
        default:false,
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }]
},{timestamps:true})


userschema.statics.hashpassword=async function(password){
    return await bcrypt.hash(password,10);
}
userschema.methods.generatetoken= function(){
    const token=jwt.sign({_id:this._id},process.env.SECRET_KEY,{expiresIn:"7d"});
    return token;
}
userschema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const usermodel=mongoose.model('User',userschema);
export default usermodel