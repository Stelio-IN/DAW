import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  Package, 
  Palette,
  ChevronDown,
  Menu
} from 'lucide-react';

const AdminNavigation = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuToggle = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'category', icon: Layers, label: 'Categoria', path: '/admin/categoria' },
    { id: 'product', icon: Package, label: 'Produto', path: '/admin/produto' },
    { id: 'productColor', icon: Palette, label: 'Produto Cor', path: '/admin/produto-color' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg transition-all duration-300`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <div className="px-4 py-2">
            {isSidebarCollapsed ? (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
            ) : (
              <div className="text-xl font-bold text-blue-600">
                Admin Panel
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="p-4 w-full hover:bg-gray-100 flex items-center justify-center"
        >
          <Menu size={20} />
        </button>

        {/* Menu Items */}
        <nav className="mt-2">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              <div
                className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors
                  ${openMenus[item.id] ? 'bg-gray-100' : ''}`}
                onClick={() => handleMenuToggle(item.id)}
              >
                <item.icon size={20} className="text-gray-600" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="ml-3 text-gray-700">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform ${
                        openMenus[item.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </>
                )}
              </div>
              {openMenus[item.id] && !isSidebarCollapsed && (
                <div className="bg-gray-50 py-2">
                  <Link
                    to={item.path}
                    className="pl-12 py-2 text-sm text-gray-600 hover:text-blue-600 block"
                  >
                    {item.label}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 bg-white shadow-sm flex items-center px-6">
          <h1 className="text-xl text-gray-800 font-medium">Dashboard</h1>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p>Conteúdo principal aqui</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminNavigation;