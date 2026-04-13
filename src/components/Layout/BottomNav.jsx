// src/components/Layout/BottomNav.jsx
import React from 'react';
import { Home, LayoutDashboard, PlusCircle, TrendingUp } from 'lucide-react';

export default function BottomNav({ current, setNav }) {
  return (
    <nav className="bnav">
      <button className={`nb ${current === 'home' ? 'active' : ''}`} onClick={() => setNav('home')}>
        <Home size={19} />
        Inicio
      </button>
      <button className={`nb ${current === 'props' ? 'active' : ''}`} onClick={() => setNav('props')}>
        <LayoutDashboard size={19} />
        Propiedades
      </button>
      <button className={`nb ${current === 'add' ? 'active' : ''}`} onClick={() => setNav('add')}>
        <PlusCircle size={19} />
        Registrar
      </button>
      <button className={`nb ${current === 'proj' ? 'active' : ''}`} onClick={() => setNav('proj')}>
        <TrendingUp size={19} />
        Proyecciones
      </button>
    </nav>
  );
}
