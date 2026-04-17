import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAppContext } from '../../contexts/AppContext';

export default function PropertyModal({ isOpen, onClose, editId }) {
  const { properties, reloadData, showToast } = useAppContext();
  const [loading, setLoading] = useState(false);

  // Form state
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Casa');
  const [comDef, setComDef] = useState(0);
  const [inq, setInq] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editId) {
        const p = properties.find(x => x.id === editId);
        if (p) {
          setNombre(p.nombre || '');
          setTipo(p.tipo || 'Casa');
          setComDef(p.com_def || 0);
          setInq(p.inq || '');
        }
      } else {
        setNombre('');
        setTipo('Casa');
        setComDef(0);
        setInq('');
      }
    }
  }, [isOpen, editId, properties]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!nombre.trim()) {
      showToast('⚠️ Ingresá el nombre/dirección');
      return;
    }

    try {
      setLoading(true);
      await db.saveProperty({
        id: editId || null,
        nombre: nombre.trim(),
        tipo,
        com_def: parseFloat(comDef) || 0,
        inq: inq.trim()
      });
      await reloadData();
      showToast(editId ? '✅ Propiedad actualizada' : '✅ Propiedad guardada');
      onClose();
    } catch (e) {
      showToast('⚠️ Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb" onClick={onClose} style={{ zIndex: 1000 }}>
      {/* Detener la propagación del click para no cerrar al dar click dentro del modal  */}
      <div className="mo" onClick={e => e.stopPropagation()}>
        <div className="mh"></div>
        <div className="mt">{editId ? 'Editar propiedad' : 'Nueva propiedad'}</div>
        <div className="msb">Datos del inmueble</div>
        
        <div className="fg">
          <label className="fl">Nombre / Dirección</label>
          <input className="fi" placeholder="ej: Casa Palermo" value={nombre} onChange={e => setNombre(e.target.value)} disabled={loading} />
        </div>
        
        <div className="fr">
          <div className="fg">
            <label className="fl">Tipo</label>
            <select className="fi" value={tipo} onChange={e => setTipo(e.target.value)} disabled={loading}>
              <option>Casa</option>
              <option>Departamento</option>
              <option>Local comercial</option>
              <option>Oficina</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Comisión default (%)</label>
            <input className="fi" type="number" step="0.5" value={comDef} onChange={e => setComDef(e.target.value)} disabled={loading} />
          </div>
        </div>
        
        <div className="fg">
          <label className="fl">Inquilino (opcional)</label>
          <input className="fi" placeholder="Nombre" value={inq} onChange={e => setInq(e.target.value)} disabled={loading} />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button className="btn bs bw" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn bp bw" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );
}
