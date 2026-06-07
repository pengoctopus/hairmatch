import { useEffect, useRef, useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { barbers, reviews } from '../data/mockData'
import { calculateMatch, filterReviews, getMatchLabel } from '../utils/matchLogic'
import gsap from 'gsap'
import styles from './Result.module.css'

// 示例照片映射
const photoUserMap = {
  '/user_photo/user_1.png': 'user_1',
  '/user_photo/user_2.png': 'user_2',
}

// 风格标签映射到文件名中的风格部分
const styleTagMap = {
  '韩式温柔': '韩式温柔',
  '法式慵懒': '法式慵懒',
  '美式复古': '美式复古',
}

export default function Result() {
  const { userMode, userFeatures, selectedMockPhoto } = useApp()
  const [expandedRange, setExpandedRange] = useState(false)
  const [selectedBarberId, setSelectedBarberId] = useState(null)
  const pageRef = useRef(null)

  // 计算结果图片路径
  const getResultImage = () => {
    const userKey = photoUserMap[selectedMockPhoto] || 'user_1'
    const styleKey = styleTagMap[userFeatures.styleTag] || '韩式温柔'
    const hairstyle = userFeatures.desiredStyle || '卷发'
    return `/result/${userKey}_${hairstyle}_${styleKey}.png`
  }

  const resultImageSrc = getResultImage()
  const showAiPreview = userMode === 'ai' && selectedMockPhoto

  // 匹配算法：根据用户选择计算理发师排序
  const matchedBarbers = useMemo(() => {
    const list = calculateMatch(
      barbers,
      userFeatures.faceShape,
      userFeatures.hairType,
      userFeatures.styleTag
    )
    return expandedRange ? list : list.slice(0, 3)
  }, [userFeatures.faceShape, userFeatures.hairType, userFeatures.styleTag, expandedRange])

  // 是否有匹配（至少匹配一项）
  const hasMatches = matchedBarbers.length > 0 && matchedBarbers[0].matchScore > 0

  // 当前选中的理发师
  const currentBarber = useMemo(() => {
    if (selectedBarberId) {
      const found = matchedBarbers.find(b => b.id === selectedBarberId)
      if (found) return found
    }
    return matchedBarbers[0] || null
  }, [matchedBarbers, selectedBarberId])

  // 当前理发师的评论（已筛选排序）
  const currentReviews = useMemo(() => {
    if (!currentBarber) return []
    return filterReviews(
      reviews,
      currentBarber.id,
      userFeatures.faceShape,
      userFeatures.hairType,
      userFeatures.styleTag
    )
  }, [currentBarber, userFeatures.faceShape, userFeatures.hairType, userFeatures.styleTag])

  useEffect(() => {
    if (!pageRef.current) return
    gsap.set(pageRef.current, { opacity: 1, y: 0 })
    const tween = gsap.from(pageRef.current, {
      opacity: 0.5,
      y: 15,
      duration: 0.4,
      ease: 'power2.out'
    })
    return () => { tween.kill() }
  }, [])

  const getCardColor = (idx) => {
    const colors = ['#FFB6C1', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C']
    return colors[idx % colors.length]
  }

  const getReviewCardColor = (review) => {
    if (review.has_photo) return '#E6F3FF'
    const avg = (review.ratings.technique + review.ratings.communication + review.ratings.restoration) / 3
    if (avg >= 4.5) return '#FFF0F5'
    return '#FFFACD'
  }

  const getMatchBadgeClass = (score) => {
    if (score >= 90) return styles.highMatch
    if (score >= 60) return styles.goodMatch
    return styles.lowMatch
  }

  return (
    <div ref={pageRef} className={`page-container ${styles.resultPage}`}>
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>匹配结果</h2>

        <div className={styles.resultLayout}>
          {/* 左侧 - 理发师卡片 */}
          <div className={styles.barberList}>
            <h3 className={styles.sectionTitle}>推荐发型师</h3>

            {!hasMatches && (
              <div className={styles.emptyState}>
                <p>附近暂无完美匹配，试试扩大搜索范围？</p>
              </div>
            )}

            {matchedBarbers.map((barber, idx) => {
              const matchLabel = getMatchLabel(barber.matchScore)
              return (
                <div
                  key={barber.id}
                  className={`${styles.barberCard} ${currentBarber?.id === barber.id ? styles.activeCard : ''}`}
                  style={{ background: getCardColor(idx) }}
                  onClick={() => setSelectedBarberId(barber.id)}
                >
                  <div className={styles.barberHeader}>
                    <img
                      src={`/assets/理发师${barber.id <= 4 ? barber.id : 1}.png`}
                      alt={barber.name}
                      className={styles.barberAvatar}
                      onError={(e) => { e.target.src = '/assets/理发师1.png' }}
                    />
                    <div className={styles.barberInfo}>
                      <h4 className={styles.barberName}>{barber.name}</h4>
                      <p className={styles.barberShop}>{barber.shop}</p>
                      <p className={styles.barberMeta}>{barber.distance} · {barber.price_range}</p>
                    </div>
                    <div className={`${styles.matchBadge} ${getMatchBadgeClass(barber.matchScore)}`}>
                      {barber.matchScore}% 匹配
                    </div>
                  </div>

                  <div className={styles.barberTags}>
                    {barber.tags.map(tag => (
                      <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                  </div>

                  <div className={styles.barberRating}>
                    <span className={styles.ratingScore}>{barber.rating}</span>
                    <div className={styles.ratingStars}>
                      {'⭐'.repeat(Math.floor(barber.rating))}
                    </div>
                  </div>

                  {/* 匹配度标签 */}
                  <div className={styles.matchLabelRow}>
                    <span className={`${styles.matchLabel} ${styles[matchLabel.className]}`}>
                      {matchLabel.label}
                    </span>
                  </div>
                </div>
              )
            })}

            {!expandedRange && (
              <button
                className={`pop-btn ${styles.expandBtn}`}
                onClick={() => setExpandedRange(true)}
              >
                扩大搜索范围
              </button>
            )}
          </div>

          {/* 右侧 - 预览 + 评论墙 */}
          <div className={styles.rightPanel}>
            {/* AI换脸预览 */}
            <div className={styles.previewSection}>
              <h3 className={styles.sectionTitle}>AI 发型预览</h3>
              {showAiPreview ? (
                <div className={styles.aiPreviewBox}>
                  <div className={styles.previewImgs}>
                    <div className={styles.previewImgWrap}>
                      <img src={selectedMockPhoto} alt="你的照片" className={styles.previewImg} />
                      <span className={styles.previewLabel}>你的特征</span>
                    </div>
                    <div className={styles.previewPlus}>+</div>
                    <div className={styles.previewImgWrap}>
                      <img
                        src={resultImageSrc}
                        alt="AI发型预览"
                        className={styles.previewImg}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <span className={styles.previewLabel}>AI预览</span>
                    </div>
                  </div>
                  <p className={styles.aiTag}>AI 风格化预览（本地生成）</p>
                </div>
              ) : (
                <div className={styles.placeholderBox}>
                  <p>🔒 开启智能识别并选择提供照片的评价，即可查看AI发型预览</p>
                </div>
              )}
            </div>

            {/* 评论墙 - 动态渲染 */}
            <div className={styles.reviewSection}>
              <h3 className={styles.sectionTitle}>
                社区真实评价
                {currentBarber && <span className={styles.reviewBarberName}> — {currentBarber.name}</span>}
              </h3>
              <div className={styles.reviewList}>
                {currentReviews.length === 0 && (
                  <div className={styles.noReview}>
                    <p>暂无相关评论</p>
                  </div>
                )}
                {currentReviews.map(review => (
                  <div
                    key={review.id}
                    className={styles.reviewCard}
                    style={{ background: getReviewCardColor(review) }}
                  >
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewProfile}>匿名用户 | {review.anonymous_profile}</span>
                      <span className={styles.reviewDate}>
                        {review.date}
                        {review.has_photo && review.photo_face_covered && (
                          <span className={styles.faceMaskBadge}>面部已遮挡</span>
                        )}
                      </span>
                    </div>

                    {/* 与你脸型相似标签 */}
                    {review.faceType === userFeatures.faceShape && (
                      <div className={styles.similarFaceTag}>与你脸型相似</div>
                    )}

                    {review.has_photo && review.photo_face_covered && (
                      <div className={styles.reviewPhoto}>
                        <img
                          src={`/assets/${review.photo_url}`}
                          alt="发型照片"
                          className={styles.photoImg}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                    )}

                    {!review.has_photo && (
                      <div className={styles.noPhotoTag}>纯文字评价</div>
                    )}

                    <div className={styles.reviewRatings}>
                      <span>技术 {'⭐'.repeat(review.ratings.technique)}</span>
                      <span>沟通 {'⭐'.repeat(review.ratings.communication)}</span>
                      <span>还原度 {'⭐'.repeat(review.ratings.restoration)}</span>
                    </div>

                    <p className={styles.reviewComment}>{review.comment}</p>

                    <div className={styles.reviewTags}>
                      {review.tags.map(tag => (
                        <span key={tag} className={styles.reviewTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
