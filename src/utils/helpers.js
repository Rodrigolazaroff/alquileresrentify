// src/utils/helpers.js

export const uid = () => Math.random().toString(36).substr(2,9) + Date.now().toString(36);

export const fmt = n => (n === null || n === undefined || isNaN(n)) ? '—' : '$' + Math.round(n).toLocaleString('es-AR');
export const MES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
export const mi = m => MES.indexOf(m);

export const sortRegs = a => [...a].sort((x, y) => x.anio !== y.anio ? x.anio - y.anio : mi(x.mes) - mi(y.mes));

export const calcDesc = (r) => {
  const com = r.bruto * ((r.com_pct || 0) / 100);
  const neto = r.bruto - com;
  const diff = r.transf > 0 ? r.transf - neto : null;
  return { com, neto, diff };
};
