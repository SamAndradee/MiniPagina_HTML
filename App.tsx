
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';
import { getCurrentUser, checkMonthlyReset } from './services/store';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import StudyFeed from './components/StudyFeed';
import Ranking from './components/Ranking';
import ActivityFeed from './components/ActivityFeed';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    checkMonthlyReset();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/feed" element={<StudyFeed user={user} />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/logs" element={<ActivityFeed />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} DevStudy Group - Grupo de Estudos Programação
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
