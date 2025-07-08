import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Layers, Package, Palette, Menu } from 'lucide-react';
import '../assets/style/adminMenu.css';// This should style the sidebar

const AdminNav = () => {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
    { label: 'Categoria', path: 'categoria', icon: Layers },
    { label: 'Produto', path: 'produto', icon: Package },
    { label: 'Produto Cor', path: 'produto-color', icon: Palette },
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <span>Admin</span>
        <button onClick={() => setCollapsed(!collapsed)} className="toggle-btn">
          <Menu size={20} />
        </button>
      </div>
      <nav>
        {items.map(({ path, label, icon: Icon }) => (
          <Link to={path} key={path} className="menu-link">
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminNav;
