export default function FichasTecnicas({
  estoqueItens,
  fichasTecnicas,
  fichaIngredientes,
  fichaSubfichas,

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

  subfichaSelecionadaId,
  setSubfichaSelecionadaId,
  subfichaQuantidade,
  setSubfichaQuantidade,
  subfichaUnidade,
  setSubfichaUnidade,

  adicionarIngredienteFicha,
  adicionarSubfichaNaFicha,
  excluirFichaTecnica,
  calcularCustoFicha,
  calcularCustoIngredienteFicha,
  calcularCustoSubficha,
  unidades,
}) {
  const ficha = fichasTecnicas.find(
    (item) => String(item.id) === String(fichaSelecionadaId)
  );

  const ingredientes = fichaIngredientes.filter(
    (item) => String(item.ficha_id) === String(fichaSelecionadaId)
  );

  const subfichasDaFicha = fichaSubfichas.filter(
    (item) => String(item.ficha_id) === String(fichaSelecionadaId)
  );

  const ingredienteSelecionado = estoqueItens.find(
    (item) => String(item.id) === String(ingredienteItemId)
  );

  const subfichaSelecionada = fichasTecnicas.find(
    (item) => String(item.id) === String(subfichaSelecionadaId)
  );

  const fichasDisponiveisComoSubficha = fichasTecnicas.filter(
    (item) => String(item.id) !== String(fichaSelecionadaId)
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

      <label>
        Nome da ficha
        <br />
        <input
          placeholder="Ex: Risoto de Ervilha"
          value={novaFichaNome}
          onChange={(e) => setNovaFichaNome(e.target.value)}
        />
      </label>

      <br />
      <br />

      <label>
        Rendimento
        <br />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Ex: 10"
          value={fichaRendimento}
          onChange={(e) => setFichaRendimento(e.target.value)}
        />
      </label>

      <br />
      <br />

      <label>
        Unidade do rendimento
        <br />
        <select
          value={fichaUnidadeRendimento}
          onChange={(e) => setFichaUnidadeRendimento(e.target.value)}
        >
          {unidades.map((unidade) => (
            <option key={unidade} value={unidade}>
              {unidade}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      <label>
        Preço de venda por porção
        <br />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Ex: 48"
          value={fichaPrecoVenda}
          onChange={(e) => setFichaPrecoVenda(e.target.value)}
        />
      </label>

      <br />
      <br />

      <button onClick={criarFichaTecnica}>Criar Ficha</button>

      <hr />

      <h3>Ficha Selecionada</h3>

      <label>
        Ficha
        <br />
        <select
          value={fichaSelecionadaId}
          onChange={(e) => setFichaSelecionadaId(e.target.value)}
        >
        <option value="">Selecione...</option>
          {fichasTecnicas.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>
      </label>

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

      <h3>Adicionar Ingrediente de Estoque</h3>

      <label>
        Ingrediente
        <br />
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
      </label>

      <br />
      <br />

      {ingredienteSelecionado && (
        <p>
          <strong>Custo base:</strong> R${" "}
          {Number(ingredienteSelecionado.custo_compra || 0).toFixed(2)} /{" "}
          {ingredienteSelecionado.unidade}
        </p>
      )}

      <label>
        Quantidade usada
        <br />
        <input
          type="number"
          min="0.001"
          step="0.001"
          placeholder="Ex: 180"
          value={ingredienteQuantidade}
          onChange={(e) => setIngredienteQuantidade(e.target.value)}
        />
      </label>

      <br />
      <br />

      <label>
        Unidade usada
        <br />
        <select
          value={ingredienteUnidade}
          onChange={(e) => setIngredienteUnidade(e.target.value)}
        >
          {unidades.map((unidade) => (
            <option key={unidade} value={unidade}>
              {unidade}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      <button onClick={adicionarIngredienteFicha}>Adicionar Ingrediente</button>

      <hr />

      <h3>Adicionar Subficha / Preparo Base</h3>

      <label>
        Subficha
        <br />
        <select
          value={subfichaSelecionadaId}
          onChange={(e) => setSubfichaSelecionadaId(e.target.value)}
        >
          {fichasDisponiveisComoSubficha.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome} - rendimento {item.rendimento}{" "}
              {item.unidade_rendimento}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      {subfichaSelecionada && (
        <p>
          <strong>Custo da subficha:</strong> R${" "}
          {calcularCustoFicha(subfichaSelecionada.id).toFixed(2)} / rendimento{" "}
          {subfichaSelecionada.rendimento}{" "}
          {subfichaSelecionada.unidade_rendimento}
        </p>
      )}

      <label>
        Quantidade usada da subficha
        <br />
        <input
          type="number"
          min="0.001"
          step="0.001"
          placeholder="Ex: 300"
          value={subfichaQuantidade}
          onChange={(e) => setSubfichaQuantidade(e.target.value)}
        />
      </label>

      <br />
      <br />

      <label>
        Unidade usada da subficha
        <br />
        <select
          value={subfichaUnidade}
          onChange={(e) => setSubfichaUnidade(e.target.value)}
        >
          {unidades.map((unidade) => (
            <option key={unidade} value={unidade}>
              {unidade}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      <button onClick={adicionarSubfichaNaFicha}>Adicionar Subficha</button>

      <hr />

      <h3>Ingredientes Diretos</h3>

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

      <hr />

      <h3>Subfichas / Preparos Base</h3>

      {subfichasDaFicha.length === 0 ? (
        <p>Nenhuma subficha adicionada.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Subficha</th>
              <th>Qtd.</th>
              <th>Un.</th>
              <th>Custo Calculado</th>
            </tr>
          </thead>

          <tbody>
            {subfichasDaFicha.map((item) => (
              <tr key={item.id}>
                <td>{item.subficha_nome}</td>
                <td>{item.quantidade}</td>
                <td>{item.unidade}</td>
                <td>R$ {calcularCustoSubficha(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
