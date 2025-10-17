import fs  from "fs"
import path from "path"
import Resume from "../models/resumeModel.js"
import upload from "../middleware/uploadMiddleware.js"
import { error } from "console"


export const uploadResumeImages=async (req,res)=>{
  try{
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "profileImage", maxCount: 1 }  //接收文件
    ])
    (req,res,async(err)=>{
      if(err){
        return res.status(400).json({
          message:"文件上传失败",
          error:err.message
        })
      }
      const resumeId=req.params.id
      const resume=await Resume.findOne({_id:resumeId,userId:req.user._id})
      if(!resume){
        return res.status(404).json({message:"未找到该简历或者未登录"})           //权限验证
      }

      const uploadsFolder=path.join(process.cwd(),"uploads")  //获取服务器上uploads文件夹的绝对路径
      const baseUrl=`${req.protocol}://${req.get("host")}`    //生成完整的访问url文件链接

      const newThumbnail=req.files.thumbnail?.[0]           //从multer解析出文件信息，获取新上传的略缩图文件
      const newProfileImage=req.files.profileImage?.[0]

      if(newThumbnail){
        //处理旧文件
        if(resume.thumbnailLink){   
          const oldThumbnail=path.join(uploadsFolder,path.basename(resume.thumbnailLink))
          if(fs.existsSync(oldThumbnail)){
            fs.unlinkSync(oldThumbnail)  //删除旧文件
          }
        }
        //更新链接
        resume.thumbnailLink=`${baseUrl}/uploads/${newThumbnail.filename}`
      }

      //头像部分
      if(newProfileImage){
        if(resume.profileInfo.profilePreviewUrl){   
          const oldProfile=path.join(uploadsFolder,path.basename(resume.profileInfo.profilePreviewUrl))
          if(fs.existsSync(oldProfile)){
            fs.unlinkSync(oldProfile)
          }
        }
        resume.profileInfo.profilePreviewUrl=`${baseUrl}/uploads/${newProfileImage.filename}`
      }

      //更新数据库
      await resume.save()
      res.status(200).json({
        message:"图片上传成功",
        //返回新的链接，供前端使用
        thumbnailLink:resume.thumbnailLink,
        profilePreviewUrl:resume.profileInfo.profilePreviewUrl
      })

    })
    
  }catch(error){
    console.error("上传错误")
    res.status(500).json({
      message:"服务器错误",
      error:error.message
    })
  }
}