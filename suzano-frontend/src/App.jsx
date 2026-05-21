import React, { useState } from 'react';
import Formulario from './components/Formulario';
import Ranking from './components/Ranking';

function App() {
  const [telaAtiva, setTelaAtiva] = useState('formulario');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar Padrão Incentiv */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Simulação rápida da logo da Incentiv */}
            <div className="text-2xl font-bold tracking-tight text-[#131b2c]">
              incentiv<span className="text-teal-500 text-sm align-top">.me</span>
            </div>
            <span className="ml-4 pl-4 border-l border-gray-300 text-sm font-medium text-slate-500">
              Questionário Suzano
            </span>
          </div>
          
          {/* Controle de Telas (Apenas para a POC) */}
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${telaAtiva === 'formulario' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setTelaAtiva('formulario')}
            >
              Visão Proponente
            </button>
            <button 
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${telaAtiva === 'ranking' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setTelaAtiva('ranking')}
            >
              Visão Empresa
            </button>
          </div>
        </div>
      </header>

      {/* Área de Conteúdo */}
      <main className="py-8 px-4">
        {telaAtiva === 'formulario' ? <Formulario /> : <Ranking />}
      </main>
    </div>
  );
}

export default App;