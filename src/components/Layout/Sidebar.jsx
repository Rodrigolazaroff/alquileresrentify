import React from 'react';
import { Home, LayoutDashboard, PlusCircle, TrendingUp } from 'lucide-react';

export default function Sidebar({ current, setNav }) {
  const menu = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'props', label: 'Propiedades', icon: LayoutDashboard },
    { id: 'add', label: 'Registrador', icon: PlusCircle },
    { id: 'proj', label: 'Proyecciones', icon: TrendingUp },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="tb-logo" style={{ padding: '0 10px' }}>Rent<b>ify</b></div>
      </div>
      <nav className="sidebar-nav">
        {menu.map(item => (
          <button 
            key={item.id}
            className={`sidebar-btn ${current === item.id ? 'active' : ''}`}
            onClick={() => setNav(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
