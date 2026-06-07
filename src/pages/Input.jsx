import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import gsap from 'gsap'
import styles from './Input.module.css'

const faceShapes = ['圆', '方', '长', '椭']
const hairTypes = ['粗硬', '细软', '自然卷', '沙发']
const hairVolumes = ['少', '中等', '多']
const budgets = ['¥50-100', '¥100-200', '¥200-500', '¥500+', '不限']
const genders = ['男', '女', '不限']
const timeOptions = ['工作日', '周末', '节假日']

// 新发型选项
const hairstyleCards = [
  { id: 1, src: '/assets/发型1.png', name: '高层次' },
  { id: 2, src: '/assets/发型2.png', name: '公主切' },
  { id: 3, src: '/assets/发型3.png', name: '卷发' },
  { id: 4, src: '/assets/发型4.png', name: '学生头' },
]

// 新风格标签
const styleTags = ['韩式温柔', '法式慵懒', '美式复古']

const mockPhotos = [
  { id: 1, src: '/user_photo/user_1.png', label: '示例1' },
  { id: 2, src: '/user_photo/user_2.png', label: '示例2' },
]

// 不同示例照片对应的检测标签
const analysisResults = {
  '/user_photo/user_1.png': ['鹅蛋脸', '眼距适中', '嘴唇适中'],
  '/user_photo/user_2.png': ['圆脸', '眼距宽', '嘴唇厚', '细软发质'],
}

