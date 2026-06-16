export default function Produtos({
  produtos,
  setores,
  unidades,
  novoProduto,
  setNovoProduto,
  novoSetor,
  setNovoSetor,
  novaValidade,
  setNovaValidade,
  novaUnidade,
  setNovaUnidade,
  cadastrarProduto,
  produtoEditando,
  editNome,
  setEditNome,
  editSetor,
  setEditSetor,
  editValidade,
  setEditValidade,
  editUnidade,
  setEditUnidade,
  iniciarEdicao,
  salvarEdicaoProduto,
  cancelarEdicao,
  excluirProduto,
}) {
  return (
    <>
      <h2>Cadastrar Produto</h2>

      <input
        placeholder="Nome do Produto"
        value={novoProduto}
        onChange={(e) => setNovoProduto(e.target.value)}
      />

      <br />
      <br />

      <select value={novoSetor} onChange={(e) => setNovoSetor(e.target.value)}>
        {setores.map((setor) => (
          <option key={setor}>{setor}</option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="number"
        min="1"
        placeholder="Validade em dias"
        value={novaValidade}
        onChange={(e) => setNovaValidade(e.target.value)}
      />

      <br />
      <br />

      <select value={novaUnidade} onChange={(e) => setNovaUnidade(e.target.value)}>
        {unidades.map((un) => (
          <option key={un}>{un}</option>
        ))}
      </select>

      <br />
      <br />

      <button onClick={cadastrarProduto}>Salvar Produto</button>

      <hr />

      <h2>Produtos Cadastrados</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Setor</th>
            <th>Validade</th>
            <th>Unidade</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(produtos).map(([nome, dados]) => (
            <tr key={nome}>
              <td>{nome}</td>
              <td>{dados.setor}</td>
              <td>{dados.validade} dias</td>
              <td>{dados.unidade || "kg"}</td>
              <td>
                <button onClick={() => iniciarEdicao(nome)}>Editar</button>{" "}
                <button onClick={() => excluirProduto(nome)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {produtoEditando && (
        <>
          <h3>Editando Produto</h3>

          <input value={editNome} onChange={(e) => setEditNome(e.target.value)} />

          <br />
          <br />

          <select value={editSetor} onChange={(e) => setEditSetor(e.target.value)}>
            {setores.map((setor) => (
              <option key={setor}>{setor}</option>
            ))}
          </select>

          <br />
          <br />

          <input
            type="number"
            min="1"
            value={editValidade}
            onChange={(e) => setEditValidade(e.target.value)}
          />

          <br />
          <br />

          <select value={editUnidade} onChange={(e) => setEditUnidade(e.target.value)}>
            {unidades.map((un) => (
              <option key={un}>{un}</option>
            ))}
          </select>

          <br />
          <br />

          <button onClick={salvarEdicaoProduto}>Salvar Alteração</button>{" "}
          <button onClick={cancelarEdicao}>Cancelar</button>
        </>
      )}
    </>
  );
}
