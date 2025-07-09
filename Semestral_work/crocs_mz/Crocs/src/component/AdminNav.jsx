import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Package,
  Palette,
  ChevronDown,
  ChevronUp,
  Menu,
} from 'lucide-react';
import '../assets/style/adminMenu.css';

const AdminNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const items = [
    {
      label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard,
    },
    {
      label: 'Pedidos',
      icon: Layers,
      children: [
        { label: 'Todos os Pedidos', path: 'pedidos' },
        { label: 'Detalhe do pedido', path: 'pedido/detalhe' },
      ],
    },
    {
      label: 'Produtos',
      icon: Package,
      children: [
        { label: 'Todos Produtos', path: 'produtos' },
        { label: 'Detalhe do Produto', path: 'produto/detalhe' },
        { label: 'Adicionar Produto', path: 'produto/adicionar' },
      ],
    },
    {
      label: 'Usuários',
      icon: Palette,
      children: [
        { label: 'Todos os usuários', path: 'usuarios' },
        { label: 'Detalhe do Usuario', path: 'usuario/detalhe' },
      ],
    },
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <span>Admin</span>
        <button onClick={() => setCollapsed(!collapsed)} className="toggle-btn">
          <Menu size={20} />
        </button>
      </div>

      <div className="sidebar-scroll-container">
        <nav>
          {items.map(({ label, path, icon: Icon, children }) => (
            <div key={label} className="menu-group">
              {path ? (
                <Link to={path} className="menu-link">
                  <Icon size={20} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              ) : (
                <div className="menu-link" onClick={() => toggleExpand(label)}>
                  <Icon size={20} />
                  {!collapsed && (
                    <>
                      <span>{label}</span>
                      {children &&
                        (expanded[label] ? (
                          <ChevronUp size={16} className="submenu-icon rotate" />
                        ) : (
                          <ChevronDown size={16} className="submenu-icon" />
                        ))}
                    </>
                  )}
                </div>
              )}

              {!collapsed && children && (
                <div className={`submenu-wrapper ${expanded[label] ? 'open' : 'closed'}`}>
                  <div className="submenu">
                    {children.map((child) => (
                      <Link to={child.path} key={child.path} className="submenu-link">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminNav;
