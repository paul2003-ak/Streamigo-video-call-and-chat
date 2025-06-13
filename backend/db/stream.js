import {StreamChat} from 'stream-chat'
import dotenv from 'dotenv'
dotenv.config()

const apikey=process.env.STREAM_API_KEY;
const apisecret=process.env.STREAM_API_SECRET;

if(!apikey || !apisecret){ 
    console.error("strea, api key or secret is missing")
}

const streamclint=StreamChat.getInstance(apikey,apisecret,{ timeout: 10000 });

export const upsertStreamUser=async(userdata)=>{
    try{
        await streamclint.upsertUsers([userdata]);
        return userdata;
    }catch(error){
        console.error("error creating stream usser",error);
    }
};

export const generateStreamToken=async(userid)=>{
    try{
         const useridstring=userid.toString();
         return streamclint.createToken(useridstring)
    }catch(error){
        console.log("error in token generate string ",error);
    }
}