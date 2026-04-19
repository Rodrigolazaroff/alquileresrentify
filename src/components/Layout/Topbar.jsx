// src/components/Layout/Topbar.jsx
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function Topbar() {
  const { user, logout } = useAppContext();
  const [showUserModal, setShowUserModal] = useState(false);

  if (!user) return null;
  const init = user.nom.split(' ').map(w => w[0]).join('').toUpperCase().substr(0, 2);
  const firstName = user.nom.split(' ')[0];

  return (
    <>
      <header className="tb">
        <div className="tb-logo">Rent<b>ify</b></div>
        <div className="tb-user" onClick={() => setShowUserModal(true)}>
          <div className="av" id="tb-av">{init}</div>
          <div className="un" id="tb-nm">{firstName}</div>
        </div>
      </header>

      {/* User Modal */}
      {showUserModal && (
        <div id="m-user" style={{ display: 'block' }}>
          <div className="mb" onClick={() => setShowUserModal(false)} style={{ zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
            <div className="mo" onClick={e => e.stopPropagation()} style={{ maxHeight: '86vh', width: '92%', maxWidth: '380px', borderRadius: '20px', borderBottom: '1px solid var(--bd)', animation: 'fi 0.25s ease' }}>
              <div className="mh"></div>
              <div className="mt" style={{ textAlign: 'center' }}>Mi cuenta</div>
              <div className="msb" style={{ textAlign: 'center' }}>Sincronizado en la nube (Supabase)</div>
              
              <div className="cd cd-a" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', marginTop: '20px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="av" style={{ width: '44px', height: '44px', fontSize: '16px' }}>{init}</div>
                    <div>
                       <div className="lbl" style={{ marginBottom: '2px' }}>Sesión Activa</div>
                       <div style={{ fontFamily: 'var(--fd)', fontSize: '15px', fontWeight: '800', color: 'var(--tx)' }}>{user.nom}</div>
                       <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '2px' }}>{user.mail}</div>
                    </div>
                 </div>
              </div>

              <div className="dv" style={{ margin: '22px 0 16px' }}></div>
              <button className="btn bd2 bw" style={{ padding: '10px' }} onClick={() => {
                if (window.confirm('¿Seguro querés cerrar tu sesión en Rentify?')) {
                  logout();
                  setShowUserModal(false);
                }
              }}>Cerrar sesión</button>
              <div className="fh" style={{ textAlign: 'center', marginTop: '10px' }}>Tus propiedades y registros están a salvo en la base de datos.</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
