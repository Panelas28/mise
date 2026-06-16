export default function LoginResponsavel({
  funcionarios,
  funcionarioAtual,
  setFuncionarioAtual,
  novoFuncionario,
  setNovoFuncionario,
  adicionarFuncionario,
  removerFuncionario,
}) {
  return (
    <section>
      <h2>Login / Responsável</h2>

      <select
        value={funcionarioAtual}
        onChange={(e) => setFuncionarioAtual(e.target.value)}
      >
        {funcionarios.map((nome) => (
          <option key={nome}>{nome}</option>
        ))}
      </select>

      <br />
      <br />

      <input
        placeholder="Novo funcionário"
        value={novoFuncionario}
        onChange={(e) => setNovoFuncionario(e.target.value)}
      />

      <button onClick={adicionarFuncionario}>Adicionar</button>{" "}
      <button onClick={() => removerFuncionario(funcionarioAtual)}>
        Remover selecionado
      </button>

      <p>
        <strong>Responsável atual:</strong> {funcionarioAtual}
      </p>
    </section>
  );
}
