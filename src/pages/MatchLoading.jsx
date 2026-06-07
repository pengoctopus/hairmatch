import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import styles from './MatchLoading.module.css'

const steps = [
  '分析本地特征...',
  '检索社区评价...',
  '筛选擅长发型师...',
]

export default function MatchLoading() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const scissorsRef = useRef(null)
  const star1Ref = useRef(null)
  const star2Ref = useRef(null)
  const star3Ref = useRef(null)

  useEffect(() => {
    // 确保初始可见
    gsap.set([scissorsRef.current, star1Ref.current, star2Ref.current, star3Ref.current], {
      opacity: 1, scale: 1
    })

    // 剪刀旋转动画
    const tweens = []
    tweens.push(gsap.to(scissorsRef.current, {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'none'
    }))

    // 星星环绕动画
    const stars = [star1Ref.current, star2Ref.current, star3Ref.current]
    stars.forEach((star, i) => {
      if (star) {
        tweens.push(gsap.to(star, {
          rotation: 360,
          duration: 4 + i,
          repeat: -1,
          ease: 'none',
          transformOrigin: `${60 + i * 30}px center`
        }))
      }
    })

    // 进度条
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => {
      clearInterval(interval)
      tweens.forEach(t => t.kill())
    }
  }, [])

  useEffect(() => {
    if (progress < 33) setCurrentStep(0)
    else if (progress < 66) setCurrentStep(1)
    else if (progress < 100) setCurrentStep(2)

    if (progress >= 100) {
      // 咔嚓动画后跳转
      const snapTween = gsap.to(scissorsRef.current, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          snapTween.kill()
          setTimeout(() => navigate('/result'), 500)
        }
      })
    }
  }, [progress, navigate])

  return (
    <div className={styles.loadingPage}>
      <div className={styles.bgPattern} />

      <div className={styles.content}>
        {/* 剪刀和星星 */}
        <div className={styles.scissorsWrap}>
          <img
            ref={scissorsRef}
            src="/assets/剪刀.png"
            alt="剪刀"
            className={styles.scissors}
          />
          <img ref={star1Ref} src="/assets/star.png" alt="" className={`${styles.orbitStar} ${styles.star1}`} />
          <img ref={star2Ref} src="/assets/star.png" alt="" className={`${styles.orbitStar} ${styles.star2}`} />
          <img ref={star3Ref} src="/assets/star.png" alt="" className={`${styles.orbitStar} ${styles.star3}`} />
        </div>

        <h2 className={styles.title}>正在匹配懂你的发型师...</h2>

        {/* 进度条 */}
        <div className={styles.progressBox}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressText}>{progress}%</p>
        </div>

        {/* 步骤文字 */}
        <div className={styles.steps}>
          {steps.map((step, idx) => (
            <span
              key={idx}
              className={`${styles.step} ${idx === currentStep ? styles.stepActive : ''} ${idx < currentStep ? styles.stepDone : ''}`}
            >
              {idx < currentStep ? '✓ ' : ''}{step}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
