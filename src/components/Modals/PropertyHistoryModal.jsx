import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { fmt, sortRegs, calcDesc } from '../../utils/helpers';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { db } from '../../lib/db';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function PropertyHistoryModal({ isOpen, onClose, propId }) {
  const { properties, records, reloadData, showToast } = useAppContext();
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const property = useMemo(() => properties.find(p => p.id === propId), [properties, propId]);
  
  const propRecords = useMemo(() => {
    if (!propId) return [];
    return sortRegs(records.filter(r => r.propId === propId));
  }, [records, propId]);

  if (!isOpen || !property) return null;

  const tn = propRecords.reduce((s, r) => s + calcDesc(r).neto, 0);
  const tc = propRecords.reduce((s, r) => s + calcDesc(r).com, 0);

  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const getMesName = (val) => {
    if (typeof val === 'number') return MESES[val - 1] || val;
    return val;
  };

  const chartData = {
    labels: propRecords.map(r => `${getMesName(r.mes)} ${String(r.anio).slice(2)}`),
    datasets: [{
      data: propRecords.map(r => Math.round(calcDesc(r).neto)),
      borderColor: '#c8f04a',
      backgroundColor: 'rgba(200,240,74,.06)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#c8f04a',
      pointRadius: 3
    }]
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: c => fmt(c.raw) },
        backgroundColor: '#18181f', borderColor: '#2e2e3a', borderWidth: 1, titleColor: '#9090a8', bodyColor: '#f0f0f5'
      }
    },
    scales: {
      x: { ticks: { color: '#5a5a72', font: { size: 9 } }, grid: { display: false } },
      y: { ticks: { color: '#5a5a72', font: { size: 9 }, callback: v => '$ ' + (v / 1000).toFixed(0) + 'k' }, grid: { color: '#2e2e3a' } }
    }
  };

  const fmtD = n => {
    if (n === null) return <span className="chip">Sin confirmar</span>;
    return <span className={`chip ${n >= 0 ? 'g' : 'r'}`}>{n >= 0 ? '+' : ''}{fmt(n)}</span>;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try {
      await db.deleteRecord(id);
      setSelectedRecordId(null); // Cerrar el detalle primero
      
      setTimeout(async () => {
        showToast('🗑 Registro eliminado');
        await reloadData();
      }, 150);
    } catch (e) {
      showToast('⚠️ Error eliminando: ' + e.message);
    }
  };

  const rSelected = selectedRecordId ? propRecords.find(x => x.id === selectedRecordId) : null;
  const cSelected = rSelected ? calcDesc(rSelected) : null;

  return (
    <div className="mb" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="mo" onClick={e => e.stopPropagation()}>
        <div className="mh"></div>

        {/* VISTA: DETALLE DE UN MES */}
        <div style={{ display: rSelected ? 'block' : 'none' }}>
          {rSelected && (
            <>
              <div className="mt">{getMesName(rSelected.mes)} {rSelected.anio}</div>
              <div className="msb">{property.nombre}</div>
              
              <div className="db">
                <div className="br"><span className="k">Alquiler bruto</span><span className="v">{fmt(rSelected.bruto)}</span></div>
                {rSelected.com_pct > 0 
                  ? <div className="br"><span className="k">Comisión ({rSelected.com_pct}%)</span><span className="v" style={{ color: 'var(--rd)' }}>−{fmt(cSelected.com)}</span></div>
                  : <div className="br"><span className="k">Comisión</span><span className="v" style={{ color: 'var(--t3)' }}>Sin comisión</span></div>
                }
                <div className="br tot"><span className="k">Ingreso Neto</span><span className="v">{fmt(cSelected.neto)}</span></div>
                <div className="br" style={{ marginTop: '4px' }}><span className="k">Importe transferido</span><span className="v">{rSelected.transf > 0 ? fmt(rSelected.transf) : '—'}</span></div>
                <div className="br"><span className="k">Diferencia</span><span className="v">{fmtD(cSelected.diff)}</span></div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className="btn bg bw bsm" onClick={() => setSelectedRecordId(null)}>Volver</button>
                <button className="btn bd2 bw bsm" onClick={() => handleDelete(rSelected.id)}>Eliminar</button>
              </div>
            </>
          )}
        </div>

        {/* VISTA: LISTADO HISTÓRICO */}
        <div style={{ display: !rSelected ? 'block' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
            <div>
              <div className="mt">{property.nombre}</div>
              <div className="msb">{property.tipo}{property.inq ? ' · ' + property.inq : ''}</div>
            </div>
          </div>
          
          <div className="sg" style={{ marginBottom: '12px' }}>
            <div className="sb">
              <div className="lbl">Neto total</div>
              <div style={{ fontFamily: 'var(--fd)', fontWeight: '800', fontSize: '17px', color: 'var(--a)', marginTop: '3px' }}>{fmt(tn)}</div>
            </div>
            <div className="sb">
              <div className="lbl">Comisiones</div>
              <div style={{ fontFamily: 'var(--fd)', fontWeight: '800', fontSize: '17px', color: 'var(--rd)', marginTop: '3px' }}>{fmt(tc)}</div>
            </div>
          </div>

          {propRecords.length > 0 ? (
            <>
              <div className="cd" style={{ padding: '11px', marginBottom: '10px' }}>
                <div className="lbl" style={{ marginBottom: '5px' }}>Evolución neta</div>
                <div className="cw">
                  <Line data={chartData} options={chartOpts} />
                </div>
              </div>
              <div className="lbl" style={{ marginBottom: '7px' }}>Historial</div>
              {propRecords.map(r => {
                const c = calcDesc(r);
                const dc = c.diff === null ? 'var(--t3)' : c.diff >= 0 ? 'var(--gr)' : 'var(--rd)';
                return (
                  <div key={r.id} className="mr" onClick={() => setSelectedRecordId(r.id)} style={{ cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '13px' }}>{getMesName(r.mes)} {r.anio}</div>
                      <div style={{ fontSize: '10px', color: 'var(--t3)' }}>{fmt(r.bruto)} bruto</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--fd)', fontWeight: '700', fontSize: '13px', color: 'var(--a)' }}>{fmt(c.neto)}</div>
                      <div style={{ fontSize: '10px', color: dc }}>
                        {c.diff === null ? '—' : (c.diff >= 0 ? '+' : '') + fmt(c.diff)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div style={{ color: 'var(--t3)', fontSize: '13px', padding: '16px 0', textAlign: 'center' }}>Sin registros aún</div>
          )}

          <button 
            className="btn bs bw" 
            style={{ marginTop: '12px' }} 
            onClick={onClose}
          >
            Cerrar Historial
          </button>
        </div>
      </div>
    </div>
  );
}
