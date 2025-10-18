import axios from 'axios'
import { BASE_URL } from './apiPath'
const axiosInstance=axios.create({
  baseURL:BASE_URL,
  timeout:10000,
  headers:{
    "Content-Type":"application/json",  //声明发送的数据类型
    Accept:"application/json"    //声明接收的数据类型
  }
})
//请求拦截
axiosInstance.interceptors.request.use(
  (config)=>{
    const accessToken=localStorage.getItem('token')
    if(accessToken){
      config.headers.Authorization=`Bearer ${accessToken}`
    }
    return config
  },
  (error)=>{
    return Promise.reject(error)
  }
)
//响应拦截
axiosInstance.interceptors.response.use(
  (response)=>{
    return response
  },
  (error)=>{
    if(error.response){
      if(error.response.status===401){
        window.location.href='/'
      }else if(error.response.status){
        console.error("服务器错误")
      } 
    }else if(error.code==='ECONNABORTED'){
      console.error('请求超时')
    }
    return Promise.reject(error)
  }
)
export default axiosInstance

