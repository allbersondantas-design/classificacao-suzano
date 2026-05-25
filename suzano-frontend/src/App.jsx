import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Formulario from './components/Formulario';
import Ranking from './components/Ranking';
import LoginAdmin from './components/LoginAdmin';

// Componente "Guarda de Rota": Verifica se o admin tem o token no navegador
const RotaProtegida = ({ children }) => {
  const isAutenticado = localStorage.getItem('adminAutenticado') === 'true';
  return isAutenticado ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <BrowserRouter>
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
            
            {/* Os botões de alternância (Visão Proponente/Empresa) foram removidos daqui por segurança */}
          </div>
        </header>

        {/* Área de Conteúdo Gerenciada por Rotas */}
        <main className="py-8 px-4">
          <Routes>
            {/* Rota Pública: O proponente acessa a URL raiz e vê apenas o formulário */}
            <Route path="/" element={<Formulario />} />
            
            {/* Rota de Login: Porta de entrada para a empresa */}
            <Route path="/admin/login" element={<LoginAdmin />} />
            
            {/* Rota Protegida: O Ranking só é renderizado se passar pelo Guarda de Rota */}
            <Route 
              path="/admin" 
              element={
                <RotaProtegida>
                  <Ranking />
                </RotaProtegida>
              } 
            />
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
}

export default App;