import express from "express" 
import dotenv  from  'dotenv' 
dotenv.config()

import {connecttodb} from './db/db.js' 
import cookieparser from  'cookie-parser' 

import cors from  'cors' 

import path from  'path' 

const  PORT=process.env.PORT
import userroute from './routes/user.route.js'
import friendroute from './routes/friends.route.js'
import chatroute from './routes/chat.route.js'

const __dirname=path.resolve()

const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser())

app.use(cors({
    origin:" http://localhost:5173",
    credentials:true
}));


app.use('/api/user',userroute)
app.use('/api/friend',friendroute)
app.use('/api/chat',chatroute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("/*splat", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }


app.listen( PORT,()=>{
    connecttodb()
    console.log(`app is running on ${PORT }`)
})