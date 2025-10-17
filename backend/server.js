import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import userRoute from './routes/userRoutes.js'
import path from 'path'
import  {fileURLToPath} from 'url'
import resumeRouter from './routes/resumeRoutes.js'

const _filename=fileURLToPath(import.meta.url)
const _dirname=path.dirname(_filename)

const app=express()
const PORT=5000

app.use(cors())


//连接数据库
connectDB()

//middleware中间件
app.use(express.json())
app.use("/api/auth",userRoute)
app.use("/api/resume",resumeRouter)
app.use("/uploads",
  express.static(path.join(_dirname,'uploads'),{
    setHeaders:(res,_path)=>{
      res.set('Access-Control-Allow-Origin','http://localhost:5173')
    }
  })
)

//route
app.get('/',(req,res)=>{
  res.send('API WORKING')
})

app.listen(PORT,()=>{
  console.log(`Server start on http://localhost:${PORT}`)
})
