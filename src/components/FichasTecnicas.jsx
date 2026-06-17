export default function FichasTecnicas({
  estoqueItens,
  fichasTecnicas,
  fichaIngredientes,

  novaFichaNome,
  setNovaFichaNome,
  fichaRendimento,
  setFichaRendimento,
  fichaUnidadeRendimento,
  setFichaUnidadeRendimento,
  fichaPrecoVenda,
  setFichaPrecoVenda,

  criarFichaTecnica,

  fichaSelecionadaId,
  setFichaSelecionadaId,
  ingredienteItemId,
  setIngredienteItemId,
  ingredienteQuantidade,
  setIngredienteQuantidade,
  ingredienteUnidade,
  setIngredienteUnidade,

  adicionarIngredienteFicha,
  excluirFichaTecnica,
  calcularCustoFicha,
  calcularCustoIngredienteFicha,
}) {
  const ficha = fichasTecnicas.find(
    (item) => String(item.id) === String(fichaSelecionadaId)
  );

  const ingredientes = fichaIngredientes.filter(
    (item) => String(item.ficha_id) === String(fichaSelecionadaId)
  );

  const ingredienteSelecionado = estoqueItens.find(
    (item) => String(item.id) === String(ingredienteItemId)
  );

  const custoTotal = ficha ? calcularCustoFicha(ficha.id) : 0;
  const rendimento = Number(ficha?.rendimento || 0);
  const precoVenda = Number(ficha?.preco_venda || 0);
  const custoPorPorcao = rendimento > 0 ? custoTotal / rendimento : 0;
  const cmv = precoVenda > 0 ? (custoPorPorcao / precoVenda) * 100 : 0;

  return (
    <>
      <h2>Fichas Técnicas / CMV</h2>

      <h3>Cadastrar Ficha</h3>

      <input
        placeholder="Nome da ficha"
        value={novaFichaNome}
        onChange={(e) => setNovaFichaNome(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Rendimento"
        value={fichaRendimento}
        onChange={(e) => setFichaRendimento(e.target.value)}
      />

      <input
        placeholder="Unidade rendimento"
        value={fichaUnidadeRendimento}
        onChange={(e) => setFichaUnidadeRendimento(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Preço de venda por porção"
        value={fichaPrecoVenda}
        onChange={(e) => setFichaPrecoVenda(e.target.value)}
      />

      <br />
      <br />

      <button onClick={criarFichaTecnica}>Criar Ficha</button>

      <hr />

      <h3>Ficha Selecionada</h3>

      <select
        value={fichaSelecionadaId}
        onChange={(e) => setFichaSelecionadaId(e.target.value)}
      >
        {fichasTecnicas.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome}
          </option>
        ))}
      </select>

      {ficha && (
        <>
          <p>
            <strong>Rendimento:</strong> {ficha.rendimento}{" "}
            {ficha.unidade_rendimento}
          </p>

          <p>
            <strong>Custo total:</strong> R$ {custoTotal.toFixed(2)}
          </p>

          <p>
            <strong>Custo por porção:</strong> R$ {custoPorPorcao.toFixed(2)}
          </p>

          <p>
            <strong>Preço venda:</strong> R$ {precoVenda.toFixed(2)}
          </p>

          <p>
            <strong>CMV:</strong> {cmv.toFixed(1)}%
          </p>

          <button onClick={() => excluirFichaTecnica(ficha.id)}>
            Excluir Ficha
          </button>
        </>
      )}

      <hr />

      <h3>Adicionar Ingrediente</h3>

      <select
        value={ingredienteItemId}
        onChange={(e) => setIngredienteItemId(e.target.value)}
      >
        {estoqueItens.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome} - R$ {Number(item.custo_compra || 0).toFixed(2)}/
            {item.unidade}
          </option>
        ))}
      </select>

      <br />
      <br />

      {ingredienteSelecionado && (
        <p>
          <strong>Custo base:</strong> R${" "}
          {Number(ingredienteSelecionado.custo_compra || 0).toFixed(2)} /{" "}
          {ingredienteSelecionado.unidade}
        </p>
      )}

      <input
        type="number"
        min="0.001"
        step="0.001"
        placeholder="Quantidade usada"
        value={ingredienteQuantidade}
        onChange={(e) => setIngredienteQuantidade(e.target.value)}
      />

      <input
        placeholder="Unidade usada. Ex: g, kg, ml, L, un"
        value={ingredienteUnidade}
        onChange={(e) => setIngredienteUnidade(e.target.value)}
      />

      <br />
      <br />

      <button onClick={adicionarIngredienteFicha}>Adicionar Ingrediente</button>

      <hr />

      <h3>Ingredientes</h3>

      {ingredientes.length === 0 ? (
        <p>Nenhum ingrediente adicionado.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Qtd.</th>
              <th>Un.</th>
              <th>Custo Base</th>
              <th>Custo Calculado</th>
            </tr>
          </thead>

          <tbody>
            {ingredientes.map((item) => (
              <tr key={item.id}>
                <td>{item.item_nome}</td>
                <td>{item.quantidade}</td>
                <td>{item.unidade}</td>
                <td>R$ {Number(item.custo_unitario || 0).toFixed(2)}</td>
                <td>R$ {calcularCustoIngredienteFicha(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
