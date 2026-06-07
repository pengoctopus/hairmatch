import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const descRef = useRef(null)
  const btn1Ref = useRef(null)
  const btn2Ref = useRef(null)
  const scissorsRef = useRef(null)
  const combRef = useRef(null)
  const starRef = useRef(null)

  useEffect(() => {
    // 确保元素初始可见，动画在此基础上增强
    gsap.set([titleRef.current, subtitleRef.current, descRef.current, btn1Ref.current, btn2Ref.current], {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1
    })

    const tl = gsap.timeline()
    tl.from(titleRef.current, {
      y: 60,
      opacity: 0.5,
      duration: 0.8,
      ease: 'bounce.out'
    })
    .from(subtitleRef.current, {
      y: 20,
      opacity: 0.5,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.4')
    .from(descRef.current, {
      y: 15,
      opacity: 0.5,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3')
    .from([btn1Ref.current, btn2Ref.current], {
      y: 25,
      opacity: 0.5,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.2')

    // 悬挂装饰摆动动画
    const swingTweens = []
    swingTweens.push(gsap.to(scissorsRef.current, {
      rotation: 8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      transformOrigin: 'top center'
    }))
    swingTweens.push(gsap.to(combRef.current, {
      rotation: -6,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      transformOrigin: 'top center'
    }))
    swingTweens.push(gsap.to(starRef.current, {
      rotation: 15,
      scale: 1.1,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      transformOrigin: 'center center'
    }))

    return () => {
      tl.kill()
      swingTweens.forEach(t => t.kill())
    }
  }, [])

  return (
    <div className={styles.homePage}>
      <div className={styles.bgOverlay} />

      {/* 悬挂装饰元素 */}
      <img ref={scissorsRef} src="/assets/剪刀.png" alt="剪刀" className={`${styles.hanging} ${styles.scissors}`} />
      <img ref={combRef} src="/assets/梳子.png" alt="梳子" className={`${styles.hanging} ${styles.comb}`} />
      <img ref={starRef} src="/assets/star.png" alt="星星" className={`${styles.hanging} ${styles.star}`} />

      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.mainTitle}>HairMatch</h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          "找到理想发型不难，难的是找到能剪出它的理发师。"
        </p>
        <p ref={descRef} className={styles.description}>
          还在为找不到实现理想发型的发型师而烦恼吗？来试试我们的功能吧！
        </p>

        <div className={styles.btnGroup}>
          <button
            ref={btn1Ref}
            className={`pop-btn ${styles.ctaBtn}`}
            onClick={() => navigate('/privacy')}
          >
            ✂️ 开始体验
          </button>
          <button
            ref={btn2Ref}
            className={`pop-btn yellow ${styles.ctaBtn}`}
            onClick={() => navigate('/review')}
          >
            📝 撰写评价
          </button>
        </div>
      </div>
    </div>
  )
}
