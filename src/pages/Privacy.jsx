import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useApp } from '../context/AppContext'
import styles from './Privacy.module.css'

export default function Privacy() {
  const navigate = useNavigate()
  const { setUserMode } = useApp()
  const img1Ref = useRef(null)
  const arrowRef = useRef(null)
  const img2Ref = useRef(null)
  const textRef = useRef(null)
  const btn1Ref = useRef(null)
  const btn2Ref = useRef(null)

  useEffect(() => {
    // 确保元素初始可见
    gsap.set([img1Ref.current, arrowRef.current, img2Ref.current, textRef.current, btn1Ref.current, btn2Ref.current], {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1
    })

    const tl = gsap.timeline()
    tl.from(img1Ref.current, {
      x: -30,
      opacity: 0.5,
      duration: 0.5,
      ease: 'power2.out'
    })
    .from(arrowRef.current, {
      scale: 0.5,
      opacity: 0.5,
      duration: 0.3,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    .from(img2Ref.current, {
      x: 30,
      opacity: 0.5,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    .from(textRef.current, {
      y: 20,
      opacity: 0.5,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3')
    .from([btn1Ref.current, btn2Ref.current], {
      y: 20,
      opacity: 0.5,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.2')

    return () => { tl.kill() }
  }, [])

  const handleAgree = () => {
    setUserMode('ai')
    navigate('/input')
  }

  const handleSafe = () => {
    setUserMode('safe')
    navigate('/input')
  }

  return (
    <div className={`page-container ${styles.privacyPage}`}>
      <div className={styles.container}>
        {/* 左侧漫画图示 */}
        <div className={styles.comicSection}>
          <div ref={img1Ref} className={styles.comicPanel}>
            <img src="/assets/自拍.png" alt="用户自拍" className={styles.comicImg} />
            <p className={styles.comicCaption}>用户自拍</p>
          </div>

          <div ref={arrowRef} className={styles.arrowBox}>
            <img src="/assets/箭头.png" alt="箭头" className={styles.arrowImg} />
          </div>

          <div ref={img2Ref} className={styles.comicPanel}>
            <img src="/assets/ai分析.png" alt="AI分析" className={styles.comicImg} />
            <p className={styles.comicCaption}>本地AI分析</p>
            <span className={styles.localTag}>不上传云端</span>
          </div>
        </div>

        {/* 右侧文字说明 */}
        <div ref={textRef} className={styles.textSection}>
          <h2 className={styles.title}>隐私保护承诺</h2>
          <p className={styles.desc}>
            我们所有分析都在本地完成，保护你的隐私安全。
          </p>
          <p className={styles.detail}>
            你的照片不会被上传到任何服务器，AI分析过程完全在浏览器本地运行。
            我们重视每一位用户的隐私，让你安心体验智能匹配服务。
          </p>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className={styles.btnGroup}>
        <button
          ref={btn1Ref}
          className={`pop-btn pink ${styles.actionBtn}`}
          onClick={handleAgree}
        >
          📷 同意并上传
        </button>
        <button
          ref={btn2Ref}
          className={`pop-btn ${styles.actionBtn}`}
          onClick={handleSafe}
        >
          🛡️ 文字匹配
        </button>
      </div>
    </div>
  )
}
