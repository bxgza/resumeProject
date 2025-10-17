import Resume from '../models/resumeModel.js'
import fs from 'fs'
import path from 'path'

export const createResume=async(req,res)=>{
  try{
    const {title}=req.body

    const defaultResumeData = {
      profileInfo: {
          profileImg: null,
          previewUrl: '',
          fullName: '',
          designation: '',
          summary: '',
      },
      contactInfo: {
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          website: '',
      },
      workExperience: [
          {
              company: '',
              role: '',
              startDate: '',
              endDate: '',
              description: '',
          },
      ],
      education: [
          {
              degree: '',
              institution: '',
              startDate: '',
              endDate: '',
          },
      ],
      skills: [
          {
              name: '',
              progress: 0,
          },
      ],
      projects: [
          {
              title: '',
              description: '',
              github: '',
              liveDemo: '',
          },
      ],
      certifications: [
          {
              title: '',
              issuer: '',
              year: '',
          },
      ],
      languages: [
          {
              name: '',
              progress: '',
          },
      ],
      interests: [''],
  };
  const newResume=await Resume.create({
    userId:req.user._id,
    title,
    ...defaultResumeData,
    ...req.body
  })
  res.status(201).json(newResume)

  }catch(error){
    res.status(500).json({
      message:"新建简历失败",
      error:error.message
    })
  }
}

export const getUserResumes=async (req,res)=>{
  try{
    const resumes=await Resume.find({userId:req.user._id}).sort({
      updateAt:-1
    })
    res.status(200).json(resumes)
  }catch(error){
    res.status(500).json({
      message:"获取简历失败",
      error:error.message
    })
  }
}

export const getResumeById=async (req,res)=>{
  try{
    const resume=await Resume.findOne({_id:req.params.id,userId:req.user._id})
    if(!resume){
      return res.status(404).json({message:"找不到该简历"})
    }
    res.status(200).json(resume)
  }catch(error){
    res.status(500).json(
      {
      message:"获取简历失败",
      error:error.message
    }
    )
  }
}

//更改简历
export const updateResume=async(req,res)=>{
  try{
    const resume=await Resume.findOne({_id:req.params.id,userId:req.user._id})
    if(!resume){
      return res.status(404).json({message:"找不到该简历或未登录"})
    }
//改的方法太简单了，只是浅拷贝，后续需要修改
    Object.assign(resume,req.body)
    const saveResume=await resume.save()
    res.json(saveResume)
  }catch(error){
    res.status(500).json(
      {
      message:"修改简历失败",
      error:error.message
    }
    )
  }
}

//删除简历
export const deleteResume=async (req,res)=>{
  try{
    const resume=await Resume.findOne({_id:req.params.id,userId:req.user._id})
    if(!resume){
      return res.status(404).json({message:"找不到该简历或未登录"})
    }

    //删除简历图像

    //确定文件存储路径
    const uploadsFolder = path.join(process.cwd(), 'uploads');
    // 如果简历之前有缩略图
    if (resume.thumbnailLink) {
        // 拼接出旧缩略图在服务器上的完整路径
        const oldThumbnail = path.join(uploadsFolder, resume.thumbnailLink);
        
        // 检查该文件是否存在，如果存在就删除
        if (fs.existsSync(oldThumbnail)) {
            fs.unlinkSync(oldThumbnail);
        }
    }
    // 如果简历之前设置了个人头像
    if (resume.profileInfo?.profilePreviewUrl) {
        // 拼接出旧头像在服务器上的完整路径
        const oldProfile = path.join(uploadsFolder, resume.profileInfo.profilePreviewUrl);
        
        // 检查并删除
        if (fs.existsSync(oldProfile)) {
            fs.unlinkSync(oldProfile);
        }
    }

    await Resume.findByIdAndDelete({_id:req.params.id,userId:req.user._id})
    if(!resume){
      return res.status(404).json({message:"找不到该简历或未登录"})
    }
    res.json({message:"简历删除成功"})
  }catch(error){
    res.status(500).json(
      {
      message:"删除简历失败",
      error:error.message
    }
    )
  }
}