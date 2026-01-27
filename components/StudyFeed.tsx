
import React, { useState, useEffect } from 'react';
import { User, StudyPost, CodeSnippet, ActivityLog } from '../types';
import { getAppData, addPost, updatePost, addLog } from '../services/store';

const StudyFeed: React.FC<{ user: User }> = ({ user }) => {
  const [posts, setPosts] = useState<StudyPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [content, setContent] = useState('');
  const [codes, setCodes] = useState<{ language: string; code: string }[]>([]);

  useEffect(() => {
    setPosts(getAppData().posts);
  }, []);

  const handleAddCode = () => {
    setCodes([...codes, { language: 'javascript', code: '' }]);
  };

  const handleCodeChange = (index: number, field: 'language' | 'code', value: string) => {
    const newCodes = [...codes];
    newCodes[index][field] = value;
    setCodes(newCodes);
  };

  const handleRemoveCode = (index: number) => {
    setCodes(codes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const timestamp = Date.now();
    const postId = crypto.randomUUID();
    
    const newCodes: CodeSnippet[] = codes.map(c => ({
      id: crypto.randomUUID(),
      language: c.language,
      code: c.code,
      authorId: user.id,
      validatedBy: [],
      timestamp,
    }));

    const newPost: StudyPost = {
      id: postId,
      userId: user.id,
      userName: user.name,
      content,
      timestamp,
      codeSnippets: newCodes,
    };

    const logs: ActivityLog[] = [
      {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        action: 'CREATED_POST',
        targetId: postId,
        timestamp,
      },
    ];

    if (newCodes.length > 0) {
      logs.push({
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        action: 'POSTED_CODE',
        targetId: postId,
        timestamp,
      });
    }

    addPost(newPost, logs);
    setPosts(getAppData().posts);
    
    // Reset Form
    setContent('');
    setCodes([]);
    setShowForm(false);
  };

  const handleValidate = (postId: string, codeId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const code = post.codeSnippets.find(c => c.id === codeId);
    if (!code) return;

    // Rules: Can't validate own code, can only validate once
    if (code.authorId === user.id) {
      alert("Você não pode validar seu próprio código!");
      return;
    }
    if (code.validatedBy.includes(user.id)) {
      alert("Você já validou este código!");
      return;
    }

    const updatedCode = {
      ...code,
      validatedBy: [...code.validatedBy, user.id]
    };

    const updatedPost = {
      ...post,
      codeSnippets: post.codeSnippets.map(c => c.id === codeId ? updatedCode : c)
    };

    updatePost(updatedPost);
    addLog({
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      action: 'VALIDATED_CODE',
      targetId: codeId,
      timestamp: Date.now()
    });

    setPosts(getAppData().posts);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Diário de Estudos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showForm ? 'bg-slate-200 text-slate-700' : 'bg-indigo-600 text-white shadow-lg'
          }`}
        >
          {showForm ? 'Cancelar' : 'Registrar Estudo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md border border-indigo-100 animate-slideDown space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">O que você estudou hoje?</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: Hoje revisei POO em Java e pratiquei estruturas de repetição..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Blocos de Código (Opcional)</label>
              <button
                type="button"
                onClick={handleAddCode}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium"
              >
                + Adicionar Código
              </button>
            </div>
            {codes.map((c, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveCode(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="grid grid-cols-1 gap-3">
                  <select
                    value={c.language}
                    onChange={(e) => handleCodeChange(index, 'language', e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-slate-200 rounded outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL</option>
                  </select>
                  <textarea
                    required
                    value={c.code}
                    onChange={(e) => handleCodeChange(index, 'code', e.target.value)}
                    placeholder="Cole seu código aqui..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg font-mono text-sm h-40 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            Publicar Estudo
          </button>
        </form>
      )}

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {post.userName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{post.userName}</h3>
                      <span className="text-xs text-slate-400">
                        {new Date(post.timestamp).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 whitespace-pre-wrap mb-6">{post.content}</p>

                {post.codeSnippets.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {post.codeSnippets.map((snippet) => (
                      <div key={snippet.id} className="rounded-xl overflow-hidden border border-slate-200">
                        <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs font-mono flex justify-between items-center">
                          <span>{snippet.language.toUpperCase()}</span>
                          <span className="flex items-center gap-2">
                            {snippet.validatedBy.length > 0 && (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {snippet.validatedBy.length} Validação(ões)
                              </span>
                            )}
                          </span>
                        </div>
                        <pre className="p-4 bg-slate-900 text-slate-100 text-sm overflow-x-auto">
                          <code>{snippet.code}</code>
                        </pre>
                        <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-xs text-slate-500">
                            {snippet.validatedBy.length > 0 
                              ? `Validado por: ${snippet.validatedBy.map(vId => getAppData().posts.find(p => p.userId === vId)?.userName || 'Membro').filter((v, i, a) => a.indexOf(v) === i).join(', ')}` 
                              : 'Aguardando validação'}
                          </span>
                          {snippet.authorId !== user.id && !snippet.validatedBy.includes(user.id) && (
                            <button
                              onClick={() => handleValidate(post.id, snippet.id)}
                              className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold hover:bg-emerald-200 transition-colors"
                            >
                              Validar Código
                            </button>
                          )}
                          {snippet.validatedBy.includes(user.id) && (
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Você validou
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-slate-500 text-lg">Ainda não há registros de estudo.</p>
            <p className="text-slate-400 text-sm">Seja o primeiro a postar!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyFeed;
