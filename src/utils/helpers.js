// src/utils/helpers.js

export const uid = () => Math.random().toString(36).substr(2,9) + Date.now().toString(36);

export const fmtNum = n => {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const hasDecimals = n % 1 !== 0;
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0
  }).format(n);
};

export const fmt = n => (n === null || n === undefined || isNaN(n)) ? '—' : '$ ' + fmtNum(n);

export const formatCurrencyInput = (value) => {
  if (value === undefined || value === null) return '';
  let strVal = value.toString();
  if (!strVal) return '';
  
  strVal = strVal.replace(/[^0-9,]/g, '');
  const parts = strVal.split(',');
  if (parts.length > 2) {
    strVal = parts[0] + ',' + parts.slice(1).join('');
  }
  
  const [intPart, decPart] = strVal.split(',');
  
  let intFormatted = intPart;
  if (intPart !== '') {
    intFormatted = parseInt(intPart, 10).toString();
    intFormatted = intFormatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  let finalStr = intFormatted;
  if (decPart !== undefined) {
    finalStr = intFormatted + ',' + decPart.slice(0, 2);
  }
  return finalStr ? '$ ' + finalStr : '';
};

export const parseCurrencyValue = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const str = val.toString().replace(/\$/g, '').replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(str) || 0;
};
export const MES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
export const mi = m => {
  if (typeof m === 'number') return m - 1;
  const asNum = parseInt(m);
  if (!isNaN(asNum) && asNum >= 1 && asNum <= 12) return asNum - 1;
  return MES.indexOf(m);
};
export const getMesStr = m => {
  const idx = mi(m);
  return idx >= 0 ? MES[idx] : String(m);
};

export const sortRegs = a => [...a].sort((x, y) => x.anio !== y.anio ? x.anio - y.anio : mi(x.mes) - mi(y.mes));

export const calcDesc = (r) => {
  const com = r.bruto * ((r.com_pct || 0) / 100);
  const neto = r.bruto - com;
  const diff = r.transf > 0 ? r.transf - neto : null;
  return { com, neto, diff };
};
