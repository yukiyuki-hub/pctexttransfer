import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SendPage from './pages/SendPage'
import ReceivePage from './pages/ReceivePage'
import QRReceivePage from './pages/QRReceivePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SendPage />} />
        <Route path="/receive" element={<ReceivePage />} />
        <Route path="/r/:code" element={<QRReceivePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
