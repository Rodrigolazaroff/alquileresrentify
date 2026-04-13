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
          <div className="mb" onClick={() => setShowUserModal(false)}>
            <div className="mo" onClick={e => e.stopPropagation()}>
              <div className="mh"></div>
              <div className="mt">Mi cuenta</div>
              <div className="msb">Datos guardados en este dispositivo</div>
              <div className="sb" style={{ marginBottom: '14px' }}>
                <div className="lbl">Sesión activa</div>
                <div style={{ marginTop: '5px', fontWeight: 500, fontSize: '13px' }}>
                  {user.nom} · {user.mail}
                </div>
              </div>
              <div className="dv"></div>
              <button className="btn bd2 bw bsm" onClick={() => {
                if (window.confirm('¿Cerrar sesión? Tus datos quedan en el dispositivo.')) {
                  logout();
                  setShowUserModal(false);
                }
              }}>Cerrar sesión</button>
              <div className="fh" style={{ textAlign: 'center', marginTop: '6px' }}>⚠️ Cerrar sesión no elimina tus datos</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
