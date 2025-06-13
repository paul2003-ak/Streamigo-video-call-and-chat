import usermodel from "../models/user.model.js";

export const createuser=async({
    fullname,
    email,
    password,
    profilepic
})=>{
    const user=usermodel.create({
        fullname,
        email,
        password,
        profilepic
    })
    return user;
}