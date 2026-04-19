// src/components/Layout/Topbar.jsx
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function Topbar() {
  const { user, logout, updateProfile, showToast } = useAppContext();
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Local form state
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');

  React.useEffect(() => {
    if (showUserModal && user) {
      setFName(user.first_name || '');
      setLName(user.last_name || '');
    }
  }, [showUserModal, user]);

  if (!user) return null;

  // Initials calculation
  const getInitials = () => {
    const n = user.first_name || '';
    const l = user.last_name || '';
    if (!n && !l) return user.nom?.substring(0, 2).toUpperCase() || '??';
    return (n[0] || '') + (l[0] || '').toUpperCase();
  };

  const currentFirstName = user.first_name || user.nom?.split(' ')[0] || 'Usuario';

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile({ first_name: fName, last_name: lName });
      showToast('✅ Perfil actualizado');
      // No cerramos el modal para que el usuario vea el cambio, o podemos cerrarlo si preferís.
      // Por ahora lo mantengo abierto para feedback visual directo.
    } catch (e) {
      showToast('⚠️ Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="tb">
        <div className="tb-logo">Rent<b>ify</b></div>
        <div className="tb-user" onClick={() => setShowUserModal(true)}>
          <div className="av" id="tb-av">{getInitials()}</div>
          <div className="un" id="tb-nm">{currentFirstName}</div>
        </div>
      </header>

      {/* User Modal */}
      {showUserModal && (
        <div id="m-user" style={{ display: 'block' }}>
          <div className="mb" onClick={() => setShowUserModal(false)} style={{ zIndex: 1000 }}>
            <div className="mo" onClick={e => e.stopPropagation()}>
              <div className="mh"></div>
              
              <div className="mt" style={{ textAlign: 'center' }}>Mi cuenta</div>

              {/* PROFILE HEADER (READ ONLY) */}
              <div className="cd cd-a" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', marginTop: '14px', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="av" style={{ width: '52px', height: '52px', fontSize: '18px', border: '2px solid rgba(255,255,255,0.1)' }}>{getInitials()}</div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div className="chip a" style={{ padding: '1px 7px', fontSize: '9px' }}>SINCRONIZADO</div>
                       </div>
                       <div style={{ fontFamily: 'var(--fd)', fontSize: '17px', fontWeight: '800', color: 'var(--tx)', marginTop: '2px' }}>{user.nom}</div>
                       <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '1px' }}>{user.mail}</div>
                    </div>
                 </div>
              </div>

              {/* EDITABLE SECTION: MIS DATOS */}
              <div style={{ marginTop: '24px' }}>
                <div className="lbl" style={{ marginBottom: '12px', color: 'var(--tx)', fontSize: '11px' }}>Mis datos</div>
                
                <div className="fr">
                  <div className="fg">
                    <label className="fl">Nombre</label>
                    <input className="fi" value={fName} onChange={e => setFName(e.target.value)} placeholder="Nombre" />
                  </div>
                  <div className="fg">
                    <label className="fl">Apellido</label>
                    <input className="fi" value={lName} onChange={e => setLName(e.target.value)} placeholder="Apellido" />
                  </div>
                </div>

                <div className="fg" style={{ marginTop: '4px' }}>
                  <label className="fl">Correo electrónico</label>
                  <input className="fi" value={user.mail} readOnly style={{ background: 'var(--s1)', color: 'var(--t3)', cursor: 'not-allowed', borderStyle: 'dashed' }} />
                </div>

                <button className="btn bp bw" style={{ marginTop: '12px' }} onClick={handleSave} disabled={loading}>
                  {loading && <div className="lds-dual-ring"></div>}
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>

              <div className="dv" style={{ margin: '28px 0 16px' }}></div>
              
              <button className="btn bd2 bw" style={{ padding: '10px' }} onClick={() => {
                if (window.confirm('¿Seguro querés cerrar tu sesión en Rentify?')) {
                  logout();
                  setShowUserModal(false);
                }
              }}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
