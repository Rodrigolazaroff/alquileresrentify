// src/components/Screens/Projections.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  RefreshCw, 
  Calendar, 
  DollarSign, 
  Maximize2, 
  AlertTriangle 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ARGENSTATS_BASE = "/api-argenstats";
const API_KEY = import.meta.env.VITE_ARGENSTATS_KEY;

export default function Projections() {
  const [rentInput, setRentInput] = useState('');
  const [frequency, setFrequency] = useState(3);
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  
  const [inflationData, setInflationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchInflation();
  }, []);

  const fetchInflation = async () => {
    setLoading(true);
    try {
      // Fetch a wide range to cover possible start dates and future projections
      const from = "2022-01-01";
      const to = new Date().toISOString().split('T')[0];
      
      const resp = await fetch(`${ARGENSTATS_BASE}/inflation?view=historical&from=${from}&to=${to}`, {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json'
        }
      });
      
      if (!resp.ok) throw new Error('Error al obtener datos de ArgenStats');
      const json = await resp.json();
      
      if (json.success && json.data) {
        // Map to a common format
        const mapped = json.data.map(d => ({
          fecha: d.date.substring(0, 7), // "YYYY-MM"
          valor: d.values.monthly,
          index: d.index
        }));
        setInflationData(mapped);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al sincronizar con ArgenStats. Usando modo offline.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '$ 0';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  const parseInputToNumber = (val) => {
    return Number(val.replace(/\D/g, ''));
  };

  const handleRentChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setRentInput('');
      return;
    }
    const num = Number(raw);
    setRentInput(new Intl.NumberFormat('es-AR').format(num));
  };

  const projections = useMemo(() => {
    const rentValue = parseInputToNumber(rentInput);
    if (inflationData.length === 0 || !rentValue || rentValue === 0) return [];

    const result = [];
    const frequencyNum = Number(frequency);
    
    // Convert start to months since epoch
    const startMonthYear = startYear * 12 + (startMonth - 1);
    
    // We need the index values to apply the formula: Rent * (Index_End / Index_Start)
    // To calculate the increase of the 1st period (e.g. Aug to Oct), 
    // we need the index of July (base) and Oct (target).
    
    const today = new Date();
    const currentMonthYear = today.getFullYear() * 12 + today.getMonth();
    
    // Show at least 2 years or until today
    const totalMonthsToShow = Math.max(currentMonthYear - startMonthYear + frequencyNum, frequencyNum * 4);
    const totalPeriods = Math.ceil(totalMonthsToShow / frequencyNum);
    
    const lastAvailable = inflationData[inflationData.length - 1];

    for (let pNum = 0; pNum < totalPeriods; pNum++) {
      const monthOffset = pNum * frequencyNum;
      const targetMonthYear = startMonthYear + monthOffset;
      
      const displayYear = Math.floor(targetMonthYear / 12);
      const displayMonth = targetMonthYear % 12;
      const periodDate = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-01`;

      if (pNum === 0) {
        // Base Period
        result.push({
          id: 1,
          label: `${frequencyNum === 3 ? 'Trim' : frequencyNum === 4 ? 'Cuatrim' : 'Per'}. 1`,
          fecha: periodDate,
          oldRent: Math.round(rentValue),
          newRent: Math.round(rentValue),
          increaseAmount: 0,
          percent: "0.00",
          breakdown: [],
          hasEstimation: false
        });
      } else {
        // Rent = BaseRent * (Index_Target / Index_Base)
        // Index_Base is the index at startMonth-1 (Jul if start is Aug)
        // Index_Target is the index at targetMonth-1 (Oct if increase is Nov)
        
        const baseMonthYear = startMonthYear - 1;
        const targetMonthYearEnd = targetMonthYear - 1;

        const baseMonthStr = `${Math.floor(baseMonthYear/12)}-${String((baseMonthYear%12)+1).padStart(2,'0')}`;
        const targetMonthStr = `${Math.floor(targetMonthYearEnd/12)}-${String((targetMonthYearEnd%12)+1).padStart(2,'0')}`;

        const baseEntry = inflationData.find(d => d.fecha === baseMonthStr);
        const targetEntry = inflationData.find(d => d.fecha === targetMonthStr);

        let multiplier;
        let hasEstimation = false;
        const monthlyDetails = [];

        if (baseEntry && targetEntry) {
          multiplier = targetEntry.index / baseEntry.index;
        } else {
          // Fallback to manual compounding if indexes are missing or estimation needed
          let manualMult = 1;
          for (let k = 0; k < monthOffset; k++) {
            const m = startMonthYear + k;
            const mStr = `${Math.floor(m/12)}-${String((m%12)+1).padStart(2,'0')}`;
            const entry = inflationData.find(d => d.fecha === mStr);
            if (entry) {
              manualMult *= (1 + entry.valor / 100);
            } else {
              manualMult *= (1 + (lastAvailable?.valor || 0) / 100);
              hasEstimation = true;
            }
          }
          multiplier = manualMult;
        }

        // Build simple breakdown for visual
        for (let k = 0; k < frequencyNum; k++) {
          const m = (startMonthYear + monthOffset - frequencyNum) + k;
          const mStr = `${Math.floor(m/12)}-${String((m%12)+1).padStart(2,'0')}`;
          const entry = inflationData.find(d => d.fecha === mStr);
          monthlyDetails.push({
            mDate: `${mStr}-01`,
            val: entry ? entry.valor : (lastAvailable?.valor || 0),
            est: !entry
          });
          if (!entry) hasEstimation = true;
        }

        const newRentValue = rentValue * multiplier;

        result.push({
          id: pNum + 1,
          label: `${frequencyNum === 3 ? 'Trim' : frequencyNum === 4 ? 'Cuatrim' : 'Per'}. ${pNum + 1}`,
          fecha: periodDate,
          oldRent: 0, // Not strictly needed for formula 1
          newRent: Math.round(newRentValue),
          increaseAmount: Math.round(newRentValue - (result[pNum-1]?.newRent || rentValue)),
          percent: ((multiplier / (result[pNum-1]?.multiplier || 1) - 1) * 100).toFixed(2),
          multiplier, // save for next loop calc if needed, but we use base rent
          breakdown: monthlyDetails,
          hasEstimation
        });
      }
    }
    
    // Fix percentages for display to show variation vs PREVIOUS rent
    for (let i = 1; i < result.length; i++) {
        const prevRent = result[i-1].newRent;
        const currRent = result[i].newRent;
        result[i].percent = (((currRent / prevRent) - 1) * 100).toFixed(2);
    }

    return result;
  }, [rentInput, frequency, startMonth, startYear, inflationData]);

  const chartData = useMemo(() => {
    if (inflationData.length === 0) return { labels: [], datasets: [] };
    const subset = inflationData.slice(-12);
    return {
      labels: subset.map(d => {
        const date = new Date(d.fecha + '-15');
        return date.toLocaleDateString('es-AR', { month: 'short' });
      }),
      datasets: [
        {
          fill: true,
          label: 'Inflación %',
          data: subset.map(d => d.valor),
          borderColor: '#6ab5ff',
          backgroundColor: 'rgba(106, 181, 255, 0.1)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#6ab5ff',
          borderWidth: 2,
        },
      ],
    };
  }, [inflationData]);

  const lastTwo = useMemo(() => {
    if (projections.length < 1) return null;
    const len = projections.length;
    return {
      prev: projections[len - 2] || projections[0],
      curr: projections[len - 1]
    };
  }, [projections]);

  const hasGeneralEstimation = useMemo(() => {
    return projections.some(p => p.hasEstimation);
  }, [projections]);

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
  const monthsList = [
    { v: 1, n: 'Enero' }, { v: 2, n: 'Febrero' }, { v: 3, n: 'Marzo' },
    { v: 4, n: 'Abril' }, { v: 5, n: 'Mayo' }, { v: 6, n: 'Junio' },
    { v: 7, n: 'Julio' }, { v: 8, n: 'Agosto' }, { v: 9, n: 'Septiembre' },
    { v: 10, n: 'Octubre' }, { v: 11, n: 'Noviembre' }, { v: 12, n: 'Diciembre' }
  ];

  return (
    <section className="sc on">
      <div className="st" style={{ textAlign: 'center', fontSize: '26px', color: '#6ab5ff', letterSpacing: '1.5px', marginBottom: '24px' }}>CALCULADORA ARGENSTATS</div>

      <div className="cd" style={{ padding: '20px', marginBottom: '24px' }}>
        <div className="sg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div className="fg">
            <label className="fl">Monto inicial</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--t2)' }}>$</span>
              <input 
                type="text" 
                className="fi" 
                style={{ paddingLeft: '28px' }}
                value={rentInput} 
                onChange={handleRentChange} 
                placeholder="0"
              />
            </div>
          </div>
          <div className="fg">
            <label className="fl">Mes Inicio</label>
            <select className="fi" value={startMonth} onChange={e => setStartMonth(Number(e.target.value))}>
              {monthsList.map(m => <option key={m.v} value={m.v}>{m.n}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="fl">Año Inicio</label>
            <select className="fi" value={startYear} onChange={e => setStartYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="fl">Frecuencia</label>
            <select className="fi" value={frequency} onChange={e => setFrequency(Number(e.target.value))}>
              {[1,2,3,4,6,12].map(n => <option key={n} value={n}>{n} {n===1?'mes':'meses'}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="cd" style={{ textAlign: 'center', padding: '40px' }}>
          <RefreshCw className="lds-dual-ring" style={{ width: 24, height: 24, color: 'var(--a)' }} />
          <div style={{ marginTop: '12px', color: 'var(--t2)' }}>Conectando con ArgenStats...</div>
        </div>
      ) : (
        <div className="home-grid">
          <div className="home-main">
            {/* SUMMARY CARDS */}
            {lastTwo && (
              <div className="sg" style={{ marginBottom: '20px' }}>
                <div className="cd" style={{ textAlign: 'center', background: 'rgba(24,24,31,.8)', border: '1px solid var(--bd)' }}>
                  <div className="lbl" style={{ color: 'var(--t2)', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Hasta</div>
                  <div style={{ color: 'var(--t3)', fontSize: '13px', marginBottom: '5px' }}>
                    {new Date(lastTwo.prev.fecha + 'T12:00:00').toLocaleDateString('es-AR', { month: 'long' })}
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '26px', fontWeight: '800' }}>{formatCurrency(lastTwo.prev.newRent)}</div>
                </div>
                <div className="cd" style={{ textAlign: 'center', background: 'rgba(106, 181, 255, 0.05)', border: '1px solid rgba(106, 181, 255, 0.3)' }}>
                  <div className="lbl" style={{ color: '#6ab5ff', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>Desde</div>
                  <div style={{ color: '#6ab5ff', opacity: .7, fontSize: '13px', marginBottom: '5px' }}>
                    {new Date(lastTwo.curr.fecha + 'T12:00:00').toLocaleDateString('es-AR', { month: 'long' })}
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '26px', fontWeight: '800', color: '#fff' }}>{formatCurrency(lastTwo.curr.newRent)}</div>
                </div>
              </div>
            )}

            {/* ATTENTION BOX */}
            {hasGeneralEstimation && (
              <div className="cd" style={{ 
                background: 'rgba(106, 181, 255, 0.1)', 
                borderColor: 'rgba(106, 181, 255, 0.3)', 
                padding: '16px', 
                marginBottom: '20px',
                borderLeft: '4px solid #6ab5ff'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <AlertTriangle style={{ color: '#6ab5ff', flexShrink: 0 }} size={20} />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '12px', color: '#fff', marginBottom: '4px' }}>DATOS ESTIMADOS:</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', lineHeight: '1.5' }}>
                      Se están usando valores proyectados para los meses donde el INDEC aún no publicó el índice oficial.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FORMULA INFO */}
            <div className="cd" style={{ padding: '12px 20px', marginBottom: '20px', border: '1px dashed rgba(255,255,255,.1)', background: 'transparent' }}>
              <div style={{ fontSize: '11px', color: 'var(--t2)', textAlign: 'center' }}>
                Fórmula aplicada: <span style={{ color: '#fff' }}>Valor Inicial * (Índice Final / Índice Inicial)</span>
              </div>
            </div>

            {/* MAIN TABLE */}
            <div className="cd" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,.03)', borderBottom: '1px solid var(--bd)' }}>
                    <th style={{ padding: '14px', textAlign: 'left', color: 'var(--t2)', fontWeight: '600' }}>Periodo</th>
                    <th style={{ padding: '14px', textAlign: 'left', color: 'var(--t2)', fontWeight: '600' }}>Fecha</th>
                    <th style={{ padding: '14px', textAlign: 'center', color: 'var(--t2)', fontWeight: '600' }}>Aumento (%)</th>
                    <th style={{ padding: '14px', textAlign: 'center', color: 'var(--t2)', fontWeight: '600' }}>Monto Aumento</th>
                    <th style={{ padding: '14px', textAlign: 'right', color: 'var(--t2)', fontWeight: '600' }}>Nuevo Valor</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map(p => (
                    <React.Fragment key={p.id}>
                      <tr 
                        onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                        style={{ borderBottom: '1px solid var(--bd)', cursor: 'pointer', transition: 'background .2s' }}
                        className="hover-row"
                      >
                        <td style={{ padding: '16px 14px', fontWeight: '500' }}>
                          {p.label}
                          {p.hasEstimation && <AlertTriangle size={10} style={{ marginLeft: '6px', color: 'var(--t3)' }} />}
                        </td>
                        <td style={{ padding: '16px 14px', color: 'var(--t2)' }}>
                          {new Date(p.fecha + 'T12:00:00').toLocaleDateString('es-AR')}
                        </td>
                        <td style={{ padding: '16px 14px', textAlign: 'center', color: 'var(--a)', fontWeight: '700' }}>{p.percent}%</td>
                        <td style={{ padding: '16px 14px', textAlign: 'center', color: 'rgba(255,255,255,.7)' }}>
                          {p.increaseAmount > 0 ? `+$ ${new Intl.NumberFormat('es-AR').format(p.increaseAmount)}` : '$ 0'}
                        </td>
                        <td style={{ padding: '16px 14px', textAlign: 'right', fontFamily: 'var(--fd)', fontWeight: '700' }}>{formatCurrency(p.newRent)}</td>
                        <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                          <div style={{ background: 'var(--a2)', color: '#fff', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                            {expandedRow === p.id ? <ChevronUp size={16} style={{margin:'0 auto'}}/> : <ChevronDown size={16} style={{margin:'0 auto'}}/>}
                          </div>
                        </td>
                      </tr>
                      
                      {expandedRow === p.id && p.breakdown.length > 0 && (
                        <tr>
                          <td colSpan="6" style={{ padding: '0', background: 'rgba(0,0,0,.15)' }}>
                            <div style={{ padding: '15px' }}>
                              <div style={{ marginBottom: '10px', fontSize: '11px', fontWeight: '600', color: 'var(--t2)' }}>Variaciones del periodo:</div>
                              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {p.breakdown.map((m, idx) => (
                                  <div key={idx} style={{ background: 'rgba(255,255,255,.05)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--bd)' }}>
                                    <div style={{ fontSize: '10px', opacity: .6 }}>{new Date(m.mDate + 'T12:00:00').toLocaleDateString('es-AR', { month: 'short' })}</div>
                                    <div style={{ fontWeight: '700', color: m.est ? 'var(--t3)' : 'var(--a)' }}>{m.val}% {m.est ? '(e)' : ''}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="home-side">
            <div className="cd">
              <div className="lbl" style={{ marginBottom: '12px' }}>Histórico IPC</div>
              <div style={{ height: '180px' }}>
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { 
                      y: { grid: { color: '#2e2e3a' }, ticks: { color: '#5a5a72', font: { size: 9 } } },
                      x: { grid: { display: false }, ticks: { color: '#5a5a72', font: { size: 9 } } }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="cd" style={{ background: 'rgba(106, 181, 255, 0.05)', borderColor: 'rgba(106, 181, 255, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Info size={16} color="#6ab5ff" />
                <div style={{ fontWeight: '700', color: '#6ab5ff', fontSize: '13px' }}>Método ArgenStats</div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--t2)', lineHeight: '1.6' }}>
                Estamos utilizando la fórmula oficial de división de índices. El sistema toma el valor exacto del índice al inicio y al final del periodo para garantizar un resultado legalmente exacto.
              </p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-row:hover { background: rgba(255,255,255,.04); }
        .hover-row:active { background: rgba(255,255,255,.08); }
        th { font-family: var(--fb); text-transform: uppercase; font-size: 10px; letter-spacing: .5px; }
      `}} />
    </section>
  );
}
