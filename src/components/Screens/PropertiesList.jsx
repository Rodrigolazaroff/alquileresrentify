// src/components/Screens/PropertiesList.jsx
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { fmt, sortRegs, calcDesc } from '../../utils/helpers';
import { db } from '../../lib/db';
import PropertyModal from '../Modals/PropertyModal';

export default function PropertiesList() {
  const { properties, records, reloadData, showToast } = useAppContext();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);

  const handleEdit = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar propiedad y registros?')) return;
    try {
      await db.deleteProperty(id);
      showToast('🗑 Propiedad eliminada');
      reloadData();
    } catch (e) {
      showToast('⚠️ Error eliminando: ' + e.message);
    }
  };

  const openAddProp = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  if (!properties.length) {
    return (
      <section className="sc on">
        <div className="emp">
          <div className="ei">🏘️</div>
          <div className="et">Sin propiedades</div>
          <button className="btn bp" onClick={openAddProp}>+ Agregar</button>
        </div>
        <PropertyModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          editId={editingId} 
        />
      </section>
    );
  }

  return (
    <section className="sc on">
      <div className="hr">
        <div><div className="st">Propiedades</div><div className="ss">Tu cartera</div></div>
        <button className="btn bp bsm" onClick={openAddProp}>+ Nueva</button>
      </div>

      <div>
        {properties.map(p => {
          const rs = records.filter(r => r.propId === p.id);
          const tn = rs.reduce((s, r) => s + calcDesc(r).neto, 0);

          return (
            <div key={p.id} className="pc">
              <div className="ph">
                <div><div className="pn">{p.nombre}</div><div className="pt">{p.tipo}{p.inq ? ' · ' + p.inq : ''}</div></div>
                <div className="pa">
                  <button className="btn bg bsm" onClick={e => { e.stopPropagation(); handleEdit(p.id); }}>✏️</button>
                  <button className="btn bd2 bsm" onClick={e => { e.stopPropagation(); handleDelete(p.id); }}>🗑</button>
                </div>
              </div>
              <div className="dv" style={{ margin: '9px 0 7px' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div className="lbl">Total neto</div><div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: '15px', marginTop: '3px', color: 'var(--a)' }}>{fmt(tn)}</div></div>
                <div style={{ textAlign: 'right' }}><div className="lbl">Registros</div><div style={{ fontWeight: 600, marginTop: '3px', fontSize: '13px' }}>{rs.length} meses</div></div>
              </div>
              <button className="btn bs bw bsm" style={{ marginTop: '9px' }} onClick={() => alert('View History')}>Ver historial →</button>
            </div>
          );
        })}
      </div>
      
      <PropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editId={editingId} 
      />
    </section>
  );
}
