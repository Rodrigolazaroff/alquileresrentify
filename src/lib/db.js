import { supabase } from './supabase';

export const db = {
  // USER
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return { 
      id: user.id, 
      mail: user.email, 
      nom: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() 
    };
  },
  async login({ mail, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: mail, 
      password 
    });
    if (error) throw error;
    return this.getUser();
  },
  async register({ nom, apellido, mail, password }) {
    const { data, error } = await supabase.auth.signUp({
      email: mail,
      password: password,
      options: {
        data: {
          first_name: nom,
          last_name: apellido
        }
      }
    });
    if (error) throw error;
    return this.getUser();
  },
  async logout() {
    await supabase.auth.signOut();
  },

  // PROPERTIES
  async getProperties() {
    const { data, error } = await supabase.from('properties').select('*').order('nombre', { ascending: true });
    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
    return data || [];
  },
  async saveProperty(prop) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    if (prop.id) {
      const { data, error } = await supabase.from('properties').update({
        nombre: prop.nombre,
        tipo: prop.tipo,
        com_def: prop.com_def || 0,
        inq: prop.inq
      }).eq('id', prop.id).select().single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from('properties').insert([{
        nombre: prop.nombre,
        tipo: prop.tipo,
        com_def: prop.com_def || 0,
        inq: prop.inq,
        user_id: user.id
      }]).select().single();
      if (error) throw error;
      return data;
    }
  },
  async deleteProperty(id) {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // RECORDS
  async getRecords() {
    const { data, error } = await supabase.from('records').select('*').order('anio', { ascending: false }).order('mes', { ascending: false });
    if (error) {
      console.error('Error fetching records:', error);
      return [];
    }
    return (data || []).map(r => ({
      ...r,
      propId: r.propId || r.propid
    }));
  },
  async saveRecord(record) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    if (record.id) {
      const { data, error } = await supabase.from('records').update({
        mes: record.mes,
        anio: record.anio,
        bruto: record.bruto,
        com_pct: record.com_pct || 0,
        transf: record.transf || 0
      }).eq('id', record.id).select().single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from('records').insert([{
        propid: record.propId,
        mes: record.mes,
        anio: record.anio,
        bruto: record.bruto,
        com_pct: record.com_pct || 0,
        transf: record.transf || 0,
        user_id: user.id
      }]).select().single();
      if (error) throw error;
      return data;
    }
  },
  async deleteRecord(id) {
    const { error } = await supabase.from('records').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
