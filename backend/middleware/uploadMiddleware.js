import multer from "multer";

//配置存储规则
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"uploads/")    //文件报存到uploads文件夹
  },
  filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`)   //防止文件命名冲突：文件名=时间戳+原始名
  }
})
//文件类型过滤
const fileFilter=(req,file,cb)=>{
  const allowTypes=["image/jpeg","image/png","image/jpg"]
  if(allowTypes.includes(file.mimetype)){
    cb(null,true)
  }else{
    cb(new Error("只允许上传 .jpeg, .jpg, .png 格式文件"),false)
  }
}

//创建实例
const upload=multer({storage,fileFilter})
export default upload