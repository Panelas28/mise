function CardDashboard({ titulo, valor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid white",
        padding: "15px",
        minWidth: "170px",
        cursor: "pointer",
      }}
    >
      <h3>{titulo}</h3>
      <h2>{valor}</h2>
    </button>
  );
}

export default function Dashboard({
  etiquetasHoje,
  etiquetasCozinha,
  etiquetasProducao,
  vencendo48h,
  vencidas,
  filtroRapido,
  setFiltroRapido,
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <CardDashboard
          titulo="📦 Etiquetas Hoje"
          valor={etiquetasHoje}
          onClick={() => setFiltroRapido("Hoje")}
        />

        <CardDashboard
          titulo="👨‍🍳 Cozinha"
          valor={etiquetasCozinha}
          onClick={() => setFiltroRapido("Cozinha")}
        />

        <CardDashboard
          titulo="🏭 Produção"
          valor={etiquetasProducao}
          onClick={() => setFiltroRapido("Produção")}
        />

        <CardDashboard
          titulo="⚠️ Vencendo 48h"
          valor={vencendo48h}
          onClick={() => setFiltroRapido("Vence em 48h")}
        />

        <CardDashboard
          titulo="🚫 Vencidas"
          valor={vencidas}
          onClick={() => setFiltroRapido("Vencido")}
        />
      </div>

      <p>
        <strong>Filtro rápido:</strong> {filtroRapido}{" "}
        <button onClick={() => setFiltroRapido("Todos")}>Limpar filtro</button>
      </p>
    </>
  );
}
