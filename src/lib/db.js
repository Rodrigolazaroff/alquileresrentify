// lib/db.js
// Esta capa abstrae el almacenamiento local usando Promesas para simular asincronía.
// Esto permite que el día de mañana, al conectar Supabase, los componentes de React
// no necesiten cambiar, solo este archivo.

const DK = 'rentify_mvp_v1';
const UK = 'rentify_user_v1';

// Simulamos asincronía para preparar la UI para peticiones de red reales
const delay = (ms = 100) => new Promise(r => setTimeout(r, ms));

function loadRaw() {
  try {
    const r = localStorage.getItem(DK) || localStorage.getItem(DK + '_b');
    if (!r) return { props: [], regs: [] };
    const p = JSON.parse(r);
    return { props: p.props || [], regs: p.regs || [] };
  } catch {
    return { props: [], regs: [] };
  }
}

function saveRaw(data) {
  try {
    const j = JSON.stringify(data);
    localStorage.setItem(DK, j);
    localStorage.setItem(DK + '_b', j);
  } catch (e) {
    console.error('Error guardando DB', e);
  }
}

export const db = {
  // USER
  async getUser() {
    await delay();
    try {
      const u = localStorage.getItem(UK);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  async saveUser(user) {
    await delay();
    localStorage.setItem(UK, JSON.stringify(user));
    return user;
  },
  async logout() {
    await delay();
    localStorage.removeItem(UK);
  },

  // PROPERTIES
  async getProperties() {
    await delay();
    return loadRaw().props;
  },
  async saveProperty(prop) {
    await delay();
    const d = loadRaw();
    const idx = d.props.findIndex(p => p.id === prop.id);
    if (idx >= 0) d.props[idx] = prop;
    else d.props.push(prop);
    saveRaw(d);
    return prop;
  },
  async deleteProperty(id) {
    await delay();
    const d = loadRaw();
    d.props = d.props.filter(p => p.id !== id);
    d.regs = d.regs.filter(r => r.propId !== id);
    saveRaw(d);
    return true;
  },

  // RECORDS
  async getRecords() {
    await delay();
    return loadRaw().regs;
  },
  async saveRecord(record) {
    await delay();
    const d = loadRaw();
    d.regs.push(record);
    saveRaw(d);
    return record;
  },
  async deleteRecord(id) {
    await delay();
    const d = loadRaw();
    d.regs = d.regs.filter(r => r.id !== id);
    saveRaw(d);
    return true;
  }
};
