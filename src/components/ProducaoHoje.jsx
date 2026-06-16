export default function ProducaoHoje({
  totalProduzidoHoje,
  producaoPorProduto,
  exportarProducaoDia,
}) {
  return (
    <>
      <h2>Produção de Hoje</h2>

      <p>
        <strong>Total produzido hoje:</strong> {totalProduzidoHoje}
      </p>

      <button onClick={exportarProducaoDia}>Exportar Produção do Dia</button>

      <br />
      <br />

      {Object.keys(producaoPorProduto).length === 0 ? (
        <p>Nenhuma produção registrada hoje.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade total</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(producaoPorProduto).map(([nome, total]) => (
              <tr key={nome}>
                <td>{nome}</td>
                <td>{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
