import React, { useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Topbar from './components/Layout/Topbar';
import BottomNav from './components/Layout/BottomNav';
import Login from './components/Screens/Login';

// Placeholder empty screens for checking build
import Home from './components/Screens/Home';
import PropertiesList from './components/Screens/PropertiesList';
import AddRecord from './components/Screens/AddRecord';
import Projections from './components/Screens/Projections';

function AppContent() {
  const { user, loading, toast } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState('home');

  if (loading) return null;

  return (
    <>
      {!user ? <Login /> : (
        <div id="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Topbar />
          <main className="main">
            {currentScreen === 'home' && <Home />}
            {currentScreen === 'props' && <PropertiesList />}
            {currentScreen === 'add' && <AddRecord />}
            {currentScreen === 'proj' && <Projections />}
          </main>
          <BottomNav current={currentScreen} setNav={setCurrentScreen} />
        </div>
      )}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
