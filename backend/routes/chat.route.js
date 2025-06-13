import express from 'express'
import {authuser} from '../middleware/middiware.js'
import {getStreamtoken} from '../controllers/chat.controller.js'

const router=express.Router();

router.get('/token',authuser,getStreamtoken)

export default router