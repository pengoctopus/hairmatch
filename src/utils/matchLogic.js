// 匹配算法工具函数

/**
 * 计算理发师匹配分数并排序
 * @param {Array} barbers 理发师列表
 * @param {string} userFace 用户脸型（如 '圆'）
 * @param {string} userHair 用户发质（如 '细软'）
 * @param {string} userStyle 用户风格（如 '韩式温柔'）
 * @returns {Array} 排序后的理发师列表
 */
export function calculateMatch(barbers, userFace, userHair, userStyle) {
  const scored = barbers.map(barber => {
    let score = 0
    if (barber.specialties && barber.specialties.includes(userFace)) score += 40
    if (barber.specialties && barber.specialties.includes(userHair)) score += 40
    if (barber.specialties && barber.specialties.includes(userStyle)) score += 40
    return { ...barber, matchScore: score }
  })

  scored.sort((a, b) => b.matchScore - a.matchScore)

  const matched = scored.filter(b => b.matchScore > 0)
  return matched.length > 0 ? matched : scored
}

/**
 * 筛选与理发师和用户选择相关的评论
 * @param {Array} reviews 所有评论
 * @param {number} barberId 理发师ID
 * @param {string} userFace 用户脸型
 * @param {string} userHair 用户发质
 * @param {string} userStyle 用户风格
 * @returns {Array} 筛选后的评论列表（最多5条）
 */
export function filterReviews(reviews, barberId, userFace, userHair, userStyle) {
  const allBarberReviews = reviews.filter(r => r.barber_id === barberId)

  let relevant = allBarberReviews.filter(r =>
    r.faceType === userFace ||
    r.hairTexture === userHair ||
    r.style === userStyle
  )

  if (relevant.length < 3) {
    const others = allBarberReviews.filter(r => !relevant.includes(r))
    relevant = [...relevant, ...others].slice(0, 5)
  } else {
    relevant = relevant.slice(0, 5)
  }

  return relevant
}

/**
 * 获取匹配度标签样式
 * @param {number} score 匹配分数
 * @returns {Object} { label: string, className: string }
 */
export function getMatchLabel(score) {
  if (score >= 90) return { label: '高度匹配', className: 'highMatch' }
  if (score >= 60) return { label: '较为匹配', className: 'goodMatch' }
  return { label: '可能适合', className: 'lowMatch' }
}
