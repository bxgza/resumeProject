import { X } from 'lucide-react'
import {modalStyles } from '../assets/dummystyle.js'
const Modal=({children,title,hideHeader,onClose,isOpen,
  showActionBtn,actionBtnIcon=null,actionBtnText,onActionClick=()=>{}
})=>{
  if(!isOpen){
      return null
    }
  return (
    
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        {!hideHeader&&(
          <div className={modalStyles.header}>
            <h3 className={modalStyles.title}>{title}</h3>

            {showActionBtn&&(
              <button className={modalStyles.actionButton}
              onClick={onActionClick}>
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>

         
        )}
        <button className={modalStyles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
        <div className={modalStyles.body}>{children}</div>
      </div>
    </div>
  )
}
export default Modal