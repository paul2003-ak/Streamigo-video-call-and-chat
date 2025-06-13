import { axiosIntance } from "./Axios";



export  const getAuthuser=async()=>{
  try{
   const res=await axiosIntance.get("/user/profile");
   return res.data
  }catch(error){
   console.log(error);
   return null 
  }
}



export const signup=async(signupdata)=>{
        const response=await axiosIntance.post("/user/signup",signupdata);
        return response.data
};

export const login=async(logindata)=>{
   const response=await axiosIntance.post("/user/signin",logindata);
   return response.data
};

export const logout=async()=>{
   const response=await axiosIntance.post("/user/logout" );
   return response.data
};


 export const completeOnboarding=async(userdata)=>{
    const response =await axiosIntance.post("/user/onboarding",userdata);
    return response.data;
 }

 export async function getUserfriends() {
   const response = await axiosIntance.get("/friend/friends");
   return response.data;
 }
 
 export async function getRecomendedUsers() {
   const response = await axiosIntance.get("/friend/recomemdedusers");
   return response.data;
 }

 export async function getoutgoingfriendreqs() {
   const response = await axiosIntance.get("/friend/outgoing-friend-request");
   return response.data;
 }

 export async function sendfriendrequest(userId) {
   const response = await axiosIntance.post(`/friend/friendrequest/${userId}`);
   return response.data;
 }

 export async function getfriendrequests(){
  const response = await axiosIntance.get("/friend/getfreindrequest");
   return response.data;
 }

 export async function acceptfriendrequest(requestId){
  const response = await axiosIntance.put(`/friend/friendrequest/${requestId}/accept`);
   return response.data;
 }
 

 export async function getStreamToken(){
  const response = await axiosIntance.get("/chat/token");
   return response.data;
 }
 
 