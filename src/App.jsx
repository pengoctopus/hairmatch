import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Privacy from './pages/Privacy'
import Input from './pages/Input'
import MatchLoading from './pages/MatchLoading'
import Result from './pages/Result'
import Review from './pages/Review'
import './App.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/input" element={<Input />} />
          <Route path="/loading" element={<MatchLoading />} />
          <Route path="/result" element={<Result />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
