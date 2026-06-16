import { getStatus } from "../utils/status";

export default function HistoricoEtiquetas({
  historico,
  historicoFiltrado,
  busca,
  setBusca,
  limparHistorico,
  exportarCSV,
  selecionadas,
  setSelecionadas,
  alternarSelecionada,
  imprimirSelecionadas,
  reimprimirEtiqueta,
  excluirEtiqueta,
}) {
  return (
    <>
      <h2>Histórico de Etiquetas</h2>

      <input
        placeholder="Pesquisar por produto, lote, setor, status ou responsável"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{
          width: "360px",
          padding: "8px",
          marginBottom: "14px",
        }}
      />

      <br />

      {historico.length === 0 ? (
        <p>Nenhuma etiqueta gerada ainda.</p>
      ) : (
        <>
          <button onClick={limparHistorico}>Limpar Histórico</button>{" "}
          <button onClick={exportarCSV}>Exportar CSV</button>{" "}
          <button onClick={() => setSelecionadas(historicoFiltrado.map((item) => item.id))}>
            Selecionar filtradas
          </button>{" "}
          <button onClick={() => setSelecionadas([])}>Limpar seleção</button>{" "}
          <button onClick={imprimirSelecionadas}>
            Imprimir selecionadas ({selecionadas.length})
          </button>

          <br />
          <br />

          <p>
            Mostrando {historicoFiltrado.length} de {historico.length} etiquetas
          </p>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Sel.</th>
                <th>Produto</th>
                <th>Lote</th>
                <th>Produção</th>
                <th>Validade</th>
                <th>Status</th>
                <th>Setor</th>
                <th>Qtd.</th>
                <th>Un.</th>
                <th>Resp.</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {historicoFiltrado.map((item) => {
                const status = getStatus(item.validade);

                return (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selecionadas.includes(item.id)}
                        onChange={() => alternarSelecionada(item.id)}
                      />
                    </td>

                    <td>{item.produto}</td>
                    <td>{item.lote}</td>
                    <td>{item.producao}</td>
                    <td>{item.validade}</td>

                    <td
                      style={{
                        color:
                          status === "Vencido"
                            ? "red"
                            : status === "Vence em 48h"
                            ? "orange"
                            : "lime",
                        fontWeight: "bold",
                      }}
                    >
                      {status}
                    </td>

                    <td>{item.setor}</td>
                    <td>{item.quantidade || ""}</td>
                    <td>{item.unidade || ""}</td>
                    <td>{item.responsavel}</td>

                    <td>
                      <button onClick={() => reimprimirEtiqueta(item)}>
                        Reimprimir
                      </button>{" "}
                      <button onClick={() => excluirEtiqueta(item.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
