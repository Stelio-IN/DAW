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
  Users,
  BarChart3,
} from 'lucide-react';
import '../assets/style/adminlayout.css';
import logo from '../../public/img/crocs_log.png'

const AdminNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [hovered, setHovered] = useState(false);

  const toggleExpand = (label) => {
    setExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const items = [
    { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
    {
      label: 'Pedidos',
      icon: Layers,
      children: [
        { label: 'Todos os Pedidos', path: 'pedidos' },
       // { label: 'Detalhe do Pedido', path: 'pedido/detalhe' },
      ],
    },
    {
      label: 'Produtos',
      icon: Package,
      children: [
        { label: 'Todos Produtos', path: 'produtos' },
        //{ label: 'Detalhe do Produto', path: 'produto/detalhe' },
        { label: 'Adicionar Produto', path: 'produto/adicionar' },
        { label: 'Associar produto a cor', path: 'produto/associar-produto-cor' },
        { label: 'Associar produto a tamanho', path: 'produto/associar-produto-tamanho' },
        { label: 'Associar produto a imagem', path: 'produto/associar-produto-imagem' },
      ],
    },
    /*{
      label: 'Usuários',
      icon: Users,
      children: [
        { label: 'Todos os Usuários', path: 'usuarios' },
        { label: 'Detalhe do Usuário', path: 'usuario/detalhe' },
      ],
    },*/
    {
      label: 'Gestão de Estoque',
      icon: BarChart3,
      children: [
        { label: 'Visão Geral', path: 'produto/estoque-visao-geral' },
      //  { label: 'Estoque do Produto', path: 'produto/estoque-produto' },
        { label: 'Promoção', path: 'produto/promotion' },
      ],
    },
  ];

  return (
    <aside 
      className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sidebar-header">
        {(!collapsed || hovered) && <span>Admin Panel</span>}
        <button 
          className="toggle-btn" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <Menu size={20} />
        </button>
      </div>

  
        <nav className='navbar'>

          <div className='logo-admin'>
            <img src={logo} alt="" id="imagem"/>
          </div>
          {items.map(({ label, path, icon: Icon, children }, index) => (
            <div key={label} style={{ '--item-index': index }}>
              {path ? (
                <Link 
                  to={path} 
                  className="menu-link"
                  onClick={() => collapsed && setCollapsed(false)}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              ) : (
                <div
                  className="menu-link"
                  onClick={() => !collapsed && toggleExpand(label)}
                >
                  <Icon size={20} />
                  {!collapsed && (
                    <>
                      <span>{label}</span>
                      {expanded[label] ? (
                        <ChevronUp size={16} className="submenu-icon rotate" />
                      ) : (
                        <ChevronDown size={16} className="submenu-icon" />
                      )}
                    </>
                  )}
                </div>
              )}

              {!collapsed && children && (
                <div className={`submenu-wrapper ${expanded[label] ? 'open' : 'closed'}`}>
                  <div className="submenu">
                    {children.map((child, childIndex) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="submenu-link"
                        style={{ '--item-index': index + childIndex * 0.1 }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      
      
      {/* Footer com versão */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="version-info">
            v1.0.0
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminNav;