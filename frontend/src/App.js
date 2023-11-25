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
import TransactionManager from './pages/TransactionManager';
import GatherManager from './pages/GatherManager';
import PointsInfo from './pages/Leader/components/PointsInfo';
import { createContext, useState } from 'react';
import ManageGather from './pages/Leader/subPages/ManageGather';
import ModifyGather from './pages/Leader/subPages/ModifyGather';
import ModifyTransaction from './pages/Leader/subPages/ModifyTransaction';
import CreateGather from './pages/Leader/subPages/CreateGather';
import CreateTransaction from './pages/Leader/subPages/CreateTransaction';
import DeliveryReceiptPage from './pages/DeliveryReceiptPage/';

export const LoginContext = createContext();

function App() {
  // Khai báo các thông tin chung cần dùng của cả trang web
  const [isLogin, setIsLogin] = useState(false); //Trạng thái đăng nhập

  // Lưu trữ thông tin người đăng nhập
  const [userInfo, setUserInfo] = useState({
    uId : "",
    uName : "",
    uPhone : "",
    uPassword : "",
    uRole: "",
    uUnit: ""
});
  
  
  AOS.init();


  window.addEventListener('scroll', () => {
    AOS.refresh();
  });

  window.addEventListener('click', () => {
    AOS.refresh();
  });

  document.title = 'Magic Post';
  return (
    <LoginContext.Provider value={{isLogin, setIsLogin, userInfo, setUserInfo}}>
      <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/leader" element={<Leader />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path='/transaction-manager' element={<TransactionManager />}/>
            <Route path='/gather-manager' element={<GatherManager />}/>
            <Route path = '/leaderManageGather' element={<ManageGather/>} />
            <Route path = '/modifyGather' element={<ModifyGather/>} />
            <Route path = '/modifyTransaction' element={<ModifyTransaction/>} />
            <Route path = '/createGather' element={<CreateGather/>} />
            <Route path = '/createTransaction' element={<CreateTransaction/>} />
            <Route path = '/deliveryReceipt' element={<DeliveryReceiptPage/>} />
          </Routes>
        </Router>
      </div>
    </LoginContext.Provider>
    
  );
}

export default App;
