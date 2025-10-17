import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'

export const protect=async(req,res,next)=>{
  try{
    let token =req.headers.Authorization ||req.headers.authorization
    console.log(req.headers)
    if(token&&token.startsWith('Bearer')){
      token=token.split(' ')[1]
      const decoded=jwt.verify(token,process.env.JWT_SECRET)
      req.user=await userModel.findById(decoded.id).select('-password')
      next()
    }else{
      res.status(401).json({message:"登录授权：没有找到token"})
    }
  }catch(error){
    res.status(401).json({
      message:"未授权token",
      error:error.message
    })
  }
}
//