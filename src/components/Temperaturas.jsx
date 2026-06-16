import { statusTemperatura } from "../utils/status";

export default function Temperaturas({
  equipamentos,
  novoEquipamento,
  setNovoEquipamento,
  adicionarEquipamento,
  equipamentoTemperatura,
  setEquipamentoTemperatura,
  temperatura,
  setTemperatura,
  registrarTemperatura,
  historicoTemperaturas,
  exportarTemperaturas,
  limparTemperaturas,
}) {
  return (
    <>
      <h2>Controle de Temperatura</h2>

      <input
        placeholder="Novo equipamento. Ex: Geladeira 1"
        value={novoEquipamento}
        onChange={(e) => setNovoEquipamento(e.target.value)}
      />

      <button onClick={adicionarEquipamento}>Adicionar Equipamento</button>

      <br />
      <br />

      <select
        value={equipamentoTemperatura}
        onChange={(e) => setEquipamentoTemperatura(e.target.value)}
      >
        {equipamentos.map((eq) => (
          <option key={eq}>{eq}</option>
        ))}
      </select>

      <input
        type="number"
        step="0.1"
        placeholder="Temperatura °C"
        value={temperatura}
        onChange={(e) => setTemperatura(e.target.value)}
      />

      <button onClick={registrarTemperatura}>Registrar Temperatura</button>

      <br />
      <br />

      <button onClick={exportarTemperaturas}>Exportar Temperaturas</button>{" "}
      <button onClick={limparTemperaturas}>Limpar Temperaturas</button>

      {historicoTemperaturas.length === 0 ? (
        <p>Nenhuma temperatura registrada ainda.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Equipamento</th>
              <th>Temperatura</th>
              <th>Status</th>
              <th>Resp.</th>
            </tr>
          </thead>

          <tbody>
            {historicoTemperaturas.map((item) => (
              <tr key={item.id}>
                <td>{item.dataHora}</td>
                <td>{item.equipamento}</td>
                <td>{item.temperatura}°C</td>
                <td
                  style={{
                    color:
                      statusTemperatura(item.temperatura) === "Atenção"
                        ? "orange"
                        : "lime",
                    fontWeight: "bold",
                  }}
                >
                  {statusTemperatura(item.temperatura)}
                </td>
                <td>{item.responsavel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
