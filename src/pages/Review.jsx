import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { barbers, reviewTags } from '../data/mockData'
import styles from './Review.module.css'

const barberNames = barbers.map(b => b.name)
const barberShopsMap = {}
barbers.forEach(b => { barberShopsMap[b.name] = b.shop })

const ratingLabels = ['技术', '服务', '环境', '还原度']

export default function Review() {
  const [selectedBarber, setSelectedBarber] = useState('')
  const [selectedShop, setSelectedShop] = useState('')
  const [reviewType, setReviewType] = useState('text')
  const [ratings, setRatings] = useState({ 技术: 5, 服务: 5, 环境: 5, 还原度: 5 })
  const [selectedTags, setSelectedTags] = useState([])
  const [comment, setComment] = useState('')
  const [showThanks, setShowThanks] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [beforePhoto, setBeforePhoto] = useState(null)
  const [afterPhoto, setAfterPhoto] = useState(null)
  const [masking, setMasking] = useState(false)

  const pageRef = useRef(null)
  const thanksRef = useRef(null)
  const starsRef = useRef(null)

  useEffect(() => {
    if (!pageRef.current) return
    // 确保初始可见
    gsap.set(pageRef.current, { opacity: 1, y: 0 })

    const tween = gsap.from(pageRef.current, {
      opacity: 0.5,
      y: 15,
      duration: 0.4,
      ease: 'power2.out'
    })

    return () => { tween.kill() }
  }, [])

  useEffect(() => {
    if (showThanks && thanksRef.current) {
      gsap.from(thanksRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      })

      // 星星爆炸动画
      const starEls = starsRef.current?.children
      if (starEls) {
        gsap.fromTo(starEls,
          { scale: 0, rotation: 0 },
          {
            scale: 1.5,
            rotation: 180,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(2)',
            yoyo: true,
            repeat: 1
          }
        )
      }
    }
  }, [showThanks])

  const handleBarberChange = (name) => {
    setSelectedBarber(name)
    setSelectedShop(barberShopsMap[name] || '')
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handlePhotoUpload = (type, e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    if (type === 'before') setBeforePhoto(url)
    else setAfterPhoto(url)

    // Mock 脸部遮挡处理
    setMasking(true)
    setTimeout(() => setMasking(false), 2000)
  }

  const handleSubmit = () => {
    if (!selectedBarber || !comment) return
    setShowThanks(true)
    setTimeout(() => {
      setShowThanks(false)
      setSubmitted(true)
      // 重置表单
      setSelectedBarber('')
      setSelectedShop('')
      setReviewType('text')
      setRatings({ 技术: 5, 服务: 5, 环境: 5, 还原度: 5 })
      setSelectedTags([])
      setComment('')
      setBeforePhoto(null)
      setAfterPhoto(null)
    }, 2500)
  }

  const isValid = selectedBarber && comment.length > 5

  return (
    <div ref={pageRef} className={`page-container ${styles.reviewPage}`}>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>撰写评价</h2>

        {/* 脸部遮挡说明 */}
        <div className={styles.privacyNotice}>
          <div className={styles.privacyImg}>
            <img src="/assets/privacy.png" alt="隐私说明" />
          </div>
          <div className={styles.privacyText}>
            <h3>隐私保护说明</h3>
            <p>
              我们重视每一位用户的隐私。上传的照片将自动进行脸部遮挡处理，只保留发型部分用于社区展示。
              你的面部信息不会被泄露。
            </p>
          </div>
        </div>

        {submitted ? (
          <div className={styles.submittedBox}>
            <h3>✅ 评价已提交</h3>
            <p>你的评价正在审核中，审核通过后将展示在社区。</p>
            <button className="pop-btn" onClick={() => setSubmitted(false)}>
              再写一条
            </button>
          </div>
        ) : (
          <div className={styles.formBox}>
            {/* 选择理发师 */}
            <div className={styles.formGroup}>
              <label>选择理发师</label>
              <select
                className={styles.select}
                value={selectedBarber}
                onChange={(e) => handleBarberChange(e.target.value)}
              >
                <option value="">请选择理发师</option>
                {barberNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* 选择店铺 */}
            <div className={styles.formGroup}>
              <label>选择店铺</label>
              <input
                type="text"
                className={styles.textInput}
                value={selectedShop}
                readOnly
                placeholder="选择理发师后自动填充"
              />
            </div>

            {/* 订单截图 */}
            <div className={styles.formGroup}>
              <label>上传订单截图（选填）</label>
              <div className={styles.uploadBox}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {}}
                  hidden
                  id="order-upload"
                />
                <label htmlFor="order-upload" className={styles.uploadLabel}>
                  📎 点击上传订单截图，帮助我们验证真实体验
                </label>
              </div>
            </div>

            {/* 评价类型 */}
            <div className={styles.formGroup}>
              <label>评价类型</label>
              <div className={styles.typeSelect}>
                <button
                  className={`${styles.typeBtn} ${reviewType === 'photo' ? styles.activeType : ''}`}
                  onClick={() => setReviewType('photo')}
                >
                  📷 拍照评价
                </button>
                <button
                  className={`${styles.typeBtn} ${reviewType === 'text' ? styles.activeType : ''}`}
                  onClick={() => setReviewType('text')}
                >
                  📝 文字评价
                </button>
              </div>
            </div>

            {/* 拍照评价上传 */}
            {reviewType === 'photo' && (
              <div className={styles.photoUploads}>
                <div className={styles.photoBox}>
                  <label>剪发前</label>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="before-photo"
                    onChange={(e) => handlePhotoUpload('before', e)}
                  />
                  <label htmlFor="before-photo" className={styles.photoLabel}>
                    {beforePhoto ? (
                      <img src={beforePhoto} alt="剪发前" className={styles.previewPhoto} />
                    ) : (
                      <span>+ 上传照片</span>
                    )}
                  </label>
                </div>
                <div className={styles.photoBox}>
                  <label>剪发后</label>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="after-photo"
                    onChange={(e) => handlePhotoUpload('after', e)}
                  />
                  <label htmlFor="after-photo" className={styles.photoLabel}>
                    {afterPhoto ? (
                      <img src={afterPhoto} alt="剪发后" className={styles.previewPhoto} />
                    ) : (
                      <span>+ 上传照片</span>
                    )}
                  </label>
                </div>
                {masking && (
                  <div className={styles.maskingNotice}>
                    🔒 脸部遮挡处理中...
                  </div>
                )}
              </div>
            )}

            {/* 评分 */}
            <div className={styles.formGroup}>
              <label>结构化评分</label>
              <div className={styles.ratings}>
                {ratingLabels.map(label => (
                  <div key={label} className={styles.ratingRow}>
                    <span className={styles.ratingLabel}>{label}</span>
                    <div className={styles.starGroup}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          className={styles.starBtn}
                          onClick={() => setRatings(prev => ({ ...prev, [label]: star }))}
                        >
                          {star <= ratings[label] ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 标签选择 */}
            <div className={styles.formGroup}>
              <label>标签选择（多选）</label>
              <div className={styles.tagCloud}>
                {reviewTags.slice(0, 12).map(tag => (
                  <button
                    key={tag}
                    className={`${styles.tagPill} ${selectedTags.includes(tag) ? styles.activePill : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 文字评论 */}
            <div className={styles.formGroup}>
              <label>文字评论</label>
              <textarea
                className={styles.textarea}
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="说说你的真实体验..."
              />
            </div>

            {/* 提交 */}
            <button
              className={`pop-btn pink ${styles.submitBtn}`}
              onClick={handleSubmit}
              disabled={!isValid}
            >
              🚀 发布评价
            </button>
          </div>
        )}
      </div>

      {/* 感谢弹窗 */}
      {showThanks && (
        <div className={styles.modalOverlay}>
          <div ref={thanksRef} className={styles.thanksCard}>
            <div ref={starsRef} className={styles.explodeStars}>
              <span>⭐</span><span>⭐</span><span>⭐</span>
              <span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
            <h3>感谢你的分享！</h3>
            <p>你的评价将帮助更多人找到理想的发型师。</p>
          </div>
        </div>
      )}
    </div>
  )
}
