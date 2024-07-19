import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './layout/Home';
import ImageGallery from './layout/ImageGallery';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/imagegallery' element={<ImageGallery />} />
    </Routes>
  );
}

export default App;
