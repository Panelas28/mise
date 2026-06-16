import { QRCodeCanvas } from "qrcode.react";
import { gerarTextoQRCode } from "../utils/etiquetas";

export default function Etiqueta({ item }) {
  return (
    <div
      className="etiqueta-print"
      style={{
        border: "2px solid white",
        padding: "18px",
        marginTop: "20px",
        width: "430px",
        minHeight: "260px",
        textAlign: "left",
        background: "#111",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        gap: "16px",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "12px",
            margin: 0,
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          STRATTA GASTRONOMIA
        </p>

        <h2
          style={{
            margin: "14px 0",
            fontSize: "26px",
            letterSpacing: "1px",
          }}
        >
          {item.produto.toUpperCase()}
        </h2>

        <hr />

        <p>
          <strong>LOTE:</strong> {item.lote}
        </p>
        <p>
          <strong>PRODUÇÃO:</strong> {item.producao}
        </p>
        <p>
          <strong>VALIDADE:</strong> {item.validade}
        </p>
        <p>
          <strong>SETOR:</strong> {item.setor}
        </p>
        <p>
          <strong>QTD:</strong> {item.quantidade} {item.unidade}
        </p>

        <hr />

        <p>
          <strong>RESPONSÁVEL:</strong> {item.responsavel}
        </p>
      </div>

      <div style={{ background: "white", padding: "8px", borderRadius: "4px" }}>
        <QRCodeCanvas value={gerarTextoQRCode(item)} size={100} level="M" />
      </div>
    </div>
  );
}
