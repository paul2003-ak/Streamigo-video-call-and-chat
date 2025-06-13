import { generateStreamToken } from "../db/stream.js";


export const getStreamtoken=async(req,res)=>{
    try{
        const token=await generateStreamToken(req.user._id);
        res.status(200).json({token})
    }catch(error){
        console.log("error is in getStreamtoken",error.message);
        res.status(500).json("internal server error..")
    }
}