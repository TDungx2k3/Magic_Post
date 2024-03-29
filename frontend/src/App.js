import './App.css';
import './assets/icons/themify-icons/themify-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import Home from './pages/Home';
import Login from './pages/Login';
import AboutUs from "./pages/AboutUs"
import APIDev from './pages/APIDev';
import Leader from './pages/Leader';
import TransactionManager from './pages/TransactionManager';
import Chart from './pages/TransactionManager/subpages/Chart';
import DenyList from './pages/TransactionManager/subpages/DenyList';
import LostOrderListTransaction from './pages/TransactionManager/subpages/LostOrderListTransaction';
import GatherManager from './pages/GatherManager';
import CreateAccount from './pages/GatherManager/subpage/CreateAccount';
import Statistic from './pages/GatherManager/subpage/Chart';
import ModifyAccountEmployee from './pages/GatherManager/subpage/ModifyAccountEmployee';
import CustomerDenyList from './pages/GatherManager/subpage/CustomerDenyList';
import LostOrderListGather from './pages/GatherManager/subpage/LostOrderListGather';
import { createContext, useEffect, useState } from 'react';
import ManageGather from './pages/Leader/subPages/ManageGather';
import ModifyGather from './pages/Leader/subPages/ModifyGather';
import ModifyTransaction from './pages/Leader/subPages/ModifyTransaction';
import CreateGather from './pages/Leader/subPages/CreateGather';
import CreateTransaction from './pages/Leader/subPages/CreateTransaction';
import DeliveryReceiptPage from './pages/DeliveryReceiptPage/';
import CreateOrderPage from './pages/TransactionTeller/SubPage/CreateOrder';
import TransactionTeller from './pages/TransactionTeller';
import ToCustomer from './pages/TransactionTeller/SubPage/ToCustomer';
import FromCustomer from './pages/TransactionTeller/SubPage/FromCustomer';
import ManageTransaction from './pages/Leader/subPages/ManageTransaction';
import FromTransaction from './pages/GatherTeller/SubPage/FromTransaction';
import ToTransaction from './pages/GatherTeller/SubPage/ToTransaction';
import GatherTeller from './pages/GatherTeller';
import CustomerQR from './pages/Customer';

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

  window.addEventListener('load', function () {
    let nowTime = new Date();
    const storedOutTime = new Date(JSON.parse(localStorage.getItem('outTime')));
    // console.log(typeof(storedOutTime));
    // console.log(nowTime - storedOutTime );
    if(nowTime - storedOutTime >= 3600000) {
      setIsLogin(false);
      setUserInfo({
        uId : "",
        uName : "",
        uPhone : "",
        uPassword : "",
        uRole: "",
        uUnit: ""
      });
      localStorage.setItem('isLogin', JSON.stringify(false));
      localStorage.setItem('userInfo', JSON.stringify({
        uId : "",
        uName : "",
        uPhone : "",
        uPassword : "",
        uRole: "",
        uUnit: ""
      }));
    }
    else {
      const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem("outTime", JSON.stringify(new Date()));
      console.log(storedIsLogin);
      console.log(storedUserInfo);
      if (storedIsLogin) {
        setIsLogin(storedIsLogin);
      }
      if (storedUserInfo.uId !== "") {
        setUserInfo(storedUserInfo);
      }
    }
  });

  window.addEventListener('beforeunload', function (event) {
    localStorage.setItem("outTime", JSON.stringify(new Date()));
  });
  
  AOS.init();


  window.addEventListener('scroll', () => {
    AOS.refresh();
  });

  window.addEventListener('click', () => {
    AOS.refresh();
  });

  document.title = 'Magic Post';

  useEffect(() => {
    
    const storedIsLogin = JSON.parse(localStorage.getItem('isLogin'));
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(storedIsLogin);
    console.log(storedUserInfo);
    if (storedIsLogin) {
      setIsLogin(storedIsLogin);
    }
    if(storedUserInfo) {
      if (storedUserInfo.uId !== "") {
        setUserInfo(storedUserInfo);
      }
    } 
  }, []);

  return (
    <LoginContext.Provider value={{isLogin, setIsLogin, userInfo, setUserInfo}}>
      <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/leader" element={<Leader />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path='/api-dev' element={<APIDev />}/>
            <Route path='/transaction-manager' element={<TransactionManager />}/>
            <Route path='/transaction-manager/statistic' element={<Chart />}/>
            <Route path='/transaction-manager/deny-list' element={<DenyList />}/>
            <Route path='/transaction-manager/lost-order-list' element={<LostOrderListTransaction />}/>
            <Route path='/gather-manager' element={<GatherManager />}/>
            <Route path='/gather-manager/statistic' element={<Statistic />}/>
            <Route path='/gather-manager/deny-list' element={<CustomerDenyList />}/>
            <Route path='/gather-manager/lost-order-list' element={<LostOrderListGather />}/>
            <Route path='/gather-manager/create-account' element={<CreateAccount />}/>
            <Route path='/modify-account' element={<ModifyAccountEmployee />}/>
            <Route path = '/leaderManageGather' element={<ManageGather/>} />
            <Route path = '/leaderManageTransaction' element={<ManageTransaction/>} />
            <Route path = '/modifyGather' element={<ModifyGather/>} />
            <Route path = '/modifyTransaction' element={<ModifyTransaction/>} />
            <Route path = '/createGather' element={<CreateGather/>} />
            <Route path = '/createTransaction' element={<CreateTransaction/>} />
            <Route path = '/deliveryReceipt' element={<DeliveryReceiptPage/>} />
            <Route path = '/createOrder' element={<CreateOrderPage/>} />
            <Route path = '/transactionTeller' element={<TransactionTeller/>} />
            <Route path = '/transTellerToCus' element={<ToCustomer/>} />
            <Route path = '/transTellerFromCus' element={<FromCustomer/>} />
            <Route path = '/gatherTeller' element={<GatherTeller/>} />
            <Route path = '/gatherTellerFromTran' element={<FromTransaction/>} />
            <Route path = '/gatherTellerToTran' element={<ToTransaction/>} />
            <Route path = '/customerQR' element={<CustomerQR/>} />
          </Routes>
        </Router>
      </div>
    </LoginContext.Provider>
    
  );
}

export default App;
