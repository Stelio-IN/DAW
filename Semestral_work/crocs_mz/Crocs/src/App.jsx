import React from 'react';

import './app.css'; 
import AppRoutes from './routes';
import Home from './pages/Home';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Layout from './components/layout';



function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
       
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
