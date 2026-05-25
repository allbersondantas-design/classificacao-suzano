import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Controle de qual linha da tabela está aberta para ver os detalhes
  const [linhaExpandida, setLinhaExpandida] = useState(null);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAutenticado');
    navigate('/admin/login');
  };

  useEffect(() => {
    const token = import.meta.env.VITE_ADMIN_PASSWORD || "insuz@#2024";

    fetch('https://suzano-formulario-api-122895657034.southamerica-east1.run.app/ranking', {
      headers: {
        'x-admin-token': token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Não autorizado');
        return res.json();
      })
      .then(data => {
        setRanking(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/admin/login');
      });
  }, [navigate]);

  // Função para alternar a abertura da linha
  const toggleLinha = (index) => {
    setLinhaExpandida(linhaExpandida === index ? null : index);
  };

  // Dicionário de pesos para calcular o demonstrativo no frontend
  const pesos = {
    "Abrangência Municipal": 12,
    "Abrangência Estadual": 7,
    "Abrangência Nacional": 5
  };

  if (loading) return <div className="text-center mt-10">Carregando dados da POC...</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Visão Consolidada - Ranking Suzano</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md font-medium transition-colors border border-red-200 shadow-sm"
        >
          Sair do Sistema
        </button>
      </div>
      
      {ranking.length === 0 ? (
        <p className="text-gray-500">Nenhum projeto respondeu ao questionário ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Ranking</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Projeto</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Proponente</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Lei de Incentivo</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Pontuação Total</th>
                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Linha Principal */}
                  <tr className={`hover:bg-slate-50 transition-colors ${linhaExpandida === index ? 'bg-blue-50' : ''}`}>
                    <td className="py-3 px-4 border-b font-bold text-blue-600 text-lg">{item.posicao}</td>
                    <td className="py-3 px-4 border-b font-medium text-slate-800">{item.projeto}</td>
                    <td className="py-3 px-4 border-b text-sm text-gray-600">{item.proponente}</td>
                    <td className="py-3 px-4 border-b text-sm text-gray-600">{item.lei}</td>
                    <td className="py-3 px-4 border-b font-bold text-gray-800 text-lg">{item.pontuacao_final} pts</td>
                    <td className="py-3 px-4 border-b text-center">
                      <button 
                        onClick={() => toggleLinha(index)}
                        className="text-sm bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors font-medium"
                      >
                        {linhaExpandida === index ? 'Ocultar' : 'Ver Detalhes'}
                      </button>
                    </td>
                  </tr>

                  {/* Linha Secundária Expandida (Detalhes da Pontuação) */}
                  {linhaExpandida === index && (
                    <tr className="bg-slate-50">
                      <td colSpan="6" className="p-0 border-b border-gray-200">
                        <div className="p-6">
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">
                            Detalhamento da Pontuação
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* Exposição de Marca */}
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <p className="text-xs text-slate-500 font-semibold mb-1">EXPOSIÇÃO DE MARCA</p>
                              <p className="text-sm font-medium text-slate-800">
                                {item.detalhes?.exposicao_marca || 'Não informado'}
                              </p>
                              <p className="text-sm font-bold text-emerald-600 mt-2 pt-2 border-t">
                                {item.detalhes?.exposicao_marca === 'Sim' ? '+ 17 pts' : '0 pts'}
                              </p>
                            </div>

                            {/* Voluntariado */}
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <p className="text-xs text-slate-500 font-semibold mb-1">AÇÕES DE VOLUNTARIADO</p>
                              <p className="text-sm font-medium text-slate-800">
                                {item.detalhes?.voluntariado || 'Não informado'}
                              </p>
                              <p className="text-sm font-bold text-emerald-600 mt-2 pt-2 border-t">
                                {item.detalhes?.voluntariado === 'Sim' ? '+ 10 pts' : '0 pts'}
                              </p>
                            </div>

                            {/* Abrangência */}
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <p className="text-xs text-slate-500 font-semibold mb-2">ABRANGÊNCIA</p>
                              <ul className="space-y-1">
                                {item.detalhes?.abrangencia?.length > 0 ? (
                                  item.detalhes.abrangencia.map((abr, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm">
                                      <span className="text-slate-700">{abr}</span>
                                      <span className="font-bold text-emerald-600">+{pesos[abr] || 0}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-sm text-slate-500">Nenhuma selecionada</li>
                                )}
                              </ul>
                            </div>

                            {/* Visibilidade */}
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                              <p className="text-xs text-slate-500 font-semibold mb-2">VISIBILIDADE</p>
                              <ul className="space-y-1">
                                {item.detalhes?.visibilidade?.length > 0 ? (
                                  item.detalhes.visibilidade.map((vis, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm">
                                      <span className="text-slate-700">{vis}</span>
                                      <span className="font-bold text-emerald-600">+{pesos[vis] || 0}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-sm text-slate-500">Nenhuma selecionada</li>
                                )}
                              </ul>
                            </div>

                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}