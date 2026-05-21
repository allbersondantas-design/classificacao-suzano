import React, { useEffect, useState } from 'react';

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/ranking')
      .then(res => res.json())
      .then(data => {
        setRanking(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Carregando dados da POC...</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Visão Consolidada - Ranking Suzano</h1>
      
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
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Pontuação Final</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-bold text-blue-600">{item.posicao}</td>
                  <td className="py-3 px-4 border-b">{item.projeto}</td>
                  <td className="py-3 px-4 border-b text-gray-600">{item.proponente}</td>
                  <td className="py-3 px-4 border-b text-gray-600">{item.lei}</td>
                  <td className="py-3 px-4 border-b font-bold text-gray-800">{item.pontuacao_final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}