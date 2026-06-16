export function gerarTextoQRCode(etiqueta) {
  return `
STRATTA GASTRONOMIA
Produto: ${etiqueta.produto}
Lote: ${etiqueta.lote}
Produção: ${etiqueta.producao}
Validade: ${etiqueta.validade}
Setor: ${etiqueta.setor}
Quantidade: ${etiqueta.quantidade || "-"} ${etiqueta.unidade || ""}
Responsável: ${etiqueta.responsavel}
`.trim();
}

export function somarQuantidadePorProduto(historico) {
  const mapa = {};

  historico.forEach((item) => {
    const chave = `${item.produto} (${item.unidade || "un"})`;
    const quantidade = Number(item.quantidade) || 0;
    mapa[chave] = (mapa[chave] || 0) + quantidade;
  });

  return mapa;
}
