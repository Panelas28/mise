import Etiqueta from "./Etiqueta";

export default function GerarEtiqueta({
  produto,
  setProduto,
  produtos,
  funcionarioAtual,
  dataProducao,
  setDataProducao,
  quantidade,
  setQuantidade,
  unidade,
  setUnidade,
  unidades,
  quantidadeEtiquetas,
  setQuantidadeEtiquetas,
  gerarEtiqueta,
  etiqueta,
  etiquetasParaImprimir,
  imprimirEtiqueta,
}) {
  return (
    <>
      <h2>Gerar Etiqueta</h2>

      <select value={produto} onChange={(e) => setProduto(e.target.value)}>
        {Object.keys(produtos).map((nome) => (
          <option key={nome} value={nome}>
            {nome}
          </option>
        ))}
      </select>

      <br />
      <br />

      <p>
        <strong>Responsável:</strong> {funcionarioAtual}
      </p>

      <input
        type="date"
        value={dataProducao}
        onChange={(e) => setDataProducao(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Quantidade produzida"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      <select value={unidade} onChange={(e) => setUnidade(e.target.value)}>
        {unidades.map((un) => (
          <option key={un}>{un}</option>
        ))}
      </select>

      <br />
      <br />

      <input
        type="number"
        min="1"
        placeholder="Quantidade de etiquetas"
        value={quantidadeEtiquetas}
        onChange={(e) => setQuantidadeEtiquetas(e.target.value)}
      />

      <br />
      <br />

      <p>
        <strong>Setor automático:</strong> {produtos[produto]?.setor}
      </p>
      <p>
        <strong>Validade padrão:</strong> {produtos[produto]?.validade} dias
      </p>

      <button onClick={gerarEtiqueta}>Gerar Etiqueta</button>

      {etiqueta && (
        <>
          <div className="area-impressao">
            {etiquetasParaImprimir.map((item) => (
              <Etiqueta key={item.id} item={item} />
            ))}
          </div>

          <br />

          <button onClick={imprimirEtiqueta}>Imprimir Etiqueta</button>
        </>
      )}
    </>
  );
}
