// src/components/Screens/Home.jsx
import React, { useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { fmt, sortRegs, calcDesc, mi } from '../../utils/helpers';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const { properties, records } = useAppContext();
  
  const allRegs = useMemo(() => sortRegs(records), [records]);
  const hasProps = properties.length > 0;

  let netoU = 0, lastP = '—', anual = 0;
  const yr = new Date().getFullYear();

  if (allRegs.length) {
    const last = allRegs[allRegs.length - 1];
    lastP = `${last.mes} ${last.anio}`;
    allRegs.filter(r => r.mes === last.mes && r.anio === last.anio).forEach(r => netoU += calcDesc(r).neto);
    anual = allRegs.filter(r => r.anio === yr).reduce((s, r) => s + calcDesc(r).neto, 0);
  }

  // Chart data calculation
  const chartData = useMemo(() => {
    if (!allRegs.length) return null;
    const bp = {};
    allRegs.forEach(r => {
      const k = `${r.mes} ${String(r.anio).slice(2)}`;
      if (!bp[k]) bp[k] = { n: 0, o: r.anio * 100 + mi(r.mes) };
      bp[k].n += calcDesc(r).neto;
    });
    const sl = Object.entries(bp).sort((a,b) => a[1].o - b[1].o).slice(-12);
    return {
      labels: sl.map(e => e[0]),
      datasets: [{
        data: sl.map(e => Math.round(e[1].n)),
        backgroundColor: 'rgba(200,240,74,.18)',
        borderColor: '#c8f04a',
        borderWidth: 2,
        borderRadius: 5
      }]
    };
  }, [allRegs]);

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
      x: { ticks: { color: '#5a5a72', font: { size: 9 } }, grid: { color: '#2e2e3a' } },
      y: { ticks: { color: '#5a5a72', font: { size: 9 }, callback: v => '$ ' + (v / 1000).toFixed(0) + 'k' }, grid: { color: '#2e2e3a' } }
    }
  };

  const getPropNet = (pid) => {
    const rs = sortRegs(records.filter(x => x.propId === pid));
    const last = rs[rs.length - 1];
    return last ? { last, net: calcDesc(last).neto } : null;
  };

  return (
    <section className="sc on">
      <div className="hr">
        <div>
          <div className="st">Inicio</div>
          <div className="ss">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
      </div>
      
      {!hasProps ? (
        <div className="emp">
          <div className="ei">🏘️</div>
          <div className="et">Sin propiedades</div>
          <div className="ex">Agregá tu primera propiedad en la solapa Propiedades para empezar.</div>
        </div>
      ) : (
        <div className="home-grid">
          <div className="home-main">
            <div className="sg">
              <div className="sb"><div className="lbl">Neto {lastP}</div><div className="bnum" style={{ fontSize: '19px', marginTop: '5px', color: 'var(--a)' }}>{fmt(netoU)}</div></div>
              <div className="sb"><div className="lbl">Acumulado {yr}</div><div className="bnum" style={{ fontSize: '19px', marginTop: '5px' }}>{anual > 0 ? fmt(anual) : '—'}</div></div>
            </div>
            <div className="sg">
              <div className="sb"><div className="lbl">Propiedades</div><div className="bnum" style={{ fontSize: '24px', marginTop: '5px', color: 'var(--a2)' }}>{properties.length}</div></div>
              <div className="sb"><div className="lbl">Meses cargados</div><div className="bnum" style={{ fontSize: '24px', marginTop: '5px' }}>{allRegs.length}</div></div>
            </div>

            {chartData && (
              <div className="cd">
                <div className="lbl" style={{ marginBottom: '7px' }}>Ingreso neto mensual</div>
                <div className="cw"><Bar data={chartData} options={chartOpts} /></div>
              </div>
            )}
          </div>

          <div className="home-side">
            <div className="lbl" style={{ marginBottom: '10px' }}>Propiedades</div>
            <div>
              {properties.map(p => {
                const pData = getPropNet(p.id);
                return (
                  <div key={p.id} className="pc">
                    <div className="ph">
                      <div><div className="pn">{p.nombre}</div><div className="pt">{p.tipo}{p.inq ? ' · ' + p.inq : ''}</div></div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--fd)', fontWeight: '700', fontSize: '15px', color: 'var(--a)' }}>{pData ? fmt(pData.net) : '—'}</div>
                        <div className="pt">{pData ? `${pData.last.mes} ${pData.last.anio}` : 'Sin registros'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