export default function Input() {
  const navigate = useNavigate()
  const { userMode, userFeatures, setUserFeatures, selectedMockPhoto, setSelectedMockPhoto } = useApp()
  const [uploadedPhoto, setUploadedPhoto] = useState(selectedMockPhoto)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (!formRef.current) return
    gsap.set(formRef.current, { opacity: 1, y: 0 })
    const tween = gsap.from(formRef.current, {
      y: 25,
      opacity: 0.5,
      duration: 0.5,
      ease: 'power2.out'
    })
    return () => { tween.kill() }
  }, [])

  const startAnalysis = () => {
    setAnalyzing(true)
    setAnalyzed(false)
    setTimeout(() => {
      setAnalyzing(false)
      setAnalyzed(true)
    }, 3000)
  }

  const selectMockPhoto = (src) => {
    setUploadedPhoto(src)
    setSelectedMockPhoto(src)
    startAnalysis()
  }

  const updateFeature = (key, value) => {
    setUserFeatures(prev => ({ ...prev, [key]: value }))
  }

  const toggleTime = (time) => {
    setUserFeatures(prev => {
      const current = prev.timePreference || []
      if (current.includes(time)) {
        return { ...prev, timePreference: current.filter(t => t !== time) }
      }
      return { ...prev, timePreference: [...current, time] }
    })
  }

  const handleSubmit = () => {
    // 保存用户选择到 localStorage，确保结果页能读取
    const userChoice = {
      face: userFeatures.faceShape,
      hair: userFeatures.hairType,
      style: userFeatures.styleTag,
      photo: selectedMockPhoto || null,
      desiredStyle: userFeatures.desiredStyle,
      mode: userMode
    }
    localStorage.setItem('userChoice', JSON.stringify(userChoice))
    navigate('/loading')
  }

  const isFormValid = () => {
    return userFeatures.location && userFeatures.budget && userFeatures.gender
  }

  const getAnalysisTags = () => {
    if (!uploadedPhoto) return []
    return analysisResults[uploadedPhoto] || ['圆脸', '眼距宽', '嘴唇厚', '细软发质']
  }

  return (
    <div className={`page-container ${styles.inputPage}`}>
      <div ref={formRef} className={styles.container}>
        <h2 className={styles.pageTitle}>信息录入</h2>

        <div className={styles.modeSection}>
          {userMode === 'ai' ? (
            <div className={styles.aiMode}>
              <h3 className={styles.sectionTitle}>📷 智能分析模式</h3>

              {/* 照片上传区 - 修改1：新提示文案 */}
              <div
                className={`${styles.uploadZone} ${dragOver ? styles.dragOver : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={() => {}}
                />
                {uploadedPhoto ? (
                  <img src={uploadedPhoto} alt="上传照片" className={styles.uploadedImg} />
                ) : (
                  <div className={styles.uploadPrompt}>
                    <span className={styles.uploadIcon}>📤</span>
                    <p>请从下方选择示例照片进行体验（演示模式）</p>
                  </div>
                )}
              </div>

              {/* Mock示例照片 */}
              <div className={styles.mockPhotos}>
                <p className={styles.mockLabel}>选择示例照片：</p>
                <div className={styles.mockList}>
                  {mockPhotos.map(photo => (
                    <div
                      key={photo.id}
                      className={`${styles.mockThumb} ${uploadedPhoto === photo.src ? styles.selectedThumb : ''}`}
                      onClick={() => selectMockPhoto(photo.src)}
                    >
                      <img src={photo.src} alt={photo.label} />
                      <span>{photo.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI分析进度 */}
              {analyzing && (
                <div className={styles.analyzingBox}>
                  <p>🤖 AI分析中...</p>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} />
                  </div>
                </div>
              )}

              {analyzed && (
                <div className={styles.analyzeResult}>
                  <p className={styles.resultTitle}>✅ 分析完成</p>
                  <div className={styles.tags}>
                    {getAnalysisTags().map(tag => (
                      <span key={tag} className={styles.tag}>检测到：{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.safeMode}>
              <h3 className={styles.sectionTitle}>🛡️ 绝对安全模式</h3>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>脸型</label>
                  <div className={styles.iconSelect}>
                    {faceShapes.map(shape => (
                      <button
                        key={shape}
                        className={`${styles.iconBtn} ${userFeatures.faceShape === shape ? styles.activeIcon : ''}`}
                        onClick={() => updateFeature('faceShape', shape)}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>发质</label>
                  <div className={styles.iconSelect}>
                    {hairTypes.map(type => (
                      <button
                        key={type}
                        className={`${styles.iconBtn} ${userFeatures.hairType === type ? styles.activeIcon : ''}`}
                        onClick={() => updateFeature('hairType', type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>发量</label>
                  <div className={styles.sliderGroup}>
                    {hairVolumes.map((vol) => (
                      <button
                        key={vol}
                        className={`${styles.sliderBtn} ${userFeatures.hairVolume === vol ? styles.activeSlider : ''}`}
                        onClick={() => updateFeature('hairVolume', vol)}
                      >
                        {vol}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>身高</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={userFeatures.height}
                    onChange={(e) => updateFeature('height', e.target.value)}
                    placeholder="请输入身高"
                  />
                </div>
              </div>

              {/* 修改6：已移除虚拟头像预览区域 */}
            </div>
          )}
        </div>

        {/* 共用：期望发型选择 - 修改3：新素材 */}
        <div className={styles.commonSection}>
          <h3 className={styles.sectionTitle}>💇 期望发型</h3>
          <div className={styles.hairstyleScroll}>
            {hairstyleCards.map(card => (
              <div
                key={card.id}
                className={`${styles.hairstyleCard} ${userFeatures.desiredStyle === card.name ? styles.selectedCard : ''}`}
                onClick={() => updateFeature('desiredStyle', card.name)}
              >
                <img src={card.src} alt={card.name} />
                <span>{card.name}</span>
              </div>
            ))}
          </div>

          <h3 className={styles.sectionTitle} style={{ marginTop: 24 }}>🏷️ 风格标签</h3>
          <div className={styles.tagSelect}>
            {styleTags.map(tag => (
              <button
                key={tag}
                className={`${styles.styleTag} ${userFeatures.styleTag === tag ? styles.activeTag : ''}`}
                onClick={() => updateFeature('styleTag', tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 共用字段 - 修改2：定位提示 */}
        <div className={styles.commonSection}>
          <h3 className={styles.sectionTitle}>📍 定位与偏好</h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>定位</label>
              <input
                type="text"
                className={styles.textInput}
                value={userFeatures.location}
                onChange={(e) => updateFeature('location', e.target.value)}
                placeholder="请输入城市或商圈"
              />
              <p className={styles.hintText}>模拟数据目前仅包含北京地区</p>
            </div>

            <div className={styles.formGroup}>
              <label>预算区间</label>
              <div className={styles.budgetSelect}>
                {budgets.map(b => (
                  <button
                    key={b}
                    className={`${styles.budgetBtn} ${userFeatures.budget === b ? styles.activeBudget : ''}`}
                    onClick={() => updateFeature('budget', b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>性别选择</label>
              <div className={styles.genderSelect}>
                {genders.map(g => (
                  <button
                    key={g}
                    className={`${styles.genderBtn} ${userFeatures.gender === g ? styles.activeGender : ''}`}
                    onClick={() => updateFeature('gender', g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>时间偏好（多选）</label>
              <div className={styles.timeSelect}>
                {timeOptions.map(t => (
                  <button
                    key={t}
                    className={`${styles.timeBtn} ${(userFeatures.timePreference || []).includes(t) ? styles.activeTime : ''}`}
                    onClick={() => toggleTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className={styles.submitArea}>
          <button
            className={`pop-btn pink ${styles.submitBtn}`}
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            🚀 开始匹配
          </button>
        </div>
      </div>
    </div>
  )
}
