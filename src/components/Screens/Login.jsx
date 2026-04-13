// src/components/Screens/Login.jsx
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export default function Login() {
  const { login } = useAppContext();
  const [nom, setNom] = useState('');
  const [mail, setMail] = useState('');

  const doLogin = () => {
    if (!nom.trim()) { alert('⚠️ Ingresá tu nombre'); return; }
    if (!mail.trim() || !mail.includes('@')) { alert('⚠️ Ingresá un correo válido'); return; }
    login({ nom: nom.trim(), mail: mail.trim() });
  };

  return (
    <div className="ls">
      <div className="lglow"></div>
      <div className="ll">Rent<b>ify</b></div>
      <div className="ltag">Gestión de alquileres<br />offline · privado · sin cuenta</div>
      <div className="lbox">
        <div className="ltit">Bienvenido/a</div>
        <div className="lsub">Ingresá tus datos para personalizar la app. No se envía ninguna información a la nube todavía.</div>
        <div className="fg">
          <label className="fl">Tu nombre</label>
          <input className="fi" placeholder="ej: Martín" value={nom} onChange={e => setNom(e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Correo electrónico</label>
          <input className="fi" type="email" placeholder="ej: martin@gmail.com" value={mail} onChange={e => setMail(e.target.value)} />
          <div className="fh">Solo para identificarte. Sin verificación.</div>
        </div>
        <button className="btn bp bw" style={{ marginTop: '10px' }} onClick={doLogin}>Ingresar →</button>
      </div>
    </div>
  );
}
