import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import './App.css'
import Home from './Components/Home'
import Payment from './Components/Payment';
import Header from './Components/Header';



function App() {
  return (
    <BrowserRouter >
        <Header />
       <Routes>
          <Route path='/' element={<Home />} />  
          <Route path='/payment/:param' element={<Payment />} />
       </Routes>
    </BrowserRouter>
  )
}

export default App
