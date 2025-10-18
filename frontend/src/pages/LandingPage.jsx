import { useContext, useState } from "react";
import { landingPageStyles } from "../assets/dummystyle"
import { ArrowRight, LayoutTemplate, Menu, X } from 'lucide-react';
import { UserContext } from "../context/AppContext";
import { useNavigate } from "react-router";
import { ProfileInfoCard } from "../components/Cards";
const LandingPage=()=>{
  const {user}=useContext(UserContext)
  const navigate=useNavigate()
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false)
  const [openAuthModal,setOpenAuthModal]=useState(false)
  const [currentPage,setCurrentPage]=useState('login')
  const handleCTA=()=>{
    if(!user){
      setOpenAuthModal(true)
    }else{
      navigate('/dashboard')
    }
  }
  return (
    <div className={landingPageStyles.header}>
      <div className={landingPageStyles.headerContainer}>
        <div className={landingPageStyles.logoContainer}>
          <div className={landingPageStyles.logoIcon}>
            <LayoutTemplate className={landingPageStyles.logoIconInner} />
          </div>
          <span className={landingPageStyles.logoText}>
            超级简历
          </span>
        </div>

        <button className={landingPageStyles.mobileMenuButton}
          onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen?
            <X size={24} className={landingPageStyles.mobileMenuIcon} />:
            <Menu size={24} className={landingPageStyles.mobileMenuIcon}/>
          }
        </button>

        <div className='hidden md:flex items-center'>
          {user ? 
          (<ProfileInfoCard />):
          (<button className={landingPageStyles.desktopAuthButton}
          onClick={()=>setMobileMenuOpen(true)}>
            开始
          </button>)
          }
        </div>
      </div>
      {/* 移动端菜单 */}
      {mobileMenuOpen&&(
        <div className={landingPageStyles.mobileMenu}>
          <div className={landingPageStyles.mobileMenuContainer}>
            {user?(
              <div className={landingPageStyles.mobileUserInfo}>
                <div className={landingPageStyles.mobileUserWelcome}>
                  欢迎回来
                </div>
                <button className={landingPageStyles.mobileDashboardButton}
                onClick={()=>{
                  navigate('/dashboard')
                  setMobileMenuOpen(false)
                }}>
                  去创作
                </button>
              </div>
            ):(
              <button className={landingPageStyles.mobileAuthButton}
              onClick={()=>{
                setOpenAuthModal(true)
                setMobileMenuOpen(false)
              }}>
                开始
              </button>
            )}
          </div>
        </div>
      )}
      {/* 主要内容 */}
      <main className={landingPageStyles.main}>
        <section className={landingPageStyles.heroSection}>
          <div className={landingPageStyles.heroGrid}>

            <div className={landingPageStyles.heroLeft}>
              <div className={landingPageStyles.tagline}>
                专业简历生成器
              </div>
              <h1 className={landingPageStyles.heading}>
                <span className={landingPageStyles.headingText}>
                  技术
                </span>
                <span className={landingPageStyles.headingGradient}>
                  专业
                </span>
                <span className={landingPageStyles.headingText}>
                  简历
                </span>
              </h1>
              <p className={landingPageStyles.description}>
                创建赢得工作的专业设计模板
              </p>
              <div className={landingPageStyles.ctaButton}>
                <button className={landingPageStyles.primaryButton}
                onClick={handleCTA}>
                  <div className={landingPageStyles.primaryButtonContent}>
                    开始创建
                    <ArrowRight className={landingPageStyles.primaryButtonIcon} size={18}/>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
export default LandingPage