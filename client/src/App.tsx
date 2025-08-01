import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Content from './components/Content';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<Content />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
