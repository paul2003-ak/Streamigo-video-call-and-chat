
import FriendRequest from "../models/friendrequest.model.js";
import usermodel from "../models/user.model.js";


export const getrecomendedfriend=async(req,res)=>{
 try{
    const curruserid=req.user._id;
    const curruser= req.user;

    const recomendedusers=await usermodel.find({
        $and:[
            {_id: {$ne: curruserid}},//exclude current user
            {_id: {$nin : curruser.friends}},//exclides current user's friends
            {isonboarded:true}
        ]
    })
    res.status(200).json(recomendedusers)
 }catch(error){
    console.log("error in getrecomendedfriend",error.message);
    res.status(500).json({message:"internal server error"})
 }
}

export const  myfriends=async(req,res)=>{
    try{
        const user=await usermodel.findById(req.user._id)
        .select("friends")
        .populate("friends","fullname profilepic native_language learning_language")//always remember when i have
                                                                                    //a array id & i want to populate them
                                                                                    //use populate
        res.status(200).json(user.friends)                                                                    

    }catch(error){
        console.log("error in myfriends",error.message);
        res.status(500).json({message:"internal server error"})
    }
}

export const sendfriendrequest=async(req,res)=>{
    try{
        const myId=req.user._id;
        const {id:recipientId }=req.params

        //prevent sending request to yourself
        if(myId === recipientId){
         return res.status(400).json({message:"you can not send friend request to yourself"})
        }

        //check recipient exist or not 
        const recipient=await usermodel.findById(recipientId)
        if(!recipient){
            return res.status(404).json({message:"recipient  not found"})
        }

        //already friends or not 
        if(recipient.friends.includes(myId)){
            return res.status(404).json({message:"you are already friend"})
        }

        //check if a request already exists
        const existingreq= await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ],
        })

        if(existingreq){
            return res.status(404).json({message:"you already send friend request"})
        }

        const friendrequest=await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        })

        res.status(201).json(friendrequest);
    }catch(error){
        console.log("error in sendfriendrequest part ",error.message);
        return res.status(500).json({message:"Internal server error"})
    }
}

//i send anyone friend request and he accept 
export const acceptfriendrequest=async(req,res)=>{
    try{
        const {id:requestid} =req.params;

        const friendrequest=await FriendRequest.findById(requestid);
        if(!friendrequest){
            return res.status(404).json({message:"friend request not found"});
        }

        //verify the current user is the recipient
        if(friendrequest.recipient.toString()!==req.user._id.toString()){
            return res.status(403).json({message:"you are not authorize to accept this request"});
        }

        friendrequest.status="accepted"
        await friendrequest.save()


        //add each user to the other's friends array 
        await usermodel.findByIdAndUpdate(friendrequest.sender,{
            $addToSet:{friends: friendrequest.recipient}
        });

        await usermodel.findByIdAndUpdate(friendrequest.recipient,{
            $addToSet:{friends:friendrequest.sender}
        })

        return res.status(200).json({message:"friend request accepted"});
    }catch(error){
        console.log("error in acceptfriendrequest",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}


//those friend requst is comming to me 
export const getfriendrequest=async(req,res)=>{
    try{
        const incomingrequest=await FriendRequest.find({
            recipient:req.user._id,
            status :"pending"
        }).populate("sender","profilepic fullname native_language learning_language");

        const acceptedrequest=await FriendRequest.find({
            sender:req.user._id,
             status:"accepted",
        }).populate("recipient","profilepic fullname")
            //find in whole data base of friends.model in mongodb
            //Let’s say you’re logged in as user _id: "123".
            //{
            //"sender": "123",  // You
            //"recipient": "456",  // Another user
            //"status": "accepted"
            //}
        res.status(200).json({incomingrequest,acceptedrequest});
    }catch(error){
        console.log("error in incomingrequest,acceptedrequest ",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
 }

 //those  i already send a friend request 
export const getoutgoingfriendrequest=async(req,res)=>{
    try{
        const outgoingrequest=await FriendRequest.find({
            sender:req.user._id,
            status:"pending",
        }).populate("recipient","profilepic fullname native_language learning_language ");
        
        res.status(200).json(outgoingrequest);
    }catch(error){
        console.log("error in getoutgoingfriendrequest ",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
 }