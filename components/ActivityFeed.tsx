
import React from 'react';
import { getAppData } from '../services/store';

const ActivityFeed: React.FC = () => {
  const data = getAppData();
  const logs = data.logs;

  const getActionDetails = (action: string) => {
    switch(action) {
      case 'CREATED_POST': return { label: 'criou um novo registro de estudo', color: 'bg-blue-100 text-blue-600', icon: '📝' };
      case 'POSTED_CODE': return { label: 'postou um bloco de código', color: 'bg-purple-100 text-purple-600', icon: '💻' };
      case 'VALIDATED_CODE': return { label: 'validou um código de colega', color: 'bg-emerald-100 text-emerald-600', icon: '✅' };
      default: return { label: 'realizou uma ação', color: 'bg-slate-100 text-slate-600', icon: '⚡' };
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Logs de Atividade</h1>
        <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">Exibindo últimas 100 ações</span>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
        
        <div className="space-y-8">
          {logs.length > 0 ? (
            logs.map((log) => {
              const details = getActionDetails(log.action);
              return (
                <div key={log.id} className="relative pl-14 group">
                  <div className="absolute left-[1.125rem] top-0 w-4 h-4 rounded-full border-4 border-slate-50 bg-indigo-500 group-hover:scale-125 transition-transform z-10"></div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-lg mr-2">{details.icon}</span>
                        <span className="font-bold text-slate-800">{log.userName}</span>
                        <span className="text-slate-600 ml-2">{details.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                        {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-slate-400">
                        {new Date(log.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="pl-14 italic text-slate-400">Nenhum log registrado até o momento.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
