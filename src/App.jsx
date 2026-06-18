import { useEffect, useState } from "react";

import { supabase } from "./services/supabase";
import Dashboard from "./components/Dashboard";
import GerarEtiqueta from "./components/GerarEtiqueta";
import HistoricoEtiquetas from "./components/HistoricoEtiquetas";
import LoginResponsavel from "./components/LoginResponsavel";
import ProducaoHoje from "./components/ProducaoHoje";
import Produtos from "./components/Produtos";
import Temperaturas from "./components/Temperaturas";
import OrdensProducao from "./components/OrdensProducao";
import Estoque from "./components/Estoque";
import FichasTecnicas from "./components/FichasTecnicas";
import Checklist from "./components/Checklist";

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

  const [ordensProducao, setOrdensProducao] = useState([]);

  const [ordemProduto, setOrdemProduto] = useState("");
  const [ordemQuantidade, setOrdemQuantidade] = useState(1);
  const [ordemUnidade, setOrdemUnidade] = useState("kg");
  const [ordemData, setOrdemData] = useState(hojeInput());
  const [ordemObservacao, setOrdemObservacao] = useState("");

  const [estoqueItens, setEstoqueItens] = useState([]);
  const [estoqueMovimentos, setEstoqueMovimentos] = useState([]);
  const [novoItemEstoque, setNovoItemEstoque] = useState("");
  const [novaCategoriaEstoque, setNovaCategoriaEstoque] = useState("");
  const [novaUnidadeEstoque, setNovaUnidadeEstoque] = useState("kg");
  const [novoCustoCompra, setNovoCustoCompra] = useState(0);
  const [novoEstoqueMinimo, setNovoEstoqueMinimo] = useState(0);
  const [movimentoItemId, setMovimentoItemId] = useState("");
  const [movimentoTipo, setMovimentoTipo] = useState("Entrada");
  const [movimentoQuantidade, setMovimentoQuantidade] = useState(1);
  const [movimentoMotivo, setMovimentoMotivo] = useState("");

  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const [fichaIngredientes, setFichaIngredientes] = useState([]);
  const [novaFichaNome, setNovaFichaNome] = useState("");
  const [fichaRendimento, setFichaRendimento] = useState(1);
  const [fichaUnidadeRendimento, setFichaUnidadeRendimento] = useState("porções");
  const [fichaPrecoVenda, setFichaPrecoVenda] = useState(0);
  const [fichaSelecionadaId, setFichaSelecionadaId] = useState("");
  const [ingredienteItemId, setIngredienteItemId] = useState("");
  const [ingredienteQuantidade, setIngredienteQuantidade] = useState(1);
  const [ingredienteUnidade, setIngredienteUnidade] = useState("kg");

  const [fichaSubfichas, setFichaSubfichas] = useState([]);
  const [subfichaSelecionadaId, setSubfichaSelecionadaId] = useState("");
  const [subfichaQuantidade, setSubfichaQuantidade] = useState(1);
  const [subfichaUnidade, setSubfichaUnidade] = useState("L");

  const [checklistModelos, setChecklistModelos] = useState([]);
  const [checklistItens, setChecklistItens] = useState([]);
  const [checklistExecucoes, setChecklistExecucoes] = useState([]);
  const [checklistRespostas, setChecklistRespostas] = useState([]);
  const [novoModeloChecklist, setNovoModeloChecklist] = useState("");
  const [novaCategoriaChecklist, setNovaCategoriaChecklist] = useState("Abertura");
  const [modeloChecklistSelecionadoId, setModeloChecklistSelecionadoId] = useState("");
  const [novoItemChecklist, setNovoItemChecklist] = useState("");


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

  async function carregarOrdens() {
    const { data, error } = await supabase
      .from("ordens_producao")
      .select("*")
      .order("data_producao", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Erro ao carregar ordens de produção.");
      return;
    }

    setOrdensProducao(data);
  }


  async function carregarEstoque() {
    const { data: itens, error: erroItens } = await supabase
      .from("estoque_itens")
      .select("*")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (erroItens) {
      console.error(erroItens);
      alert("Erro ao carregar itens de estoque.");
      return;
    }

    const { data: movimentos, error: erroMovimentos } = await supabase
      .from("estoque_movimentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (erroMovimentos) {
      console.error(erroMovimentos);
      alert("Erro ao carregar movimentos de estoque.");
      return;
    }

    setEstoqueItens(itens || []);
    setEstoqueMovimentos(movimentos || []);

    if (itens?.length && !movimentoItemId) {
      setMovimentoItemId(String(itens[0].id));
    }

    if (itens?.length && !ingredienteItemId) {
      setIngredienteItemId(String(itens[0].id));
      setIngredienteUnidade(itens[0].unidade || "kg");
    }
  }

  async function carregarFichasTecnicas() {
    const { data: fichas, error: erroFichas } = await supabase
      .from("fichas_tecnicas")
      .select("*")
      .eq("ativo", true)
      .order("nome", { ascending: true });

    if (erroFichas) {
      console.error(erroFichas);
      alert("Erro ao carregar fichas técnicas.");
      return;
    }

    const { data: ingredientes, error: erroIngredientes } = await supabase
      .from("ficha_ingredientes")
      .select("*")
      .order("created_at", { ascending: true });

    if (erroIngredientes) {
      console.error(erroIngredientes);
      alert("Erro ao carregar ingredientes das fichas.");
      return;
    }

    const { data: subfichas, error: erroSubfichas } = await supabase
      .from("ficha_subfichas")
      .select("*")
      .order("created_at", { ascending: true });

    if (erroSubfichas) {
      console.error(erroSubfichas);
      alert("Erro ao carregar subfichas.");
      return;
    }

    setFichasTecnicas(fichas || []);
    setFichaIngredientes(ingredientes || []);
    setFichaSubfichas(subfichas || []);

    if (fichas?.length && !fichaSelecionadaId) {
      setFichaSelecionadaId(String(fichas[0].id));
    }

    if (fichas?.length && !subfichaSelecionadaId) {
      const fichaPrincipalInicial = String(fichas[0].id);

      const primeiraSubfichaValida = fichas.find((item) => {
        return String(item.id) !== fichaPrincipalInicial;
      });

      if (primeiraSubfichaValida) {
        setSubfichaSelecionadaId(String(primeiraSubfichaValida.id));
      }
    }
  }

  async function carregarChecklist() {
    const { data: modelos, error: erroModelos } = await supabase
      .from("checklist_modelos")
      .select("*")
      .eq("ativo", true)
      .order("created_at", { ascending: false });

    if (erroModelos) {
      console.error(erroModelos);
      alert("Erro ao carregar modelos de checklist.");
      return;
    }

    const { data: itens, error: erroItens } = await supabase
      .from("checklist_itens")
      .select("*")
      .eq("ativo", true)
      .order("created_at", { ascending: true });

    if (erroItens) {
      console.error(erroItens);
      alert("Erro ao carregar itens do checklist.");
      return;
    }

    const { data: execucoes, error: erroExecucoes } = await supabase
      .from("checklist_execucoes")
      .select("*")
      .order("created_at", { ascending: false });

    if (erroExecucoes) {
      console.error(erroExecucoes);
      alert("Erro ao carregar execuções do checklist.");
      return;
    }

    const { data: respostas, error: erroRespostas } = await supabase
      .from("checklist_respostas")
      .select("*")
      .order("created_at", { ascending: true });

    if (erroRespostas) {
      console.error(erroRespostas);
      alert("Erro ao carregar respostas do checklist.");
      return;
    }

    setChecklistModelos(modelos || []);
    setChecklistItens(itens || []);
    setChecklistExecucoes(execucoes || []);
    setChecklistRespostas(respostas || []);

    if (modelos?.length && !modeloChecklistSelecionadoId) {
      setModeloChecklistSelecionadoId(String(modelos[0].id));
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarFuncionarios();
    carregarEquipamentos();
    carregarTemperaturas();
    carregarOrdens();
    carregarEstoque();
    carregarFichasTecnicas();
    carregarChecklist();
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

  useEffect(() => {
    const primeiroProduto = Object.keys(produtos)[0];

    if (primeiroProduto && !ordemProduto) {
      setOrdemProduto(primeiroProduto);
      setOrdemUnidade(produtos[primeiroProduto]?.unidade || "kg");
    }
  }, [produtos, ordemProduto]);

  useEffect(() => {
    if (produtos[ordemProduto]?.unidade) {
      setOrdemUnidade(produtos[ordemProduto].unidade);
    }
  }, [ordemProduto, produtos]);

  useEffect(() => {
    const item = estoqueItens.find((estoqueItem) => String(estoqueItem.id) === String(movimentoItemId));

    if (item) {
      setNovaUnidadeEstoque(item.unidade || "kg");
    }
  }, [movimentoItemId, estoqueItens]);

  useEffect(() => {
    const item = estoqueItens.find((estoqueItem) => String(estoqueItem.id) === String(ingredienteItemId));

    if (item) {
      setIngredienteUnidade(item.unidade || "kg");
    }
  }, [ingredienteItemId, estoqueItens]);

  useEffect(() => {
    const ficha = fichasTecnicas.find((item) => {
      return String(item.id) === String(subfichaSelecionadaId);
    });

    if (ficha?.unidade_rendimento) {
      setSubfichaUnidade(ficha.unidade_rendimento);
    }
  }, [subfichaSelecionadaId, fichasTecnicas]);

  useEffect(() => {
    if (!fichaSelecionadaId) return;

    const primeiraSubfichaValida = fichasTecnicas.find((item) => {
      return String(item.id) !== String(fichaSelecionadaId);
    });

    if (
      primeiraSubfichaValida &&
      String(subfichaSelecionadaId) === String(fichaSelecionadaId)
    ) {
      setSubfichaSelecionadaId(String(primeiraSubfichaValida.id));
    }
  }, [fichaSelecionadaId, fichasTecnicas, subfichaSelecionadaId]);

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

  async function criarOrdem() {
    if (!ordemProduto) return alert("Selecione um produto.");
    if (Number(ordemQuantidade) <= 0) {
      return alert("A quantidade precisa ser maior que zero.");
    }

    const { error } = await supabase
      .from("ordens_producao")
      .insert({
        produto: ordemProduto,
        quantidade: Number(ordemQuantidade),
        unidade: ordemUnidade,
        responsavel: funcionarioAtual,
        status: "Pendente",
        observacao: ordemObservacao,
        data_producao: ordemData,
      });

    if (error) {
      console.error(error);
      alert("Erro ao criar ordem de produção.");
      return;
    }

    await carregarOrdens();

    setOrdemQuantidade(1);
    setOrdemObservacao("");
  }

  async function atualizarStatusOrdem(id, novoStatus) {
    const { error } = await supabase
      .from("ordens_producao")
      .update({ status: novoStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao atualizar ordem de produção.");
      return;
    }

    await carregarOrdens();
  }

  async function excluirOrdem(id) {
    const confirmar = confirm("Deseja excluir esta ordem de produção?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("ordens_producao")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir ordem de produção.");
      return;
    }

    await carregarOrdens();
  }


  function calcularSaldoEstoque(itemId) {
    return estoqueMovimentos.reduce((saldo, mov) => {
      if (String(mov.item_id) !== String(itemId)) return saldo;

      const quantidadeMovimento = Number(mov.quantidade || 0);

      if (mov.tipo === "Entrada") return saldo + quantidadeMovimento;
      if (mov.tipo === "Saída") return saldo - quantidadeMovimento;
      if (mov.tipo === "Ajuste") return quantidadeMovimento;

      return saldo;
    }, 0);
  }

  async function criarItemEstoque() {
    const nome = novoItemEstoque.trim();

    if (!nome) return alert("Digite o nome do item.");
    if (!novaUnidadeEstoque.trim()) return alert("Digite a unidade.");

    const { error } = await supabase
      .from("estoque_itens")
      .insert({
        nome,
        categoria: novaCategoriaEstoque,
        unidade: novaUnidadeEstoque,
        custo_compra: Number(novoCustoCompra) || 0,
        estoque_minimo: Number(novoEstoqueMinimo) || 0,
        ativo: true,
      });

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar item de estoque.");
      return;
    }

    await carregarEstoque();

    setNovoItemEstoque("");
    setNovaCategoriaEstoque("");
    setNovoCustoCompra(0);
    setNovoEstoqueMinimo(0);
  }

  async function registrarMovimentoEstoque() {
    if (!movimentoItemId) return alert("Selecione um item.");
    if (Number(movimentoQuantidade) <= 0) {
      return alert("A quantidade precisa ser maior que zero.");
    }

    const item = estoqueItens.find((estoqueItem) => String(estoqueItem.id) === String(movimentoItemId));

    if (!item) return alert("Item não encontrado.");

    const { error } = await supabase
      .from("estoque_movimentos")
      .insert({
        item_id: item.id,
        item_nome: item.nome,
        tipo: movimentoTipo,
        quantidade: Number(movimentoQuantidade),
        unidade: item.unidade,
        motivo: movimentoMotivo,
        responsavel: funcionarioAtual,
      });

    if (error) {
      console.error(error);
      alert("Erro ao registrar movimento de estoque.");
      return;
    }

    await carregarEstoque();

    setMovimentoQuantidade(1);
    setMovimentoMotivo("");
  }

  async function criarFichaTecnica() {
    const nome = novaFichaNome.trim();

    if (!nome) return alert("Digite o nome da ficha.");
    if (Number(fichaRendimento) <= 0) return alert("O rendimento precisa ser maior que zero.");

    const { error } = await supabase
      .from("fichas_tecnicas")
      .insert({
        nome,
        rendimento: Number(fichaRendimento),
        unidade_rendimento: fichaUnidadeRendimento,
        preco_venda: Number(fichaPrecoVenda) || 0,
        ativo: true,
      });

    if (error) {
      console.error(error);
      alert("Erro ao criar ficha técnica.");
      return;
    }

    await carregarFichasTecnicas();

    setNovaFichaNome("");
    setFichaRendimento(1);
    setFichaPrecoVenda(0);
  }

  async function adicionarIngredienteFicha() {
    if (!fichaSelecionadaId) return alert("Selecione uma ficha.");
    if (!ingredienteItemId) return alert("Selecione um item de estoque.");
    if (Number(ingredienteQuantidade) <= 0) {
      return alert("A quantidade precisa ser maior que zero.");
    }

    const item = estoqueItens.find((estoqueItem) => String(estoqueItem.id) === String(ingredienteItemId));

    if (!item) return alert("Item de estoque não encontrado.");

    const { error } = await supabase
      .from("ficha_ingredientes")
      .insert({
        ficha_id: Number(fichaSelecionadaId),
        item_id: item.id,
        item_nome: item.nome,
        quantidade: Number(ingredienteQuantidade),
        unidade: ingredienteUnidade,
        custo_unitario: Number(item.custo_compra || 0),
      });

    if (error) {
      console.error(error);
      alert("Erro ao adicionar ingrediente na ficha.");
      return;
    }

    await carregarFichasTecnicas();

    setIngredienteQuantidade(1);
  }

  async function adicionarSubfichaNaFicha() {
    if (!fichaSelecionadaId) return alert("Selecione uma ficha principal.");
    if (!subfichaSelecionadaId) return alert("Selecione uma subficha.");

    if (String(fichaSelecionadaId) === String(subfichaSelecionadaId)) {
      return alert("Uma ficha não pode usar ela mesma como subficha.");
    }

    if (Number(subfichaQuantidade) <= 0) {
      return alert("A quantidade da subficha precisa ser maior que zero.");
    }

    const subficha = fichasTecnicas.find((item) => {
      return String(item.id) === String(subfichaSelecionadaId);
    });

    if (!subficha) return alert("Subficha não encontrada.");

    const { error } = await supabase
      .from("ficha_subfichas")
      .insert({
        ficha_id: Number(fichaSelecionadaId),
        subficha_id: Number(subfichaSelecionadaId),
        subficha_nome: subficha.nome,
        quantidade: Number(subfichaQuantidade),
        unidade: subfichaUnidade,
      });

    if (error) {
      console.error(error);
      alert("Erro ao adicionar subficha.");
      return;
    }

    await carregarFichasTecnicas();

    setSubfichaQuantidade(1);
  }

  async function excluirFichaTecnica(id) {
    const confirmar = confirm("Deseja excluir esta ficha técnica?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("fichas_tecnicas")
      .update({ ativo: false })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir ficha técnica.");
      return;
    }

    await carregarFichasTecnicas();
  }

  function normalizarUnidade(unidade) {
    return String(unidade || "").trim().toLowerCase();
  }

  function converterParaUnidadeCompra(quantidade, unidadeUsada, unidadeCompra) {
    const qtd = Number(quantidade || 0);
    const usada = normalizarUnidade(unidadeUsada);
    const compra = normalizarUnidade(unidadeCompra);

    if (usada === compra) return qtd;

    if (usada === "g" && compra === "kg") return qtd / 1000;
    if (usada === "kg" && compra === "g") return qtd * 1000;

    if (usada === "ml" && (compra === "l" || compra === "lt")) return qtd / 1000;
    if ((usada === "l" || usada === "lt") && compra === "ml") return qtd * 1000;

    return qtd;
  }

  function calcularCustoIngredienteFicha(item) {
    const itemEstoque = estoqueItens.find((estoqueItem) => {
      return String(estoqueItem.id) === String(item.item_id);
    });

    const unidadeCompra = itemEstoque?.unidade || item.unidade;
    const quantidadeConvertida = converterParaUnidadeCompra(
      item.quantidade,
      item.unidade,
      unidadeCompra
    );

    return quantidadeConvertida * Number(item.custo_unitario || 0);
  }

  function calcularCustoSubficha(item, visitadas = new Set()) {
    const subficha = fichasTecnicas.find((ficha) => {
      return String(ficha.id) === String(item.subficha_id);
    });

    if (!subficha) return 0;

    const custoTotalSubficha = calcularCustoFicha(subficha.id, visitadas);
    const rendimento = Number(subficha.rendimento || 0);

    if (rendimento <= 0) return 0;

    const quantidadeConvertida = converterParaUnidadeCompra(
      item.quantidade,
      item.unidade,
      subficha.unidade_rendimento
    );

    const custoPorUnidadeRendimento = custoTotalSubficha / rendimento;

    return quantidadeConvertida * custoPorUnidadeRendimento;
  }

  function calcularCustoFicha(fichaId, visitadas = new Set()) {
    const id = String(fichaId);

    if (visitadas.has(id)) return 0;

    const proximasVisitadas = new Set(visitadas);
    proximasVisitadas.add(id);

    const custoIngredientes = fichaIngredientes
      .filter((item) => String(item.ficha_id) === id)
      .reduce((total, item) => {
        return total + calcularCustoIngredienteFicha(item);
      }, 0);

    const custoSubfichas = fichaSubfichas
      .filter((item) => String(item.ficha_id) === id)
      .reduce((total, item) => {
        return total + calcularCustoSubficha(item, proximasVisitadas);
      }, 0);

    return custoIngredientes + custoSubfichas;
  }

  async function criarModeloChecklist() {
    const nome = novoModeloChecklist.trim();

    if (!nome) return alert("Digite o nome do checklist.");

    const { error } = await supabase
      .from("checklist_modelos")
      .insert({
        nome,
        categoria: novaCategoriaChecklist,
        ativo: true,
      });

    if (error) {
      console.error(error);
      alert("Erro ao criar modelo de checklist.");
      return;
    }

    await carregarChecklist();

    setNovoModeloChecklist("");
  }

  async function adicionarItemChecklist() {
    if (!modeloChecklistSelecionadoId) return alert("Selecione um modelo.");
    if (!novoItemChecklist.trim()) return alert("Digite o item do checklist.");

    const { error } = await supabase
      .from("checklist_itens")
      .insert({
        modelo_id: Number(modeloChecklistSelecionadoId),
        descricao: novoItemChecklist.trim(),
        ativo: true,
      });

    if (error) {
      console.error(error);
      alert("Erro ao adicionar item no checklist.");
      return;
    }

    await carregarChecklist();

    setNovoItemChecklist("");
  }

  async function executarChecklist() {
    if (!modeloChecklistSelecionadoId) return alert("Selecione um modelo.");

    const modelo = checklistModelos.find((item) => String(item.id) === String(modeloChecklistSelecionadoId));
    if (!modelo) return alert("Modelo não encontrado.");

    const itensDoModelo = checklistItens.filter((item) => String(item.modelo_id) === String(modeloChecklistSelecionadoId));
    if (itensDoModelo.length === 0) return alert("Este modelo ainda não tem itens.");

    const { data: execucao, error: erroExecucao } = await supabase
      .from("checklist_execucoes")
      .insert({
        modelo_id: modelo.id,
        modelo_nome: modelo.nome,
        responsavel: funcionarioAtual,
        data_execucao: hojeInput(),
      })
      .select()
      .single();

    if (erroExecucao) {
      console.error(erroExecucao);
      alert("Erro ao iniciar checklist.");
      return;
    }

    const respostas = itensDoModelo.map((item) => ({
      execucao_id: execucao.id,
      item_id: item.id,
      descricao: item.descricao,
      concluido: false,
    }));

    const { error: erroRespostas } = await supabase
      .from("checklist_respostas")
      .insert(respostas);

    if (erroRespostas) {
      console.error(erroRespostas);
      alert("Erro ao criar respostas do checklist.");
      return;
    }

    await carregarChecklist();
  }

  async function alternarRespostaChecklist(id, concluido) {
    const { error } = await supabase
      .from("checklist_respostas")
      .update({ concluido })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao atualizar checklist.");
      return;
    }

    await carregarChecklist();
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

  const ordensHoje = ordensProducao.filter((ordem) => {
    return ordem.data_producao === hojeInput();
  });

  const ordensPendentes = ordensHoje.filter(
    (ordem) => ordem.status === "Pendente"
  ).length;

  const ordensEmProducao = ordensHoje.filter(
    (ordem) => ordem.status === "Em Produção"
  ).length;

  const ordensConcluidas = ordensHoje.filter(
    (ordem) => ordem.status === "Concluído"
  ).length;

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
        <button onClick={() => setAba("ordens")}>Ordens</button>
        <button onClick={() => setAba("estoque")}>Estoque</button>
        <button onClick={() => setAba("fichas")}>Fichas Técnicas</button>
        <button onClick={() => setAba("checklist")}>Checklist</button>
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

      {aba === "ordens" && (
        <>
          <h2>Resumo das Ordens de Hoje</h2>

          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "25px",
            }}
          >
            <div style={{ border: "1px solid white", padding: "15px", minWidth: "170px" }}>
              <h3>📋 Ordens Hoje</h3>
              <h2>{ordensHoje.length}</h2>
            </div>

            <div style={{ border: "1px solid white", padding: "15px", minWidth: "170px" }}>
              <h3>⏳ Pendentes</h3>
              <h2>{ordensPendentes}</h2>
            </div>

            <div style={{ border: "1px solid white", padding: "15px", minWidth: "170px" }}>
              <h3>🔥 Em Produção</h3>
              <h2>{ordensEmProducao}</h2>
            </div>

            <div style={{ border: "1px solid white", padding: "15px", minWidth: "170px" }}>
              <h3>✅ Concluídas</h3>
              <h2>{ordensConcluidas}</h2>
            </div>
          </div>

          <OrdensProducao
            produtos={produtos}
            unidades={unidades}
            funcionarios={funcionarios}
            funcionarioAtual={funcionarioAtual}
            ordemProduto={ordemProduto}
            setOrdemProduto={setOrdemProduto}
            ordemQuantidade={ordemQuantidade}
            setOrdemQuantidade={setOrdemQuantidade}
            ordemUnidade={ordemUnidade}
            setOrdemUnidade={setOrdemUnidade}
            ordemData={ordemData}
            setOrdemData={setOrdemData}
            ordemObservacao={ordemObservacao}
            setOrdemObservacao={setOrdemObservacao}
            criarOrdem={criarOrdem}
            ordensProducao={ordensHoje}
            atualizarStatusOrdem={atualizarStatusOrdem}
            excluirOrdem={excluirOrdem}
          />
        </>
      )}

      {aba === "estoque" && (
        <Estoque
          estoqueItens={estoqueItens}
          estoqueMovimentos={estoqueMovimentos}
          novoItemEstoque={novoItemEstoque}
          setNovoItemEstoque={setNovoItemEstoque}
          novaCategoriaEstoque={novaCategoriaEstoque}
          setNovaCategoriaEstoque={setNovaCategoriaEstoque}
          novaUnidadeEstoque={novaUnidadeEstoque}
          setNovaUnidadeEstoque={setNovaUnidadeEstoque}
          novoCustoCompra={novoCustoCompra}
          setNovoCustoCompra={setNovoCustoCompra}
          novoEstoqueMinimo={novoEstoqueMinimo}
          setNovoEstoqueMinimo={setNovoEstoqueMinimo}
          criarItemEstoque={criarItemEstoque}
          movimentoItemId={movimentoItemId}
          setMovimentoItemId={setMovimentoItemId}
          movimentoTipo={movimentoTipo}
          setMovimentoTipo={setMovimentoTipo}
          movimentoQuantidade={movimentoQuantidade}
          setMovimentoQuantidade={setMovimentoQuantidade}
          movimentoMotivo={movimentoMotivo}
          setMovimentoMotivo={setMovimentoMotivo}
          registrarMovimentoEstoque={registrarMovimentoEstoque}
          calcularSaldoEstoque={calcularSaldoEstoque}
          unidades={unidades}
        />
      )}

      {aba === "fichas" && (
        <FichasTecnicas
          estoqueItens={estoqueItens}
          fichasTecnicas={fichasTecnicas}
          fichaIngredientes={fichaIngredientes}
          fichaSubfichas={fichaSubfichas}
          novaFichaNome={novaFichaNome}
          setNovaFichaNome={setNovaFichaNome}
          fichaRendimento={fichaRendimento}
          setFichaRendimento={setFichaRendimento}
          fichaUnidadeRendimento={fichaUnidadeRendimento}
          setFichaUnidadeRendimento={setFichaUnidadeRendimento}
          fichaPrecoVenda={fichaPrecoVenda}
          setFichaPrecoVenda={setFichaPrecoVenda}
          criarFichaTecnica={criarFichaTecnica}
          fichaSelecionadaId={fichaSelecionadaId}
          setFichaSelecionadaId={setFichaSelecionadaId}
          ingredienteItemId={ingredienteItemId}
          setIngredienteItemId={setIngredienteItemId}
          ingredienteQuantidade={ingredienteQuantidade}
          setIngredienteQuantidade={setIngredienteQuantidade}
          ingredienteUnidade={ingredienteUnidade}
          setIngredienteUnidade={setIngredienteUnidade}
          subfichaSelecionadaId={subfichaSelecionadaId}
          setSubfichaSelecionadaId={setSubfichaSelecionadaId}
          subfichaQuantidade={subfichaQuantidade}
          setSubfichaQuantidade={setSubfichaQuantidade}
          subfichaUnidade={subfichaUnidade}
          setSubfichaUnidade={setSubfichaUnidade}
          adicionarIngredienteFicha={adicionarIngredienteFicha}
          adicionarSubfichaNaFicha={adicionarSubfichaNaFicha}
          excluirFichaTecnica={excluirFichaTecnica}
          calcularCustoFicha={calcularCustoFicha}
          calcularCustoIngredienteFicha={calcularCustoIngredienteFicha}
          calcularCustoSubficha={calcularCustoSubficha}
          unidades={unidades}
        />
      )}

      {aba === "checklist" && (
        <Checklist
          checklistModelos={checklistModelos}
          checklistItens={checklistItens}
          checklistExecucoes={checklistExecucoes}
          checklistRespostas={checklistRespostas}
          novoModeloChecklist={novoModeloChecklist}
          setNovoModeloChecklist={setNovoModeloChecklist}
          novaCategoriaChecklist={novaCategoriaChecklist}
          setNovaCategoriaChecklist={setNovaCategoriaChecklist}
          criarModeloChecklist={criarModeloChecklist}
          modeloChecklistSelecionadoId={modeloChecklistSelecionadoId}
          setModeloChecklistSelecionadoId={setModeloChecklistSelecionadoId}
          novoItemChecklist={novoItemChecklist}
          setNovoItemChecklist={setNovoItemChecklist}
          adicionarItemChecklist={adicionarItemChecklist}
          executarChecklist={executarChecklist}
          alternarRespostaChecklist={alternarRespostaChecklist}
        />
      )}
    </div>
  );
}

export default App;
