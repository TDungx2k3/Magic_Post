import './App.css';
import './assets/icons/themify-icons/themify-icons.css';
import Slider from './components/Slider';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import Home from './pages/Home';
import Login from './pages/Login';
import AboutUs from "./pages/AboutUs"
import Leader from './pages/Leader';
import { createContext, useState } from 'react';

export const LoginContext = createContext();

function App() {
  // Khai báo các thông tin chung cần dùng của cả trang web
  const [isLogin, setIsLogin] = useState(false) //Trạng thái đăng nhập

  // Lưu trữ thông tin người đăng nhập
  let userInfo = {
      uId : "",
      uName : "",
      uPhone : "",
      uPassword : "",
      uRole: "",
      uUnit: ""
  }
  
  
  AOS.init();


  window.addEventListener('scroll', () => {
    AOS.refresh();
  });

  window.addEventListener('click', () => {
    AOS.refresh();
  });

  document.title = 'Magic Post';
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/leader" element={<Leader />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
