import React, { useState } from "react";  // Importando o useState
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de login
  const [userEmail, setUserEmail] = useState(''); // Estado para o email do usuário

  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* Passa as props isLoggedIn e userEmail para o Nav */}
        <Nav 
          isLoggedIn={isLoggedIn} 
          userEmail={userEmail} 
          setIsLoggedIn={setIsLoggedIn} 
          setUserEmail={setUserEmail} 
        />
        <main style={{ padding: "20px", flex: "1" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
