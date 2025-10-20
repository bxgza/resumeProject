import { useState } from "react";
import { inputStyles } from "../assets/dummystyle";
import {EyeOff,Eye} from 'lucide-react'
export const Input=({value,onChange,placeholder,label,type='text'})=>{
  const style=inputStyles
  const [showPassword,setShowPassword]=useState(false)
  const [isFocused,setIsFocused]=useState(false)
  return (
    <div className={style.wrapper}>
      <label className={style.label}>{label}</label>
      <div className={style.inputContainer(isFocused)}>
        <input type={type==='password'?(showPassword?'text':'password'):type} 
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        onFocus={()=>setIsFocused(true)}
        onBlur={()=>setIsFocused(false)}
        />
        {
          type==='password'&&(
            <button onClick={()=>setShowPassword(!showPassword)}
            className={style.toggleButton}>
              {showPassword?<EyeOff size={20}/>:<Eye size={20}/>}
            </button>
          )
        }
      </div>
    </div>
  )


}