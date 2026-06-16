export function campoCSV(campo) {
  return `"${String(campo ?? "").replaceAll('"', '""')}"`;
}

export function baixarCSV(nomeArquivo, cabecalho, linhas) {
  const csv = cabecalho + linhas.join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = nomeArquivo;
  a.click();

  URL.revokeObjectURL(url);
}
