import mongoose from "mongoose"

export const connectDB=async()=>{
  try{
    await mongoose.connect('mongodb+srv://wshsykbxs_db_user:resume123@cluster0.zvnf96o.mongodb.net/RESUME')
    console.log('Database connected')
  }catch(error){
    console.log('Connected failed',error)
    process.exit(1)
  }
  
  
}