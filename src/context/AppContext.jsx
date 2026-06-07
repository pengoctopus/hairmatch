import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [userMode, setUserMode] = useState(null) // 'ai' | 'safe'
  const [userPhoto, setUserPhoto] = useState(null)
  const [userFeatures, setUserFeatures] = useState({
    faceShape: '圆',
    hairType: '细软',
    hairVolume: '中等',
    height: '164',
    desiredStyle: '卷发',
    styleTag: '韩式温柔',
    location: '北京（模拟数据仅包含北京地区）',
    budget: '不限',
    gender: '女',
    timePreference: ['节假日']
  })
  const [selectedMockPhoto, setSelectedMockPhoto] = useState(null)
  const [selectedBarber, setSelectedBarber] = useState(null)

  // 页面加载时从 localStorage 恢复用户选择
  useEffect(() => {
    const saved = localStorage.getItem('userChoice')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.face) {
          setUserFeatures(prev => ({
            ...prev,
            faceShape: parsed.face,
            hairType: parsed.hair,
            styleTag: parsed.style,
            desiredStyle: parsed.desiredStyle || prev.desiredStyle
          }))
        }
        if (parsed.photo) setSelectedMockPhoto(parsed.photo)
        if (parsed.mode) setUserMode(parsed.mode)
      } catch (e) {
        console.warn('恢复用户选择失败', e)
      }
    }
  }, [])

  return (
    <AppContext.Provider value={{
      userMode, setUserMode,
      userPhoto, setUserPhoto,
      userFeatures, setUserFeatures,
      selectedMockPhoto, setSelectedMockPhoto,
      selectedBarber, setSelectedBarber
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
