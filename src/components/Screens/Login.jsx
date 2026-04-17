import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function Login() {
  const { login, registerUser, showToast } = useAppContext();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // States
  const [nom, setNom] = useState('');
  const [apellido, setApellido] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!mail.trim() || !mail.includes('@')) { showToast('⚠️ Ingresá un correo válido'); return; }
    if (!password || password.length < 6) { showToast('⚠️ La clave debe tener al menos 6 caracteres'); return; }

    try {
      setLoading(true);
      if (isRegistering) {
        if (!nom.trim()) { showToast('⚠️ Ingresá tu nombre'); return; }
        if (!apellido.trim()) { showToast('⚠️ Ingresá tu apellido'); return; }
        await registerUser({ nom: nom.trim(), apellido: apellido.trim(), mail: mail.trim(), password });
      } else {
        await login({ mail: mail.trim(), password });
      }
    } catch (e) {
      showToast('⚠️ Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ls">
      <div className="lglow"></div>
      <div className="ll">Rent<b>ify</b></div>
      <div className="ltag">Gestión de alquileres<br />privado · seguro · conectado a la nube</div>
      <div className="lbox">
        <div className="ltit">{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</div>
        <div className="lsub">
          {isRegistering 
            ? 'Ingresá tus datos para empezar a gestionar tus propiedades en la nube.'
            : 'Ingresá a tu cuenta para ver tus datos sincronizados.'}
        </div>
        
        {isRegistering && (
          <div className="fr">
            <div className="fg">
              <label className="fl">Nombre</label>
              <input className="fi" placeholder="Martín" value={nom} onChange={e => setNom(e.target.value)} disabled={loading} />
            </div>
            <div className="fg">
              <label className="fl">Apellido</label>
              <input className="fi" placeholder="Pérez" value={apellido} onChange={e => setApellido(e.target.value)} disabled={loading} />
            </div>
          </div>
        )}

        <div className="fg">
          <label className="fl">Correo electrónico</label>
          <input className="fi" type="email" placeholder="ej: martin@gmail.com" value={mail} onChange={e => setMail(e.target.value)} disabled={loading} />
        </div>
        <div className="fg">
          <label className="fl">Contraseña</label>
          <input className="fi" type="password" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
        </div>

        <button className="btn bp bw" style={{ marginTop: '10px' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cargando...' : (isRegistering ? 'Registrarme →' : 'Ingresar →')}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--t2)' }}>
          {isRegistering ? '¿Ya tenés cuenta? ' : '¿No tenés cuenta? '}
          <span 
            style={{ color: 'var(--a)', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Iniciá sesión' : 'Registrate aquí'}
          </span>
        </div>
      </div>
    </div>
  );
}
