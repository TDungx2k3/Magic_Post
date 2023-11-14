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

function App() {
  AOS.init();

window.addEventListener('scroll', () => {
  AOS.refresh();
});

  document.title = 'Magic Post';
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path='/leader' element={<Leader />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
