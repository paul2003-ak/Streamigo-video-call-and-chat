import { upsertStreamUser } from "../db/stream.js";
import usermodel from "../models/user.model.js"
import {createuser} from '../service/user.service.js'


export const registeruser = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        if (!email || !fullname || !password) {
            return res.status(400).json({ message: "All feilds Required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password minimum 6 charecters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const isalreadyexist = await usermodel.findOne({ email });
        if (isalreadyexist) {
            return res.status(400).json({ message: "user already exist" });
        }

        //now create i random index from 1 to 100 for making avatar 
        const idx = Math.floor(Math.random() * 100) + 1;//generate a number b/w 1 to 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const hashpassword = await usermodel.hashpassword(password)
        const newuser = await createuser({
            fullname,
            email,
            password: hashpassword,
            profilepic: randomAvatar
        })

        //create stream user
        try{
            await upsertStreamUser({
                id:newuser._id.toString(),
                name:newuser.fullname,
                image:newuser.profilepic || "",
            });
            console.log(`stream user created ${newuser.fullname}`)
        }catch(error){
            console.log('error creates in stream user',error);
        }

//token part
        const token = newuser.generatetoken()

        res.cookie('token', token, {
            httpOnly: true,     // 🔒 Prevents JS access via document.cookie
            secure: false,       // 🔐 Sends cookie over HTTP only when it deploy the it goes in HTTPS then it becomes true
            sameSite: 'strict', // 🚫 Blocks cross-site cookie sending (CSRF protection)
            maxAge: 7*24 * 60 * 60 * 1000, // ⏳ 24 hrs 60 min 60 sec 1000 milisecond
        })
        res.status(200).json({newuser,token})
    } catch (error) {
        res.status(500).json({ message: `sign up error ${error}` })
    }
}

//login
export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All feilds Required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password minimum 6 charecters" });
        }

        const user=await usermodel.findOne({email});
        if(!user){
            return res.status(400).json({ message: "incorect email or password" });
        }

        const ismatch=await user.comparepassword(password);
        if(!ismatch){
            return res.status(400).json({ message: "incoorect email or password" });
        }

        const token=await user.generatetoken()
        res.cookie('token', token, {
            httpOnly: true,     // 🔒 Prevents JS access via document.cookie
            secure: false,       // 🔐 Sends cookie over HTTP only when it deploy the it goes in HTTPS then it becomes true
            sameSite: 'strict', // 🚫 Blocks cross-site cookie sending (CSRF protection)
            maxAge: 7*24 * 60 * 60 * 1000, // ⏳ 24 hrs 60 min 60 sec 1000 milisecond
        })
        res.status(200).json({message:"login successfully", user,token})

    }catch(error){
        res.status(500).json({ message: `sign in error ${error}` })
    }
}

//logout
export const logout=async(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message:"successfully logout"});
}


//onboard
export const onboard=async(req,res)=>{
    try{
        const user=req.user

        const {fullname,bio,native_language,learning_language,location}=req.body;

        if(!fullname || !bio || !native_language || !learning_language || !location){
            return res.status(400).json({message:"All feilds are required",
                missingFeilds:[
                    !fullname && "fullname",
                    !bio && "bio",
                    !native_language && "native_language",
                    !learning_language && "learning_language",
                    !location && "location",
                ].filter(Boolean)//it word only give true values
            });   
        }

        const updateuser=await usermodel.findByIdAndUpdate(user._id,{
            fullname,
            bio,
            native_language,
            learning_language,
            location,
            isonboarded:true
        },{new:true})

        if(!updateuser){
            return res.status(404).json({message:"user not found"});
        }

        //stream upsert part
        try{
            await upsertStreamUser({
                id:updateuser._id.toString(),
                name:updateuser.fullname,
                image:updateuser.profilepic || "",
            });
            console.log(`stream user created ${updateuser.fullname}`)
        }catch(error){
            console.log('error creates in stream user',error);
        }


        return res.status(200).json({message:"user updated",updateuser});

    }catch(error){
        return res.status(500).json({message:"Internal Server error",error});
    }
}
