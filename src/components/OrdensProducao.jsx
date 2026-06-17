export default function OrdensProducao({
  produtos,
  unidades,
  funcionarios,
  funcionarioAtual,

  ordemProduto,
  setOrdemProduto,
  ordemQuantidade,
  setOrdemQuantidade,
  ordemUnidade,
  setOrdemUnidade,
  ordemData,
  setOrdemData,
  ordemObservacao,
  setOrdemObservacao,

  criarOrdem,
  ordensProducao,
  atualizarStatusOrdem,
  excluirOrdem,
}) {
  return (
    <>
      <h2>Ordens de Produção</h2>

      <h3>Criar Ordem</h3>

      <select
        value={ordemProduto}
        onChange={(e) => setOrdemProduto(e.target.value)}
      >
        {Object.keys(produtos).map((nome) => (
          <option key={nome} value={nome}>
            {nome}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Quantidade"
        value={ordemQuantidade}
        onChange={(e) => setOrdemQuantidade(e.target.value)}
      />

      <select
        value={ordemUnidade}
        onChange={(e) => setOrdemUnidade(e.target.value)}
      >
        {unidades.map((un) => (
          <option key={un}>{un}</option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="date"
        value={ordemData}
        onChange={(e) => setOrdemData(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Observação"
        value={ordemObservacao}
        onChange={(e) => setOrdemObservacao(e.target.value)}
        rows="3"
        style={{ width: "360px" }}
      />

      <br />
      <br />

      <p>
        <strong>Responsável:</strong> {funcionarioAtual}
      </p>

      <button onClick={criarOrdem}>Criar Ordem</button>

      <hr />

      <h3>Produção do Dia</h3>

      {ordensProducao.length === 0 ? (
        <p>Nenhuma ordem criada ainda.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd.</th>
              <th>Un.</th>
              <th>Data</th>
              <th>Status</th>
              <th>Responsável</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {ordensProducao.map((ordem) => (
              <tr key={ordem.id}>
                <td>{ordem.produto}</td>
                <td>{ordem.quantidade}</td>
                <td>{ordem.unidade}</td>
                <td>{ordem.data_producao}</td>
                <td
                  style={{
                    fontWeight: "bold",
                    color:
                      ordem.status === "Concluído"
                        ? "lime"
                        : ordem.status === "Em Produção"
                        ? "orange"
                        : "white",
                  }}
                >
                  {ordem.status}
                </td>
                <td>{ordem.responsavel}</td>
                <td>{ordem.observacao}</td>
                <td>
                  <button onClick={() => atualizarStatusOrdem(ordem.id, "Em Produção")}>
                    Iniciar
                  </button>{" "}
                  <button onClick={() => atualizarStatusOrdem(ordem.id, "Concluído")}>
                    Concluir
                  </button>{" "}
                  <button onClick={() => atualizarStatusOrdem(ordem.id, "Pendente")}>
                    Reabrir
                  </button>{" "}
                  <button onClick={() => excluirOrdem(ordem.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}