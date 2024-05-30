import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from './components/Register';

function App() {
  return (
    <div className="flex w-full h-screen">
      <div className="w-full bg-cyan-50 flex items-center justify-center lg:w-1/2">
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
    </Router>
      </div>
      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce"/>
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"/>
      </div>
    </div>
  );
}

export default App;