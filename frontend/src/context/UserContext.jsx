import {  useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { UserContext } from "./AppContext";


  
export default function UserProvider({children}){
  const [user,setUser]=useState(null)
  const [loading,setLoading]=useState(true)
  
  useEffect(()=>{
    if(user) return   
    const accessToken=localStorage.getItem('token')
    if(!accessToken){
      setLoading(false)
      return
    }
    const fetchUser=async()=>{
      try{
        const response=await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
        setUser(response.data)
      }catch(error){
        console.error("用户未进行身份验证",error)
        clearUser()
      }finally{
        setLoading(false)
      }
    }
    fetchUser()
  },[user])

  const updateUser=(userData)=>{
    setUser(userData)
    localStorage.setItem('token',userData.token)
    setLoading(false)
    
  }

  const clearUser=()=>{
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <UserContext.Provider value={{user,loading,updateUser,clearUser}}>
      {children}
    </UserContext.Provider>
  )
}
