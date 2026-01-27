
import React, { useMemo } from 'react';
import { User, RankingEntry } from '../types';
import { getAppData } from '../services/store';
import { POINT_RULES } from '../constants';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const data = getAppData();
  
  const currentMonthRanking = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const stats: Record<string, RankingEntry> = {};

    // Initialize all users even if they have 0 points
    const FIXED_USERS = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' },
      { id: '4', name: 'David' }
    ];

    FIXED_USERS.forEach(u => {
      stats[u.id] = {
        userId: u.id,
        userName: u.name,
        points: 0,
        postsCount: 0,
        codesCount: 0,
        validationsCount: 0,
      };
    });

    data.posts.forEach(post => {
      const date = new Date(post.timestamp);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (stats[post.userId]) {
          stats[post.userId].postsCount += 1;
          stats[post.userId].points += POINT_RULES.CREATE_POST;
          
          post.codeSnippets.forEach(code => {
            stats[post.userId].codesCount += 1;
            stats[post.userId].points += POINT_RULES.POST_CODE;

            code.validatedBy.forEach(vId => {
              if (stats[vId]) {
                stats[vId].validationsCount += 1;
                stats[vId].points += POINT_RULES.VALIDATE_CODE;
              }
            });
          });
        }
      }
    });

    return Object.values(stats).sort((a, b) => b.points - a.points);
  }, [data]);

  const userStats = currentMonthRanking.find(r => r.userId === user.id);
  const recentLogs = data.logs.slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Olá, {user.name}! 👋</h1>
          <p className="text-slate-500">Bem-vindo ao dashboard do seu grupo de estudos.</p>
        </div>
        <Link to="/feed" className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 w-fit">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Estudo
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Seu Desempenho (Mês)</h2>
            <div className="text-4xl font-bold text-indigo-600">{userStats?.points || 0} pts</div>
          </div>
          <div className="mt-6 flex justify-between text-sm">
            <div className="text-center">
              <span className="block font-bold text-slate-700">{userStats?.postsCount || 0}</span>
              <span className="text-slate-400">Estudos</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-slate-700">{userStats?.codesCount || 0}</span>
              <span className="text-slate-400">Códigos</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-slate-700">{userStats?.validationsCount || 0}</span>
              <span className="text-slate-400">Validações</span>
            </div>
          </div>
        </div>

        {/* Top Performer Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Líder do Mês 🏆</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-xl">
              {currentMonthRanking[0]?.userName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-lg text-slate-800">{currentMonthRanking[0]?.userName}</div>
              <div className="text-sm text-slate-500">{currentMonthRanking[0]?.points} pontos acumulados</div>
            </div>
          </div>
        </div>

        {/* Group Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Atividade do Grupo</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total de Estudos</span>
              <span className="font-semibold text-slate-800">{data.posts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Membros Ativos</span>
              <span className="font-semibold text-slate-800">4 / 4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Atividades Recentes</h2>
            <Link to="/logs" className="text-sm text-indigo-600 hover:underline">Ver tudo</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="p-4 flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2"></div>
                  <div>
                    <p className="text-sm text-slate-700">
                      <span className="font-bold">{log.userName}</span> {log.action.toLowerCase().replace('_', ' ')}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">Nenhuma atividade registrada ainda.</div>
            )}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">Como ganhar pontos?</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 bg-white text-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-sm">+{POINT_RULES.CREATE_POST}</span>
              <span className="text-indigo-800">Criar um post de estudo diário</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 bg-white text-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-sm">+{POINT_RULES.POST_CODE}</span>
              <span className="text-indigo-800">Anexar um bloco de código ao estudo</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 bg-white text-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-sm">+{POINT_RULES.VALIDATE_CODE}</span>
              <span className="text-indigo-800">Validar o código de um colega</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
