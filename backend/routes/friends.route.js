import express from 'express' 
const router=express.Router()
import {authuser} from '../middleware/middiware.js' 
import {getrecomendedfriend,myfriends,sendfriendrequest,acceptfriendrequest,getfriendrequest,getoutgoingfriendrequest} from '../controllers/friend.controller.js' 

router.get('/recomemdedusers',authuser,getrecomendedfriend)
router.get('/friends',authuser,myfriends)
router.post('/friendrequest/:id',authuser,sendfriendrequest )

router.put('/friendrequest/:id/accept',authuser,acceptfriendrequest )

router.get("/getfreindrequest",authuser,getfriendrequest)
 router.get("/outgoing-friend-request",authuser,getoutgoingfriendrequest)

 export default router



