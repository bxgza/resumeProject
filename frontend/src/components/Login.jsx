import { API_PATHS } from "../utils/apiPath"
import axiosInstance from "../utils/axiosInstance"
import { validateEmail } from "../utils/helper"
import { authStyles as styles } from "../assets/dummystyle"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { UserContext } from "../context/AppContext"
import { Input } from "./input"
const Login=({setCurrentPage})=>{
  
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  const [error,setError]=useState(null)
  const {updateUser}=useContext(UserContext)
  const navigate=useNavigate() 

  const handleLogin=async(e)=>{
    e.preventDefault()

    if(!validateEmail(email)){
      setError('请输入正确的邮箱地址')
      return
    }
    if(!password){
      setError('请输入密码')
      return
    }
    setError('')
    try{
      const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{email,password})
      const {token} =response.data
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
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>欢迎回来</h3>
        <p className={styles.subtitle}>
          登录去创建简历
        </p>
      </div>
    <form className={styles.signupForm}
      onSubmit={handleLogin}>
        
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
      <button className={styles.submitButton} type="submit">
        登录
      </button>
    </form>
      <p className={styles.switchText}>
        还没有账号？{' '}
        <button type="button" className={styles.switchButton}
        onClick={()=>setCurrentPage('signUp')}>
          去注册
        </button>
      </p>  
    
      
      
    </div>
  )
}
export default Login