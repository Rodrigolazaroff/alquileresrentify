// src/components/Screens/AddRecord.jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { db } from '../../lib/db';
import { formatCurrencyInput, parseCurrencyValue } from '../../utils/helpers';

export default function AddRecord() {
  const { properties, reloadData, showToast } = useAppContext();
  const [loading, setLoading] = useState(false);
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    propId: '',
    mes: currentMonth,
    anio: currentYear,
    bruto: '',
    com_pct: '',
    transf: ''
  });

  // Calculate transference automatically when bruto or com_pct changes
  useEffect(() => {
    let b = parseCurrencyValue(form.bruto) || 0;
    let c = parseFloat(form.com_pct) || 0;
    
    // Sólo recalcula si hay al menos bruto
    if (form.bruto !== '') {
      let t = b - (b * (c / 100));
      t = Math.round(t * 100) / 100;
      let str = t.toString().replace('.', ',');
      setForm(prev => ({ ...prev, transf: formatCurrencyInput(str) }));
    } else {
      setForm(prev => ({ ...prev, transf: '' }));
    }
  }, [form.bruto, form.com_pct]);

  const handlePropChange = (e) => {
    const pId = e.target.value;
    const prop = properties.find(p => p.id === pId);
    setForm(prev => ({ 
      ...prev, 
      propId: pId, 
      com_pct: prop ? prop.com_def : '' 
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMoneyChange = (e) => {
    setForm({ ...form, [e.target.name]: formatCurrencyInput(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.propId || !form.mes || !form.anio || form.bruto === '') {
      showToast('⚠️ Por favor revisá los datos ingresados');
      return;
    }
    
    try {
      setLoading(true);
      await db.saveRecord({
        propId: form.propId,
        mes: parseInt(form.mes),
        anio: parseInt(form.anio),
        bruto: parseCurrencyValue(form.bruto),
        com_pct: parseFloat(form.com_pct) || 0,
        transf: parseCurrencyValue(form.transf) || 0
      });
      await reloadData();
      showToast('✅ Registro guardado exitosamente');
      setForm(prev => ({
        ...prev,
        bruto: '',
        transf: ''
      }));
    } catch (err) {
      console.error(err);
      showToast('❌ Error al guardar: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sc on">
      <div className="st">Registrador</div>
      <div className="ss">Cargar pagos y retenciones del período</div>
      
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {properties.length === 0 ? (
          <div className="emp">
            <div className="ei">🏢</div>
            <div className="et">No tenés propiedades</div>
            <div className="ex">Cargá tu primera propiedad en la cartera para empezar a registrarle pagos.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="cd cd-a">
            <div className="fg">
              <label className="fl">Propiedad a imputar</label>
              <select name="propId" value={form.propId} onChange={handlePropChange} className="fi" required>
                <option value="">-- Seleccionar Propiedad --</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div className="fr">
              <div className="fg">
                <label className="fl">Mes</label>
                <select name="mes" value={form.mes} onChange={handleChange} className="fi" required>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
              <div className="fg">
                <label className="fl">Año</label>
                <input type="number" name="anio" value={form.anio} onChange={handleChange} className="fi" required />
              </div>
            </div>

            <div className="dv"></div>

            <div className="fg">
              <label className="fl">Ingreso Bruto</label>
              <input type="text" name="bruto" value={form.bruto} onChange={handleMoneyChange} className="fi" placeholder="Monto total pagado" required />
              <div className="fh" style={{ color: 'var(--a)' }}>Monto base antes de comisiones</div>
            </div>

            <div className="fr">
              <div className="fg">
                <label className="fl">Tu Comisión (%)</label>
                <input type="number" step="0.01" name="com_pct" value={form.com_pct} onChange={handleChange} className="fi" placeholder="0" />
              </div>
              <div className="fg">
                <label className="fl">Neto a Propietario</label>
                <input type="text" name="transf" value={form.transf} onChange={handleMoneyChange} className="fi" placeholder="Calculado auto" />
              </div>
            </div>

            <div style={{ marginTop: '22px' }}>
              <button type="submit" className="btn bp bw" disabled={loading} style={{ padding: '12px', fontSize: '14px', fontWeight: '700' }}>
                {loading && <div className="lds-dual-ring" style={{ borderLeftColor: '#000', borderRightColor: '#000' }}></div>}
                {loading ? 'Guardando...' : 'Registrar Pago'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
