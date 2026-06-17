export default function Estoque({
  estoqueItens,
  estoqueMovimentos,

  novoItemEstoque,
  setNovoItemEstoque,
  novaCategoriaEstoque,
  setNovaCategoriaEstoque,
  novaUnidadeEstoque,
  setNovaUnidadeEstoque,
  novoCustoCompra,
  setNovoCustoCompra,
  novoEstoqueMinimo,
  setNovoEstoqueMinimo,

  criarItemEstoque,

  movimentoItemId,
  setMovimentoItemId,
  movimentoTipo,
  setMovimentoTipo,
  movimentoQuantidade,
  setMovimentoQuantidade,
  movimentoMotivo,
  setMovimentoMotivo,

  registrarMovimentoEstoque,
  calcularSaldoEstoque,
}) {
  return (
    <>
      <h2>Estoque</h2>

      <h3>Cadastrar Item</h3>

      <input
        placeholder="Nome do insumo"
        value={novoItemEstoque}
        onChange={(e) => setNovoItemEstoque(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Categoria"
        value={novaCategoriaEstoque}
        onChange={(e) => setNovaCategoriaEstoque(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Unidade de compra. Ex: kg, L, un"
        value={novaUnidadeEstoque}
        onChange={(e) => setNovaUnidadeEstoque(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Custo de compra. Ex: 20 para R$20/kg"
        value={novoCustoCompra}
        onChange={(e) => setNovoCustoCompra(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Estoque mínimo"
        value={novoEstoqueMinimo}
        onChange={(e) => setNovoEstoqueMinimo(e.target.value)}
      />

      <br />
      <br />

      <button onClick={criarItemEstoque}>Cadastrar Item</button>

      <hr />

      <h3>Movimentar Estoque</h3>

      <select
        value={movimentoItemId}
        onChange={(e) => setMovimentoItemId(e.target.value)}
      >
        {estoqueItens.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome} ({item.unidade})
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={movimentoTipo}
        onChange={(e) => setMovimentoTipo(e.target.value)}
      >
        <option>Entrada</option>
        <option>Saída</option>
        <option>Ajuste</option>
      </select>

      <br />
      <br />

      <input
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Quantidade"
        value={movimentoQuantidade}
        onChange={(e) => setMovimentoQuantidade(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Motivo"
        value={movimentoMotivo}
        onChange={(e) => setMovimentoMotivo(e.target.value)}
      />

      <br />
      <br />

      <button onClick={registrarMovimentoEstoque}>Registrar Movimento</button>

      <hr />

      <h3>Saldos</h3>

      {estoqueItens.length === 0 ? (
        <p>Nenhum item cadastrado ainda.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Item</th>
              <th>Categoria</th>
              <th>Unidade Compra</th>
              <th>Custo Compra</th>
              <th>Saldo</th>
              <th>Mínimo</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {estoqueItens.map((item) => {
              const saldo = calcularSaldoEstoque(item.id);
              const abaixo = saldo <= Number(item.estoque_minimo || 0);

              return (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.categoria || "-"}</td>
                  <td>{item.unidade}</td>
                  <td>R$ {Number(item.custo_compra || 0).toFixed(2)}</td>
                  <td>{saldo}</td>
                  <td>{item.estoque_minimo || 0}</td>
                  <td
                    style={{
                      color: abaixo ? "orange" : "lime",
                      fontWeight: "bold",
                    }}
                  >
                    {abaixo ? "Atenção" : "OK"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <hr />

      <h3>Últimos Movimentos</h3>

      {estoqueMovimentos.length === 0 ? (
        <p>Nenhum movimento registrado ainda.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Data</th>
              <th>Item</th>
              <th>Tipo</th>
              <th>Qtd.</th>
              <th>Un.</th>
              <th>Motivo</th>
              <th>Resp.</th>
            </tr>
          </thead>

          <tbody>
            {estoqueMovimentos.map((mov) => (
              <tr key={mov.id}>
                <td>{new Date(mov.created_at).toLocaleString("pt-BR")}</td>
                <td>{mov.item_nome}</td>
                <td>{mov.tipo}</td>
                <td>{mov.quantidade}</td>
                <td>{mov.unidade}</td>
                <td>{mov.motivo || "-"}</td>
                <td>{mov.responsavel || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
