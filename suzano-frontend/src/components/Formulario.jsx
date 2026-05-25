import React, { useState } from 'react';

export default function Formulario() {
  const [isEnviado, setIsEnviado] = useState(false);
  const [erro, setErro] = useState('');

  // Estado para guardar os dados automáticos do projeto
  const [dadosProjeto, setDadosProjeto] = useState(null);
  const [buscandoProjeto, setBuscandoProjeto] = useState(false);
  
  const [formData, setFormData] = useState({
    link_projeto: '',
    exposicao_marca: '',
    materiais_marca: [],
    outro_material: '',
    abrangencia: [],
    visibilidade: [],
    voluntariado: '',
    dinamica_voluntariado: ''
  });

  const opcoesMateriais = ["Camisetas/Uniformes", "Banner", "Livros", "Backdrop", "Peças digitais", "Folhetos/peças gráficas", "Revista", "Mochila/Ecobag", "Outro"];
  const opcoesAbrangencia = ["Abrangência Municipal", "Abrangência Estadual", "Abrangência Nacional"];

  const handleCheckboxArray = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter(item => item !== value)
    }));
  };

  // Procura o projeto automaticamente quando o link é alterado
  const handleLinkChange = async (e) => {
    const url = e.target.value;
    setFormData({...formData, link_projeto: url});
    
    // Tenta encontrar um número no final do link (o ID)
    const match = url.match(/\/projects\/([a-f0-9\-]{36})/i);
    
    if (match) {
      const id = match[1];
      setBuscandoProjeto(true);
      setErro(''); // Limpa erros anteriores
      
      try {
        // Vai bater na rota do ecossistema que criamos no backend!
        const res = await fetch(`https://suzano-formulario-api-122895657034.southamerica-east1.run.app/ecossistema/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setDadosProjeto(data); // Preenche os dados!
          } else {
            setDadosProjeto(null);
            setErro('Projeto não encontrado na base de dados. Verifique o link.');
          }
        }
      } catch (err) {
        console.error("Erro ao procurar projeto", err);
      } finally {
        setBuscandoProjeto(false);
      }
    } else {
      setDadosProjeto(null); // Se o link for inválido, limpa os campos
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch('https://suzano-formulario-api-122895657034.southamerica-east1.run.app/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsEnviado(true); 
      } else {
        const data = await response.json();
        setErro(data.detail);
      }
    } catch (error) {
      setErro('Erro de conexão com a API.');
    }
  };

  if (isEnviado) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-10 bg-white border border-green-200 rounded-2xl text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Resposta Registrada!</h2>
        <p className="text-slate-600">Agradecemos o envio. Suas respostas foram salvas e não podem mais ser editadas.</p>
      </div>
    );
  }

  // Classes padrão extraídas da identidade visual
  const inputStyle = "mt-1.5 w-full rounded-lg border border-gray-300 p-2.5 text-sm text-slate-700 bg-white shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all";
  const labelStyle = "block text-sm font-semibold text-slate-700";
  const disabledInputStyle = "mt-1.5 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-slate-500 bg-gray-100 cursor-not-allowed"; // Estilo para campos não editáveis
  const cardStyle = "bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200";

  return (
    <div className="max-w-3xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Questionário Complementar</h1>
        <p className="text-slate-600 mt-2">Segunda etapa de avaliação do processo seletivo Suzano.</p>
      </div>
      
      {erro && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* === SEÇÃO 1 === */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold mr-3">1</div>
            <h2 className="text-lg font-bold text-slate-800">Dados básicos</h2>
          </div>
          
          <div className="mb-6">
            <label className={labelStyle}>Link do projeto cadastrado na Incentiv *</label>
            <input 
              type="url" 
              required 
              placeholder="Ex: https://app.incentiv.me/projects/0000000" 
              className={inputStyle}
              onChange={handleLinkChange} // Adicionamos a nova função aqui!
            />
            <p className="text-xs text-slate-500 mt-2">Copie e cole a URL completa do seu projeto.</p>
          </div>

          {/* Campos Automáticos Não Editáveis */}
          {buscandoProjeto && <div className="text-sm text-blue-600 mb-4 animate-pulse">A procurar dados do projeto...</div>}
          
          {dadosProjeto && (
            <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 mb-2 border-b border-blue-200 pb-2">Informações localizadas (Não editáveis):</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600">Nome do Projeto</label>
                <input type="text" readOnly value={dadosProjeto.nome} className={disabledInputStyle} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600">Lei de Incentivo</label>
                  <input type="text" readOnly value={dadosProjeto.lei} className={disabledInputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600">Nome do Proponente</label>
                  <input type="text" readOnly value={dadosProjeto.proponente} className={disabledInputStyle} />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* === SEÇÃO 2 === */}
        <section className={cardStyle}>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold mr-3">2</div>
            <h2 className="text-lg font-bold text-slate-800">Contrapartidas</h2>
          </div>
          
          <div className="space-y-8">
            {/* Exposição de Marca */}
            <div>
              <label className={labelStyle}>O projeto possui ações de exposição de marca? *</label>
              <select required className={inputStyle}
                onChange={e => setFormData({...formData, exposicao_marca: e.target.value})}>
                <option value="">Selecione uma opção...</option>
                <option value="Sim">Sim, possui ações</option>
                <option value="Não">Não possui</option>
              </select>
            </div>

            {formData.exposicao_marca === 'Sim' && (
              <div className="pl-5 border-l-2 border-blue-500 bg-blue-50/50 p-4 rounded-r-lg">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Quais materiais de exposição? (Apenas informativo)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {opcoesMateriais.map(op => (
                    <label key={op} className="flex items-center text-sm text-slate-600 cursor-pointer group">
                      <input type="checkbox" value={op} onChange={e => handleCheckboxArray(e, 'materiais_marca')} 
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 mr-3" />
                      <span className="group-hover:text-slate-900 transition-colors">{op}</span>
                    </label>
                  ))}
                </div>
                {formData.materiais_marca.includes('Outro') && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Descreva o outro material:</label>
                    <input type="text" className={inputStyle} required onChange={e => setFormData({...formData, outro_material: e.target.value})} />
                  </div>
                )}
              </div>
            )}

            <hr className="border-gray-100" />

            {/* Abrangência */}
            <div>
              <label className={labelStyle}>Qual é a abrangência do projeto em termos de execução? *</label>
              <p className="text-xs text-slate-500 mb-3 mt-1">Você pode selecionar mais de uma opção.</p>
              <div className="space-y-3">
                {opcoesAbrangencia.map(op => (
                  <label key={op} className="flex items-center text-sm text-slate-600 cursor-pointer group">
                    <input type="checkbox" value={op} onChange={e => handleCheckboxArray(e, 'abrangencia')} 
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 mr-3" /> 
                    <span className="group-hover:text-slate-900 transition-colors">{op.replace('Abrangência ', '')}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Visibilidade */}
            <div>
              <label className={labelStyle}>Qual é a abrangência prevista para divulgação em veículos de comunicação? *</label>
              <div className="space-y-3 mt-3">
                {opcoesAbrangencia.map(op => (
                  <label key={`vis_${op}`} className="flex items-center text-sm text-slate-600 cursor-pointer group">
                    <input type="checkbox" value={op} onChange={e => handleCheckboxArray(e, 'visibilidade')} 
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 mr-3" /> 
                    <span className="group-hover:text-slate-900 transition-colors">{op.replace('Abrangência ', '')}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Voluntariado */}
            <div>
              <label className={labelStyle}>O projeto prevê atividades para voluntários da Suzano? *</label>
              <select required className={inputStyle}
                onChange={e => setFormData({...formData, voluntariado: e.target.value})}>
                <option value="">Selecione uma opção...</option>
                <option value="Sim">Sim, prevê atividades</option>
                <option value="Não">Não prevê</option>
              </select>
            </div>

            {formData.voluntariado === 'Sim' && (
              <div className="pl-5 border-l-2 border-blue-500 bg-blue-50/50 p-4 rounded-r-lg">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descreva a dinâmica sugerida para atuação dos voluntários: *</label>
                <textarea required rows="3" className={inputStyle}
                  onChange={e => setFormData({...formData, dinamica_voluntariado: e.target.value})}></textarea>
              </div>
            )}

          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button type="submit" 
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-blue-300 outline-none">
            Começar a preencher
          </button>
        </div>
      </form>
    </div>
  );
}