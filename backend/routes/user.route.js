import  express from 'express'

const router=express.Router()
import {registeruser,login,logout,onboard,} from '../controllers/user.controller.js'
import {authuser} from '../middleware/middiware.js'

router.post('/signup',registeruser)
router.post('/signin',login)
router.post('/logout',logout)

router.post('/onboarding',authuser,onboard)

router.get('/profile',authuser,(req,res)=>{
    res.status(200).json({user:req.user});
});

export default router