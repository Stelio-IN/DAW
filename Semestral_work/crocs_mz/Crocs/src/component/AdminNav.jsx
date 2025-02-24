import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Layers, Package, Palette, Menu } from 'lucide-react';
import '../assets/style/admindashboard.css';

const AdminNavigation = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'category', icon: Layers, label: 'Categoria', path: '/admin/categoria' },
    { id: 'product', icon: Package, label: 'Produto', path: '/admin/produto' },
    { id: 'productColor', icon: Palette, label: 'Produto Cor', path: '/admin/produto-color' },
  ];

  return (
    <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">Admin</div>
        <button className="toggle-btn" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
          <Menu size={20} />
        </button>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link key={item.id} to={item.path} className="menu-item">
            <item.icon size={20} className="icon" />
            {!isSidebarCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavigation;
