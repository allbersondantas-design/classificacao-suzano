import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const SENHA_CORRETA = import.meta.env.VITE_ADMIN_PASSWORD || "insuz@#2024";

    if (senha === SENHA_CORRETA) {
      localStorage.setItem('adminAutenticado', 'true');
      navigate('/admin'); // Redireciona para o ranking
    } else {
      setErro('Senha incorreta. Acesso negado.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Acesso Restrito - Suzano</h2>
        {erro && <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Senha Administrativa</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-600"
            required
          />
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800">
          Entrar
        </button>
      </form>
    </div>
  );
}