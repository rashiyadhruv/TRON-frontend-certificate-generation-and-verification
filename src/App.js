import "./App.css";
import Login from "./pages/Login/Login";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Verify from "./pages/Verify/Verify";
import LPage from "./pages/LPage/LPage";
import { AuthProvider } from "./contexts/AuthContext";
import Download from "./pages/Download/Download";
import SwiperCore, { Autoplay } from "swiper";

function App() {
  SwiperCore.use([Autoplay]);
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} exact />
            <Route path="/qvjr4:tgj$$1*aedf[" element={<Login />} exact />
            <Route path="/generate" element={<Home />} exact />
            <Route path="/verify" element={<Verify />} exact />
            <Route path="/download" element={<Download />} exact />
            <Route path="/home" element={<LPage />} exact />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
