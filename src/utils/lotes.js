import { getDataCodigo } from "./datas";

export function gerarSigla(produto) {
  return produto
    .split(" ")
    .map((palavra) => palavra[0])
    .join("")
    .toUpperCase();
}

export function gerarLote(produto, historico, dataProducaoInput, offset = 1) {
  const sigla = gerarSigla(produto);
  const data = dataProducaoInput ? new Date(`${dataProducaoInput}T12:00:00`) : new Date();
  const dataCodigo = getDataCodigo(data);
  const prefixo = `${sigla}-${dataCodigo}`;

  const lotesDoMesmoProdutoHoje = historico.filter((item) =>
    item.lote.startsWith(prefixo)
  );

  const numero = String(lotesDoMesmoProdutoHoje.length + offset).padStart(2, "0");
  return `${prefixo}-${numero}`;
}
