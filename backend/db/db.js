import mongoose from 'mongoose'

export const connecttodb=async()=>{
    mongoose.connect(process.env.MONGO_URI
    ).then(()=>{
        console.log("db is connected...")
    }).catch(error=>console.log(`mongodb error: ${error}`))
    
}