import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import TopPage from './pages/TopPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  )
}
