import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken=(userId)=>{
  return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'7d'})
}

//用户注册
export const registerUser=async(req,res)=>{
  try{
    const {name,email,password}=req.body

    //email是否唯一
    const userExist=await userModel.findOne({email})
    if(userExist){
      return res.status(400).json({message:"用户已存在"})
    }
    if(password.length<8){
      return res.status(400).json({success:false,message:"密码长度需为8位以上"})
    }

    const salt=await bcrypt.genSalt(10)
    const hashedpassword=await bcrypt.hash(password,salt)

    //创建用户
    const user=await userModel.create({
      name,
      email,
      password:hashedpassword
    })
    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      token:generateToken(user._id)

    })

  }catch(error){
    res.status(500).json({
      message:'服务器错误',
      error:error.message
    })
  }
}

//用户登录
export const loginUser=async(req,res)=>{
  try{
    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
      return res.status(400).json({message:'邮箱或密码错误'})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({message:`${email,password}邮箱密码错误`})
    }

    res.status(200).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      token:generateToken(user._id)

    })
      
  }catch(error){
    res.status(500).json({
      message:'服务器错误',
      error:error.message
    })
  }
}

//获取用户信息
export const getUser=async(req,res)=>{
  try{
    const user=await userModel.findById(req.user.id).select('-password')
    if(!user){
      return res.status(404).json({message:'该用户不存在'})
    }
    res.json(user)
  }catch(error){
    res.status(500).json({
      message:'服务器错误',
      error:error.message
    })
  }
  
}