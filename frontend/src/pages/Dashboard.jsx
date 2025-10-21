import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import DashboardLayout from "../components/DashboardLayout"
import { dashboardStyles as styles } from "../assets/dummystyle"
import { LucideFilePlus } from "lucide-react"
import axiosInstance from "../utils/axiosInstance"
import { API_PATHS } from "../utils/apiPath"
import { ResumeSummaryCard } from "../components/ResumeSummary"
import {toast} from 'react-hot-toast'
import moment from 'moment'
import { Model } from "mongoose"

const Dashboard=()=>{

  const navigate=useNavigate()
  const [openCreatedModal,setOpenCreatedModal]=useState(false)
  const [allResumes,setAllResumes] =useState([])
  const [loading,setLoading] =useState(true)
  const [resumeToDelete,setResumeToDelete]=useState(null)
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false)
  
    // Calculate completion percentage for a resume
  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach(exp => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach(edu => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach(skill => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach(project => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach(cert => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach(lang => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += (resume.interests?.length || 0);
    completedFields += (resume.interests?.filter(i => i?.trim() !== "")?.length || 0);

    return Math.round((completedFields / totalFields) * 100);
  }

  const fetchAllResumes=async()=>{
    try{
      setLoading(true)
      const response=await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
      const resumesWithComplication=response.data.map(resume=>({
        ...resume,
        completion:calculateCompletion(resume)
      }))
      setAllResumes(resumesWithComplication)
    }catch(error){
      console.error('获取简历出错',error)
    }finally{
      setLoading(false)
    }
    
  }
  useEffect(()=>{
      fetchAllResumes()
    },[])

  const handleDeleteResume=async()=>{
    if(!resumeToDelete) return
    try{
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete))
      toast.success('删除简历成功')
      fetchAllResumes()
    }catch(error){
      console.error('删除简历出错',error)
      toast.error('删除简历失败')
    }finally{
      setResumeToDelete(null)
      setShowDeleteConfirm(false)
    }
  }
  return(
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>我的简历</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length>0?`一共${allResumes.length}份简历`:'开始创建简历'}
            </p>
          </div>
          <div className='flex gap-4'>
            <button className={styles.createButton}
            onClick={()=>setOpenCreatedModal(true)}>
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                现在开始创建
                <LucideFilePlus className="group-hover:translate-x-1 transition-transform" size={18} />

              </span>
            </button>
          </div>
        </div>
      {/* 加载状态 */}
      {loading&&(
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
        </div>
      )}
      </div>

      {/* 空列表 */}
      {
        !loading&&allResumes.length===0&&(
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus size={32} className='text-violet-600' />
            </div>
            <h3 className={styles.emptyTitle}>还没有简历</h3>
            <p className={styles.emptyText}>
              你还没有任何简历，开始创建简历去最求你的梦想工作吧
            </p>

            <button className={styles.createButton} onClick={()=>setOpenCreatedModal(true)}>
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                创建你的第一个简历
              </span>
            </button>
          </div>
        )
      }

      {
        !loading&&allResumes.length>0&&(
          <div className={styles.grid}>
            <div className={styles.newResumeCard} 
            onClick={()=>setOpenCreatedModal(true)}>
              <div className={styles.newResumeIcon}>
                <LucideFilePlus size={32} className='text-white' />
              </div>
              <h3 className={styles.newResumeTitle}>创建新简历</h3>
              <p className={styles.newResumeText}>
                开始创建你的简历
              </p>
            </div>

            {allResumes.map((resume)=>(
              <ResumeSummaryCard key={resume._id}
              imgUrl={resume.thumbnailLink}
              title={resume.title} createdAt={resume.createdAt} updatedAt={resume.updatedAt}
              onSelect={()=>navigate(`/resume/${resume._id}`)}
              onDelete={()=>handleDeleteResume(resume._id)}
              completion={resume.completion||0}
              isPremium={resume.isPremium}
              isNew={moment().diff(moment(resume.createdAt),'days')<7}
              />
            ))}
          </div>
          
        )
      }
      <Model isOpen={openCreatedModal} hiderHeader maxWidth='max-w-2xl'
      onClose={()=>setOpenCreatedModal(false)}>
        <div className=' p-6'>
          <div className={styles.modalHeader}>
            <h3>创建新简历</h3>
          </div>
        </div>
      </Model>
      {/* 删除 */}
      <Model isOpen={showDeleteConfirm} 
      onClose={()=>setShowDeleteConfirm(false)}
      title='确认删除'
      showActionBtn actionBtnText='Delete' actionBtnClassName='bg-red-600 hover:bg-red-700'
      onActionClick={handleDeleteResume}>
        <div className=" p-4">
          <div className=" text-orange-600" size={24}>
            <LucideFilePlus size={24}/>
          </div>
          <h3 className={styles.deleteTitle}>删除简历？</h3>
          <p className={styles.deleteText}>确认删除简历？删除后不可撤回</p>
        </div>
      </Model>
    </DashboardLayout >
  )
}
export default Dashboard