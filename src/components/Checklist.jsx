export default function Checklist({
  checklistModelos, checklistItens, checklistExecucoes, checklistRespostas,
  novoModeloChecklist, setNovoModeloChecklist,
  novaCategoriaChecklist, setNovaCategoriaChecklist,
  criarModeloChecklist,
  modeloChecklistSelecionadoId, setModeloChecklistSelecionadoId,
  novoItemChecklist, setNovoItemChecklist,
  adicionarItemChecklist,
  executarChecklist,
  alternarRespostaChecklist,
}) {
  const itensDoModelo = checklistItens.filter((item) => String(item.modelo_id) === String(modeloChecklistSelecionadoId));
  const ultimaExecucao = checklistExecucoes[0];
  const respostas = ultimaExecucao ? checklistRespostas.filter((item) => item.execucao_id === ultimaExecucao.id) : [];
  const concluidos = respostas.filter((item) => item.concluido).length;

  return (
    <>
      <h2>Checklist</h2>

      <h3>Criar Modelo</h3>
      <input placeholder="Nome do checklist" value={novoModeloChecklist} onChange={(e) => setNovoModeloChecklist(e.target.value)} />
      <br /><br />
      <input placeholder="Categoria" value={novaCategoriaChecklist} onChange={(e) => setNovaCategoriaChecklist(e.target.value)} />
      <br /><br />
      <button onClick={criarModeloChecklist}>Criar Modelo</button>

      <hr />

      <h3>Modelo Selecionado</h3>
      <select value={modeloChecklistSelecionadoId} onChange={(e) => setModeloChecklistSelecionadoId(e.target.value)}>
        {checklistModelos.map((modelo) => <option key={modelo.id} value={modelo.id}>{modelo.nome} - {modelo.categoria}</option>)}
      </select>
      <br /><br />
      <input placeholder="Novo item" value={novoItemChecklist} onChange={(e) => setNovoItemChecklist(e.target.value)} />
      <button onClick={adicionarItemChecklist}>Adicionar Item</button>
      <br /><br />
      <button onClick={executarChecklist}>Iniciar Checklist de Hoje</button>

      <hr />

      <h3>Itens do Modelo</h3>
      {itensDoModelo.length === 0 ? <p>Nenhum item neste modelo.</p> : (
        <ul>{itensDoModelo.map((item) => <li key={item.id}>{item.descricao}</li>)}</ul>
      )}

      <hr />

      <h3>Última Execução</h3>
      {!ultimaExecucao ? <p>Nenhuma execução ainda.</p> : (
        <>
          <p><strong>{ultimaExecucao.modelo_nome}</strong> - {ultimaExecucao.data_execucao}</p>
          <p><strong>Progresso:</strong> {concluidos}/{respostas.length}</p>
          <table border="1" cellPadding="8">
            <thead><tr><th>Concluído</th><th>Item</th></tr></thead>
            <tbody>
              {respostas.map((resposta) => (
                <tr key={resposta.id}>
                  <td><input type="checkbox" checked={resposta.concluido} onChange={() => alternarRespostaChecklist(resposta.id, !resposta.concluido)} /></td>
                  <td>{resposta.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
