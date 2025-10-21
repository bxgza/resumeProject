import { useContext, useState } from "react"
import { authStyles as styles } from "../assets/dummystyle"
import { UserContext } from "../context/AppContext"
import {useNavigate} from 'react-router'
import { validateEmail } from "../utils/helper"
import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPath"
import { Input } from "./input"
const SignUp=({setCurrentPage})=>{
  const [fullName,setFullName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  const [error,setError]=useState(null)
  const {updateUser}=useContext(UserContext)
  const navigate=useNavigate()

  const handleSignUp=async (e)=>{
    e.preventDefault()
    if(!fullName){
      setError('请填入姓名')
      return
    }
    if(!validateEmail(email)){
      setError('请输入正确邮箱地址')
      return
    }
    if(!password){
      setError('请输入密码')
      return
    }
    setError('')
    try{
      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullName,email,password
      })
      const {token}=response.data
      
      if(token){
        localStorage.setItem('token',token)
        updateUser(response.data)
        navigate('/dashboard')
      }
    }catch(error){
      setError(error.response.data.message||'出错了，请重试')
    }
  }
  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>创建账号</h3>
        <p className={styles.signupSubtitle}>Join thousands of professionals today</p>
      </div>
      <form className={styles.signupForm}
      onSubmit={handleSignUp}>
        <Input value={fullName} onChange={({target})=>setFullName(target.value)}
        placeholder='输入姓名'
        label='用户名'
        type="text"/>
        <Input value={email} onChange={({target})=>setEmail(target.value)}
        placeholder='输入邮箱地址'
        label='邮箱'
        type="text"/>
        <Input value={password} onChange={({target})=>setPassword(target.value)}
        placeholder='输入密码'
        label='密码'
        type="password"/>
        {error &&(
          <div className={styles.errorMessage}>{error}</div>
        )}
      <button className={styles.signupSubmit} type="submit">
        注册
      </button>

      </form>
      

      <p className={styles.switchText}>
        已经有账号了？{' '}
        <button className={styles.signupSwitchButton}
        onClick={()=>setCurrentPage('login')}>
          去登录
        </button>
      </p>
    </div>
  )
}
export default SignUp