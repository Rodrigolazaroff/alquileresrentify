// src/contexts/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/db';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const u = await db.getUser();
      setUser(u);
      if (u) {
        setProperties(await db.getProperties());
        setRecords(await db.getRecords());
      }
      setLoading(false);
    }
    loadAll();
  }, []);

  const login = async (userData) => {
    const u = await db.saveUser(userData);
    setUser(u);
    setProperties(await db.getProperties());
    setRecords(await db.getRecords());
  };

  const logout = async () => {
    await db.logout();
    setUser(null);
  };

  const reloadData = async () => {
    setProperties(await db.getProperties());
    setRecords(await db.getRecords());
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      properties, records,
      reloadData, loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
