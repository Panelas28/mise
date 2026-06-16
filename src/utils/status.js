export function calcularDiasAteValidade(validade) {
  const partes = validade.split("/");
  const dataValidade = new Date(partes[2], partes[1] - 1, partes[0]);
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);
  dataValidade.setHours(0, 0, 0, 0);

  return (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
}

export function getStatus(validade) {
  const dias = calcularDiasAteValidade(validade);

  if (dias < 0) return "Vencido";
  if (dias <= 2) return "Vence em 48h";

  return "Válido";
}

export function statusTemperatura(valor) {
  const temp = Number(valor);

  if (temp <= -15) return "Freezer OK";
  if (temp >= 0 && temp <= 5) return "Refrigeração OK";
  if (temp > 5) return "Atenção";

  return "Verificar";
}
