import { useEffect, useState } from "react";

import { supabase } from "./services/supabase";
import Dashboard from "./components/Dashboard";
import GerarEtiqueta from "./components/GerarEtiqueta";
import HistoricoEtiquetas from "./components/HistoricoEtiquetas";
import LoginResponsavel from "./components/LoginResponsavel";
import ProducaoHoje from "./components/ProducaoHoje";
import Produtos from "./components/Produtos";
import Temperaturas from "./components/Temperaturas";

import { setores, unidades } from "./data/constants";

import { baixarCSV, campoCSV } from "./utils/csv";
import { formatarData, formatarDataHora, hojeInput } from "./utils/datas";
import { somarQuantidadePorProduto } from "./utils/etiquetas";
import { gerarLote } from "./utils/lotes";
import { getStatus, statusTemperatura } from "./utils/status";

function App() {
  const [aba, setAba] = useState("etiquetas");

  const [produto, setProduto] = useState("Cupim Desfiado");
  const [etiqueta, setEtiqueta] = useState(null);
  const [etiquetasParaImprimir, setEtiquetasParaImprimir] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroRapido, setFiltroRapido] = useState("Todos");
  const [selecionadas, setSelecionadas] = useState([]);

  const [quantidade, setQuantidade] = useState(1);
  const [unidade, setUnidade] = useState("kg");
  const [quantidadeEtiquetas, setQuantidadeEtiquetas] = useState(1);
  const [dataProducao, setDataProducao] = useState(hojeInput());

  const [funcionarios, setFuncionarios] = useState([]);

  const [funcionarioAtual, setFuncionarioAtual] = useState(() => {
    return localStorage.getItem("funcionarioAtual") || "Cris";
  });

  const [novoFuncionario, setNovoFuncionario] = useState("");

  const [produtos, setProdutos] = useState({});

  const [novoProduto, setNovoProduto] = useState("");
  const [novoSetor, setNovoSetor] = useState("Produção");
  const [novaValidade, setNovaValidade] = useState(1);
  const [novaUnidade, setNovaUnidade] = useState("kg");

  const [produtoEditando, setProdutoEditando] = useState("");
  const [editNome, setEditNome] = useState("");
  const [editSetor, setEditSetor] = useState("Produção");
  const [editValidade, setEditValidade] = useState(1);
  const [editUnidade, setEditUnidade] = useState("kg");

  const [equipamentos, setEquipamentos] = useState([]);

  const [novoEquipamento, setNovoEquipamento] = useState("");
  const [equipamentoTemperatura, setEquipamentoTemperatura] = useState("Geladeira 1");
  const [temperatura, setTemperatura] = useState("");

  const [historicoTemperaturas, setHistoricoTemperaturas] = useState([]);

  async function carregarProdutos() {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao carregar produtos do Supabase.");
      return;
    }

    const produtosFormatados = {};

    data.forEach((item) => {
      produtosFormatados[item.nome] = {
        validade: item.validade,
        setor: item.setor,
        unidade: item.unidade || "kg",
      };
    });

    setProdutos(produtosFormatados);

    const primeiroProduto = Object.keys(produtosFormatados)[0];

    if (primeiroProduto && !produtosFormatados[produto]) {
      setProduto(primeiroProduto);
    }
  }


  async function carregarFuncionarios() {
    const { data, error } = await supabase
      .from("funcionarios")
      .select("*")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao carregar funcionários do Supabase.");
      return;
    }

    const nomes = data.map((item) => item.nome);

    setFuncionarios(nomes);

    if (nomes.length > 0 && !nomes.includes(funcionarioAtual)) {
      setFuncionarioAtual(nomes[0]);
    }
  }

  async function carregarEquipamentos() {
    const { data, error } = await supabase
      .from("equipamentos")
      .select("*")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao carregar equipamentos do Supabase.");
      return;
    }

    const nomes = data.map((item) => item.nome);

    setEquipamentos(nomes);

    if (nomes.length > 0 && !nomes.includes(equipamentoTemperatura)) {
      setEquipamentoTemperatura(nomes[0]);
    }
  }

  async function carregarTemperaturas() {
    const { data, error } = await supabase
      .from("temperaturas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Erro ao carregar temperaturas do Supabase.");
      return;
    }

    const temperaturasFormatadas = data.map((item) => ({
      id: item.id,
      dataHora: formatarDataHora(new Date(item.created_at)),
      equipamento: item.equipamento,
      temperatura: item.temperatura,
      responsavel: item.responsavel,
      observacao: item.observacao || "",
    }));

    setHistoricoTemperaturas(temperaturasFormatadas);
  }

  useEffect(() => {
    carregarProdutos();
    carregarFuncionarios();
    carregarEquipamentos();
    carregarTemperaturas();
  }, []);

  useEffect(() => {
  async function carregarEtiquetas() {
    const { data, error } = await supabase
      .from("etiquetas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Erro ao carregar etiquetas do Supabase.");
      return;
    }

    const etiquetasFormatadas = data.map((item) => ({
      id: item.id,
      produto: item.produto,
      lote: item.lote,
      producao: item.producao.split("-").reverse().join("/"),
      validade: item.validade.split("-").reverse().join("/"),
      setor: item.setor,
      responsavel: item.responsavel,
      quantidade: item.quantidade,
      unidade: "",
      criadoEm: item.created_at,
    }));

    setHistorico(etiquetasFormatadas);
  }

  carregarEtiquetas();
}, []);

  useEffect(() => {
    localStorage.setItem("funcionarioAtual", funcionarioAtual);
  }, [funcionarioAtual]);

  useEffect(() => {
    if (produtos[produto]?.unidade) {
      setUnidade(produtos[produto].unidade);
    }
  }, [produto, produtos]);

  const hoje = formatarData(new Date());

  const etiquetasHoje = historico.filter((item) => item.producao === hoje).length;
  const etiquetasCozinha = historico.filter((item) => item.setor === "Cozinha").length;
  const etiquetasProducao = historico.filter((item) => item.setor === "Produção").length;
  const vencendo48h = historico.filter((item) => getStatus(item.validade) === "Vence em 48h").length;
  const vencidas = historico.filter((item) => getStatus(item.validade) === "Vencido").length;

  const totalProduzidoHoje = historico
    .filter((item) => item.producao === hoje)
    .reduce((total, item) => total + (Number(item.quantidade) || 0), 0);

  const producaoPorProduto = somarQuantidadePorProduto(
    historico.filter((item) => item.producao === hoje)
  );

  async function adicionarFuncionario() {
    const nome = novoFuncionario.trim();

    if (!nome) return alert("Digite o nome do funcionário.");
    if (funcionarios.includes(nome)) return alert("Funcionário já cadastrado.");

    const { error } = await supabase
      .from("funcionarios")
      .insert({
        nome,
        ativo: true,
      });

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar funcionário no Supabase.");
      return;
    }

    await carregarFuncionarios();

    setFuncionarioAtual(nome);
    setNovoFuncionario("");
  }

  async function removerFuncionario(nome) {
    if (funcionarios.length <= 1) {
      return alert("É necessário manter pelo menos um funcionário.");
    }

    const confirmar = confirm(`Remover o funcionário "${nome}"?`);
    if (!confirmar) return;

    const { error } = await supabase
      .from("funcionarios")
      .update({ ativo: false })
      .eq("nome", nome);

    if (error) {
      console.error(error);
      alert("Erro ao remover funcionário no Supabase.");
      return;
    }

    await carregarFuncionarios();

    if (funcionarioAtual === nome) {
      const atualizados = funcionarios.filter((item) => item !== nome);
      setFuncionarioAtual(atualizados[0] || "");
    }
  }

  async function cadastrarProduto() {
    if (!novoProduto.trim()) return alert("Digite o nome do produto.");
    if (Number(novaValidade) <= 0) return alert("A validade precisa ser maior que zero.");

    const nome = novoProduto.trim();

    const { error } = await supabase
      .from("produtos")
      .insert({
        nome,
        setor: novoSetor,
        validade: Number(novaValidade),
        unidade: novaUnidade,
        ativo: true,
      });

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar produto no Supabase.");
      return;
    }

    await carregarProdutos();

    setProduto(nome);
    setNovoProduto("");
    setNovaValidade(1);
    setNovaUnidade("kg");
  }

  function iniciarEdicao(nome) {
    setProdutoEditando(nome);
    setEditNome(nome);
    setEditSetor(produtos[nome].setor);
    setEditValidade(produtos[nome].validade);
    setEditUnidade(produtos[nome].unidade || "kg");
  }

  async function salvarEdicaoProduto() {
    if (!editNome.trim()) return alert("Nome inválido.");
    if (Number(editValidade) <= 0) return alert("Validade inválida.");

    const { error } = await supabase
      .from("produtos")
      .update({
        nome: editNome.trim(),
        setor: editSetor,
        validade: Number(editValidade),
        unidade: editUnidade,
      })
      .eq("nome", produtoEditando);

    if (error) {
      console.error(error);
      alert("Erro ao editar produto no Supabase.");
      return;
    }

    await carregarProdutos();

    setProduto(editNome.trim());
    setProdutoEditando("");
  }

  async function excluirProduto(nome) {
    const confirmar = confirm(`Deseja excluir o produto "${nome}"?`);
    if (!confirmar) return;

    const { error } = await supabase
      .from("produtos")
      .update({ ativo: false })
      .eq("nome", nome);

    if (error) {
      console.error(error);
      alert("Erro ao excluir produto no Supabase.");
      return;
    }

    await carregarProdutos();

    if (produto === nome) {
      const produtosRestantes = Object.keys(produtos).filter((item) => item !== nome);
      setProduto(produtosRestantes[0] || "");
    }
  }

  function montarEtiqueta(indice = 1) {
    const dataBase = dataProducao
      ? new Date(`${dataProducao}T12:00:00`)
      : new Date();

    const produtoSelecionado = produtos[produto];

    if (!produtoSelecionado) {
      alert("Produto ainda não carregado.");
      return null;
    }

    const validade = new Date(dataBase);
    validade.setDate(dataBase.getDate() + produtoSelecionado.validade);

    return {
      id: Date.now() + indice,
      produto,
      lote: gerarLote(produto, historico, dataProducao, indice),
      producao: formatarData(dataBase),
      validade: formatarData(validade),
      responsavel: funcionarioAtual,
      setor: produtoSelecionado.setor,
      diasValidade: produtoSelecionado.validade,
      quantidade: Number(quantidade) || 1,
      unidade,
      criadoEm: formatarDataHora(new Date()),
    };
  }

  async function gerarEtiqueta() {
  if (Number(quantidade) <= 0) {
    return alert("A quantidade precisa ser maior que zero.");
  }

  if (Number(quantidadeEtiquetas) <= 0) {
    return alert("A quantidade de etiquetas precisa ser maior que zero.");
  }

  const novasEtiquetas = Array.from(
    { length: Number(quantidadeEtiquetas) },
    (_, index) => montarEtiqueta(index + 1)
  ).filter(Boolean);

  if (novasEtiquetas.length === 0) return;

  setEtiqueta(novasEtiquetas[0]);
  setEtiquetasParaImprimir(novasEtiquetas);

  const etiquetasParaBanco = novasEtiquetas.map((item) => ({
    produto: item.produto,
    lote: item.lote,
    producao: item.producao.split("/").reverse().join("-"),
    validade: item.validade.split("/").reverse().join("-"),
    setor: item.setor,
    responsavel: item.responsavel,
    quantidade: `${item.quantidade} ${item.unidade}`,
    status: getStatus(item.validade),
  }));

  const { error } = await supabase
    .from("etiquetas")
    .insert(etiquetasParaBanco);

  if (error) {
    console.error(error);
    alert("Erro ao salvar etiqueta no Supabase.");
    return;
  }

  setHistorico([...novasEtiquetas, ...historico]);
}
  function excluirEtiqueta(id) {
    const confirmar = confirm("Deseja excluir esta etiqueta do histórico?");

    if (confirmar) {
      setHistorico(historico.filter((item) => item.id !== id));
      setSelecionadas(selecionadas.filter((itemId) => itemId !== id));
    }
  }

  function limparHistorico() {
    const confirmar = confirm("Tem certeza que deseja apagar o histórico inteiro?");

    if (confirmar) {
      setHistorico([]);
      setEtiqueta(null);
      setEtiquetasParaImprimir([]);
      setSelecionadas([]);
      localStorage.removeItem("historicoEtiquetas");
    }
  }

  function imprimirEtiqueta() {
    window.print();
  }

  function exportarCSV() {
    if (historico.length === 0) {
      return alert("Não há etiquetas para exportar.");
    }

    const cabecalho =
      "Produto,Lote,Produção,Validade,Status,Setor,Quantidade,Unidade,Responsável,Criado em\n";

    const linhas = historico.map((item) =>
      [
        item.produto,
        item.lote,
        item.producao,
        item.validade,
        getStatus(item.validade),
        item.setor,
        item.quantidade || "",
        item.unidade || "",
        item.responsavel,
        item.criadoEm || "",
      ]
        .map(campoCSV)
        .join(",")
    );

    baixarCSV("historico_etiquetas_stratta.csv", cabecalho, linhas);
  }

  function exportarProducaoDia() {
    const itensHoje = historico.filter((item) => item.producao === hoje);

    if (itensHoje.length === 0) {
      return alert("Não há produção registrada hoje.");
    }

    const cabecalho =
      "Produto,Lote,Produção,Validade,Setor,Quantidade,Unidade,Responsável\n";

    const linhas = itensHoje.map((item) =>
      [
        item.produto,
        item.lote,
        item.producao,
        item.validade,
        item.setor,
        item.quantidade || "",
        item.unidade || "",
        item.responsavel,
      ]
        .map(campoCSV)
        .join(",")
    );

    baixarCSV("producao_do_dia_stratta.csv", cabecalho, linhas);
  }

  function reimprimirEtiqueta(item) {
    setEtiqueta(item);
    setEtiquetasParaImprimir([item]);

    setTimeout(() => window.print(), 150);
  }

  function alternarSelecionada(id) {
    if (selecionadas.includes(id)) {
      setSelecionadas(selecionadas.filter((itemId) => itemId !== id));
    } else {
      setSelecionadas([...selecionadas, id]);
    }
  }

  function imprimirSelecionadas() {
    const etiquetasSelecionadas = historico.filter((item) =>
      selecionadas.includes(item.id)
    );

    if (etiquetasSelecionadas.length === 0) {
      return alert("Selecione pelo menos uma etiqueta.");
    }

    setEtiqueta(etiquetasSelecionadas[0]);
    setEtiquetasParaImprimir(etiquetasSelecionadas);

    setTimeout(() => window.print(), 150);
  }

  async function adicionarEquipamento() {
    const nome = novoEquipamento.trim();

    if (!nome) return alert("Digite o nome do equipamento.");
    if (equipamentos.includes(nome)) return alert("Equipamento já cadastrado.");

    const { error } = await supabase
      .from("equipamentos")
      .insert({
        nome,
        ativo: true,
      });

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar equipamento no Supabase.");
      return;
    }

    await carregarEquipamentos();

    setEquipamentoTemperatura(nome);
    setNovoEquipamento("");
  }

  async function registrarTemperatura() {
    if (temperatura === "") {
      return alert("Digite a temperatura.");
    }

    const { error } = await supabase
      .from("temperaturas")
      .insert({
        equipamento: equipamentoTemperatura,
        temperatura: Number(temperatura),
        responsavel: funcionarioAtual,
      });

    if (error) {
      console.error(error);
      alert("Erro ao registrar temperatura no Supabase.");
      return;
    }

    await carregarTemperaturas();

    setTemperatura("");
  }

  function exportarTemperaturas() {
    if (historicoTemperaturas.length === 0) {
      return alert("Não há temperaturas para exportar.");
    }

    const cabecalho = "Data/Hora,Equipamento,Temperatura,Status,Responsável\n";

    const linhas = historicoTemperaturas.map((item) =>
      [
        item.dataHora,
        item.equipamento,
        item.temperatura,
        statusTemperatura(item.temperatura),
        item.responsavel,
      ]
        .map(campoCSV)
        .join(",")
    );

    baixarCSV("temperaturas_stratta.csv", cabecalho, linhas);
  }

  async function limparTemperaturas() {
    const confirmar = confirm("Tem certeza que deseja apagar o histórico de temperaturas?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("temperaturas")
      .delete()
      .neq("id", 0);

    if (error) {
      console.error(error);
      alert("Erro ao limpar temperaturas no Supabase.");
      return;
    }

    setHistoricoTemperaturas([]);
  }

  const historicoFiltrado = historico.filter((item) => {
    const termo = busca.toLowerCase();
    const status = getStatus(item.validade);

    const bateBusca =
      item.produto.toLowerCase().includes(termo) ||
      item.lote.toLowerCase().includes(termo) ||
      item.producao.toLowerCase().includes(termo) ||
      item.validade.toLowerCase().includes(termo) ||
      item.setor.toLowerCase().includes(termo) ||
      item.responsavel.toLowerCase().includes(termo) ||
      status.toLowerCase().includes(termo);

    if (!bateBusca) return false;

    if (filtroRapido === "Todos") return true;
    if (filtroRapido === "Hoje") return item.producao === hoje;
    if (filtroRapido === "Cozinha") return item.setor === "Cozinha";
    if (filtroRapido === "Produção") return item.setor === "Produção";
    if (filtroRapido === "Vence em 48h") return status === "Vence em 48h";
    if (filtroRapido === "Vencido") return status === "Vencido";

    return true;
  });

  return (
    <div>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body,
          #root {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          #root > div > *:not(.area-impressao) {
            display: none !important;
          }

          .area-impressao {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .area-impressao * {
            visibility: visible !important;
          }

          .etiqueta-print {
            display: flex !important;
            width: 180mm !important;
            height: 90mm !important;
            margin: 5mm auto !important;
            padding: 6mm !important;
            border: 2px solid black !important;
            background: white !important;
            color: black !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            gap: 8mm !important;
            align-items: center !important;
            overflow: hidden !important;
            font-family: Arial, sans-serif !important;
          }

          .etiqueta-print:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }

          .etiqueta-print * {
            color: black !important;
          }

          .etiqueta-print h2 {
            font-size: 30px !important;
            line-height: 1 !important;
            margin: 4mm 0 !important;
          }

          .etiqueta-print p {
            font-size: 15px !important;
            margin: 1.2mm 0 !important;
          }

          .etiqueta-print hr {
            border: none !important;
            border-top: 1.5px solid black !important;
            margin: 2mm 0 !important;
          }

          .etiqueta-print canvas {
            width: 35mm !important;
            height: 35mm !important;
          }
        }
      `}</style>

      <h1>Sistema de Etiquetagem Stratta</h1>

      <nav
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <button onClick={() => setAba("etiquetas")}>Etiquetas</button>
        <button onClick={() => setAba("produtos")}>Produtos</button>
        <button onClick={() => setAba("temperaturas")}>Temperaturas</button>
      </nav>

      <LoginResponsavel
        funcionarios={funcionarios}
        funcionarioAtual={funcionarioAtual}
        setFuncionarioAtual={setFuncionarioAtual}
        novoFuncionario={novoFuncionario}
        setNovoFuncionario={setNovoFuncionario}
        adicionarFuncionario={adicionarFuncionario}
        removerFuncionario={removerFuncionario}
      />

      <hr />

      {aba === "etiquetas" && (
        <>
          <Dashboard
            etiquetasHoje={etiquetasHoje}
            etiquetasCozinha={etiquetasCozinha}
            etiquetasProducao={etiquetasProducao}
            vencendo48h={vencendo48h}
            vencidas={vencidas}
            filtroRapido={filtroRapido}
            setFiltroRapido={setFiltroRapido}
          />

          <GerarEtiqueta
            produto={produto}
            setProduto={setProduto}
            produtos={produtos}
            funcionarioAtual={funcionarioAtual}
            dataProducao={dataProducao}
            setDataProducao={setDataProducao}
            quantidade={quantidade}
            setQuantidade={setQuantidade}
            unidade={unidade}
            setUnidade={setUnidade}
            unidades={unidades}
            quantidadeEtiquetas={quantidadeEtiquetas}
            setQuantidadeEtiquetas={setQuantidadeEtiquetas}
            gerarEtiqueta={gerarEtiqueta}
            etiqueta={etiqueta}
            etiquetasParaImprimir={etiquetasParaImprimir}
            imprimirEtiqueta={imprimirEtiqueta}
          />

          <hr />

          <ProducaoHoje
            totalProduzidoHoje={totalProduzidoHoje}
            producaoPorProduto={producaoPorProduto}
            exportarProducaoDia={exportarProducaoDia}
          />

          <hr />

          <HistoricoEtiquetas
            historico={historico}
            historicoFiltrado={historicoFiltrado}
            busca={busca}
            setBusca={setBusca}
            limparHistorico={limparHistorico}
            exportarCSV={exportarCSV}
            selecionadas={selecionadas}
            setSelecionadas={setSelecionadas}
            alternarSelecionada={alternarSelecionada}
            imprimirSelecionadas={imprimirSelecionadas}
            reimprimirEtiqueta={reimprimirEtiqueta}
            excluirEtiqueta={excluirEtiqueta}
          />
        </>
      )}

      {aba === "produtos" && (
        <Produtos
          produtos={produtos}
          setores={setores}
          unidades={unidades}
          novoProduto={novoProduto}
          setNovoProduto={setNovoProduto}
          novoSetor={novoSetor}
          setNovoSetor={setNovoSetor}
          novaValidade={novaValidade}
          setNovaValidade={setNovaValidade}
          novaUnidade={novaUnidade}
          setNovaUnidade={setNovaUnidade}
          cadastrarProduto={cadastrarProduto}
          produtoEditando={produtoEditando}
          editNome={editNome}
          setEditNome={setEditNome}
          editSetor={editSetor}
          setEditSetor={setEditSetor}
          editValidade={editValidade}
          setEditValidade={setEditValidade}
          editUnidade={editUnidade}
          setEditUnidade={setEditUnidade}
          iniciarEdicao={iniciarEdicao}
          salvarEdicaoProduto={salvarEdicaoProduto}
          cancelarEdicao={() => setProdutoEditando("")}
          excluirProduto={excluirProduto}
        />
      )}

      {aba === "temperaturas" && (
        <Temperaturas
          equipamentos={equipamentos}
          novoEquipamento={novoEquipamento}
          setNovoEquipamento={setNovoEquipamento}
          adicionarEquipamento={adicionarEquipamento}
          equipamentoTemperatura={equipamentoTemperatura}
          setEquipamentoTemperatura={setEquipamentoTemperatura}
          temperatura={temperatura}
          setTemperatura={setTemperatura}
          registrarTemperatura={registrarTemperatura}
          historicoTemperaturas={historicoTemperaturas}
          exportarTemperaturas={exportarTemperaturas}
          limparTemperaturas={limparTemperaturas}
        />
      )}
    </div>
  );
}

export default App;
