import './App.css';
import './assets/icons/themify-icons/themify-icons.css';
import Slider from './components/Slider';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

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
          <Route path="/footer" element={<Footer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
