import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import SobreNos from "./components/About";
import Loja from "./components/Loja";
import Navbar from './components/Navbar';
import Footer from './components/Footer';





function AppRoutes(){
    return(
        <Router>
          
           <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/sobre-nos" element={<SobreNos/>} />
        <Route path="/sobre-nos" element={<SobreNos/>} />
        <Route path="/loja" element={<Loja />} />
      </Routes>
      <Footer/>
          
        </Router>
    )}

    export default AppRoutes;