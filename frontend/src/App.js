import './App.css';
import './assets/icons/themify-icons/themify-icons.css';
import Slider from './components/Slider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  document.title = 'Magic Post';
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/slider" element={<Slider />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
