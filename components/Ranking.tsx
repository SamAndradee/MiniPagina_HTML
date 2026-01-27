
import React, { useMemo } from 'react';
import { RankingEntry } from '../types';
import { getAppData } from '../services/store';
import { POINT_RULES, FIXED_USERS } from '../constants';

const Ranking: React.FC = () => {
  const data = getAppData();
  
  const currentMonthRanking = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const stats: Record<string, RankingEntry> = {};

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

  const monthName = new Date().toLocaleString('pt-BR', { month: 'long' });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Ranking do Mês</h1>
          <p className="opacity-80">Competição saudável de {monthName} de {new Date().getFullYear()}</p>
        </div>

        <div className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Posição</th>
                  <th className="px-6 py-4">Membro</th>
                  <th className="px-6 py-4 text-center">Pontos</th>
                  <th className="px-6 py-4 text-center hidden md:table-cell">Estudos</th>
                  <th className="px-6 py-4 text-center hidden md:table-cell">Códigos</th>
                  <th className="px-6 py-4 text-center hidden md:table-cell">Validações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentMonthRanking.map((entry, index) => (
                  <tr key={entry.userId} className={`hover:bg-slate-50 transition-colors ${index === 0 ? 'bg-yellow-50/30' : ''}`}>
                    <td className="px-6 py-6 font-bold text-slate-400">
                      {index === 0 ? <span className="text-2xl">🥇</span> : index === 1 ? <span className="text-2xl">🥈</span> : index === 2 ? <span className="text-2xl">🥉</span> : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                          {entry.userName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{entry.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-lg">
                        {entry.points}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center hidden md:table-cell text-slate-600 font-medium">{entry.postsCount}</td>
                    <td className="px-6 py-6 text-center hidden md:table-cell text-slate-600 font-medium">{entry.codesCount}</td>
                    <td className="px-6 py-6 text-center hidden md:table-cell text-slate-600 font-medium">{entry.validationsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Legenda de Pontos:</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-3 h-3 bg-indigo-400 rounded-full"></span>
              Post de Estudo: <strong>+{POINT_RULES.CREATE_POST} pts</strong>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-3 h-3 bg-indigo-400 rounded-full"></span>
              Bloco de Código: <strong>+{POINT_RULES.POST_CODE} pts</strong>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-3 h-3 bg-indigo-400 rounded-full"></span>
              Validar Código: <strong>+{POINT_RULES.VALIDATE_CODE} pts</strong>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-slate-400 italic">
            * O ranking é reiniciado automaticamente no primeiro dia de cada mês.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
