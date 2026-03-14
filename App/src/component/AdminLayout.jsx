import React from 'react';
import AdminNav from '../component/AdminNav'; // Rename was AdminNavigation
import { Outlet } from 'react-router-dom';
import '../assets/style/adminlayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
